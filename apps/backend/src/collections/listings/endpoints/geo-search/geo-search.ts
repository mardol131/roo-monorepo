import type { Endpoint, PayloadRequest } from 'payload'
import zod from 'zod'

// Converts a Payload WHERE clause to a raw MongoDB query object.
// Handles the operators used in createListingsQuery on the frontend.
function payloadWhereToMongo(where: Record<string, unknown>): Record<string, unknown> {
  if (!where || typeof where !== 'object') return {}

  if ('and' in where && Array.isArray(where.and)) {
    return { $and: where.and.map((w) => payloadWhereToMongo(w as Record<string, unknown>)) }
  }
  if ('or' in where && Array.isArray(where.or)) {
    return { $or: where.or.map((w) => payloadWhereToMongo(w as Record<string, unknown>)) }
  }

  const result: Record<string, unknown> = {}
  for (const [field, condition] of Object.entries(where)) {
    if (condition !== null && typeof condition === 'object') {
      const cond = condition as Record<string, unknown>
      if ('equals' in cond) result[field] = cond.equals
      else if ('greater_than_equal' in cond) result[field] = { $gte: cond.greater_than_equal }
      else if ('less_than_equal' in cond) result[field] = { $lte: cond.less_than_equal }
      else if ('in' in cond) result[field] = { $in: cond.in }
      else if ('not_equals' in cond) result[field] = { $ne: cond.not_equals }
    }
  }
  return result
}

const querySchema = zod.object({
  city: zod.string().optional(),
  district: zod.string().optional(),
  region: zod.string().optional(),
  type: zod.enum(['gastro', 'entertainment']),
  page: zod.coerce.number().int().min(1).default(1),
  limit: zod.coerce.number().int().min(1).max(100).default(12),
  where: zod.string().optional(),
})

export const geoSearch: Endpoint = {
  path: '/geo-search',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const { searchParams } = new URL(req.url ?? '', 'http://localhost')

    const parsed = querySchema.safeParse({
      city: searchParams.get('city') ?? undefined,
      district: searchParams.get('district') ?? undefined,
      region: searchParams.get('region') ?? undefined,
      type: searchParams.get('type'),
      page: searchParams.get('page') ?? 1,
      limit: searchParams.get('limit') ?? 12,
      where: searchParams.get('where') ?? undefined,
    })

    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues }, { status: 400 })
    }

    const { city, district, region, type, page, limit, where: whereJson } = parsed.data
    const extraMongoWhere = whereJson ? payloadWhereToMongo(JSON.parse(whereJson)) : null

    let refLat: number | null = null
    let refLon: number | null = null
    let bboxMinLat = 0
    let bboxMaxLat = 0
    let bboxMinLon = 0
    let bboxMaxLon = 0
    let halfDiagonalKm = 0

    if (city) {
      const cityDoc = await req.payload.findByID({
        collection: 'cities',
        id: city,
        depth: 0,
        overrideAccess: true,
      })
      if (cityDoc) {
        refLat = cityDoc.latitude
        refLon = cityDoc.longitude
        // Degenerate bbox for a city — closest-point collapses to the city point itself.
        bboxMinLat = bboxMaxLat = refLat
        bboxMinLon = bboxMaxLon = refLon
        halfDiagonalKm = 0
      }
    } else if (district) {
      const districtDoc = await req.payload.findByID({
        collection: 'districts',
        id: district,
        depth: 0,
        overrideAccess: true,
      })
      if (districtDoc) {
        bboxMinLat = districtDoc.bboxMinLat
        bboxMaxLat = districtDoc.bboxMaxLat
        bboxMinLon = districtDoc.bboxMinLon
        bboxMaxLon = districtDoc.bboxMaxLon
        refLat = (bboxMinLat + bboxMaxLat) / 2
        refLon = (bboxMinLon + bboxMaxLon) / 2
        halfDiagonalKm = bboxHalfDiagonalKm(bboxMinLat, bboxMaxLat, bboxMinLon, bboxMaxLon)
      }
    } else if (region) {
      const regionDoc = await req.payload.findByID({
        collection: 'regions',
        id: region,
        depth: 0,
        overrideAccess: true,
      })
      if (regionDoc) {
        bboxMinLat = regionDoc.bboxMinLat
        bboxMaxLat = regionDoc.bboxMaxLat
        bboxMinLon = regionDoc.bboxMinLon
        bboxMaxLon = regionDoc.bboxMaxLon
        refLat = (bboxMinLat + bboxMaxLat) / 2
        refLon = (bboxMinLon + bboxMaxLon) / 2
        halfDiagonalKm = bboxHalfDiagonalKm(bboxMinLat, bboxMaxLat, bboxMinLon, bboxMaxLon)
      }
    }

    // No location resolved — fall back to standard Payload pagination (no geo filter)
    if (refLat === null || refLon === null) {
      const fallback = await req.payload.find({
        collection: 'listings',
        where: {
          and: [
            { status: { equals: 'active' } },
            { subscriptionStatus: { equals: 'paid' } },
            { type: { equals: type } },
          ],
        },
        depth: 1,
        overrideAccess: true,
        limit,
        page,
      })
      return Response.json(fallback)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model = req.payload.db.collections['listings']
    const skip = (page - 1) * limit

    // $geoNear maxDistance is expanded by half the bbox diagonal so that listings
    // near the bbox edge (but outside the center radius) are not missed.
    // distanceMultiplier 0.001 converts metres → km (2dsphere returns metres).
    const maxDistanceM = (500 + halfDiagonalKm) * 1000

    const [aggResult] = await model.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [refLon, refLat] },
          distanceField: 'distKm',
          distanceMultiplier: 0.001,
          spherical: true,
          maxDistance: maxDistanceM,
          key: 'location.point',
          query: { status: 'active', subscriptionStatus: 'paid', type },
        },
      },
      // Compute Euclidean distance (in km) from the listing's base to the closest
      // point on the selected bbox.  For a city the bbox is a degenerate point so
      // this equals the straight-line distance to the city centre.
      // Using an Euclidean approximation (error < 1 % for Czech Republic distances).
      {
        $addFields: {
          _closestDistKm: {
            $let: {
              vars: {
                lat: { $arrayElemAt: ['$location.point.coordinates', 1] },
                lon: { $arrayElemAt: ['$location.point.coordinates', 0] },
              },
              in: {
                $let: {
                  vars: {
                    cLat: { $max: [bboxMinLat, { $min: [bboxMaxLat, '$$lat'] }] },
                    cLon: { $max: [bboxMinLon, { $min: [bboxMaxLon, '$$lon'] }] },
                  },
                  in: {
                    $multiply: [
                      111,
                      {
                        $sqrt: {
                          $add: [
                            { $pow: [{ $subtract: ['$$lat', '$$cLat'] }, 2] },
                            {
                              $pow: [
                                {
                                  $multiply: [
                                    { $subtract: ['$$lon', '$$cLon'] },
                                    { $cos: { $degreesToRadians: '$$lat' } },
                                  ],
                                },
                                2,
                              ],
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      {
        $match: {
          $or: [
            { 'servicableArea.wholeCountry': true },
            { $expr: { $lte: ['$_closestDistKm', '$servicableArea.maxTravelDistanceKm'] } },
          ],
        },
      },
      ...(extraMongoWhere ? [{ $match: extraMongoWhere }] : []),
      {
        $facet: {
          ids: [{ $skip: skip }, { $limit: limit }, { $project: { _id: 1, distKm: 1 } }],
          total: [{ $count: 'count' }],
        },
      },
    ])

    const aggIds: { _id: unknown; distKm: number }[] = aggResult?.ids ?? []
    const rawIds: string[] = aggIds.map((d) => String(d._id))
    const distances: Record<string, number> = Object.fromEntries(
      aggIds.map((d) => [String(d._id), d.distKm]),
    )
    const totalDocs: number = aggResult?.total?.[0]?.count ?? 0
    const totalPages = Math.ceil(totalDocs / limit)

    // Fetch fully populated docs for the current page only (at most `limit` documents).
    const { docs: unorderedDocs } = rawIds.length
      ? await req.payload.find({
          collection: 'listings',
          where: { id: { in: rawIds } },
          depth: 1,
          overrideAccess: true,
          limit: rawIds.length,
        })
      : { docs: [] }

    // Restore the aggregation order (closest listing first).
    const docMap = new Map(unorderedDocs.map((d) => [d.id, d]))
    const docs = rawIds.map((id) => docMap.get(id)).filter(Boolean)

    return Response.json({
      docs,
      distances,
      totalDocs,
      totalPages,
      page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    })
  },
}

// Euclidean half-diagonal of a lat/lon bbox in km.
function bboxHalfDiagonalKm(
  minLat: number,
  maxLat: number,
  minLon: number,
  maxLon: number,
): number {
  const midLat = (minLat + maxLat) / 2
  const latSpanKm = (maxLat - minLat) * 111
  const lonSpanKm = (maxLon - minLon) * 111 * Math.cos((midLat * Math.PI) / 180)
  return Math.sqrt(latSpanKm ** 2 + lonSpanKm ** 2) / 2
}
