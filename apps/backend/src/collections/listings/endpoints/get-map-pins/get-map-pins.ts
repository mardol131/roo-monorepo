import { LocalityType } from '@roo/common'
import type { Endpoint, PayloadRequest } from 'payload'

const COLLECTION_MAP: Record<LocalityType, 'cities' | 'districts' | 'regions' | 'countries'> = {
  city: 'cities',
  district: 'districts',
  region: 'regions',
  country: 'countries',
}

export const getMapPins: Endpoint = {
  path: '/map-pins',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const { searchParams } = new URL(req.url ?? '', 'http://localhost')
    const id = searchParams.get('id')
    const type = searchParams.get('type') as LocalityType | null

    const listingsDocs: {
      id: string
      name: string
      location: {
        latitude: number
        longitude: number
      }
      images: {
        coverImage: {
          filename: string
        }
      }
    }[] = []

    if (type == 'country') {
      const listings = await req.payload.find({
        collection: 'listings',
        where: {
          and: [
            { 'location.latitude': { exists: true } },
            { 'location.longitude': { exists: true } },
            { status: { equals: 'active' } },
            { subscriptionActive: { equals: true } },
          ],
        },
        depth: 0,
        overrideAccess: true,
        limit: 500,
        select: {
          id: true,
          name: true,
          location: true,
          images: true,
        },
      })
      listingsDocs.push(...listings.docs)
    } else if (id && type) {
      const locality = await req.payload.findByID({
        collection: COLLECTION_MAP[type],
        id,
        depth: 0,
        overrideAccess: true,
      })

      if (!locality) {
        return Response.json({ error: 'Lokalita nenalezena' }, { status: 404 })
      }

      const { bboxMinLon, bboxMinLat, bboxMaxLon, bboxMaxLat } = locality as {
        bboxMinLon: number
        bboxMinLat: number
        bboxMaxLon: number
        bboxMaxLat: number
      }

      const listings = await req.payload.find({
        collection: 'listings',
        where: {
          and: [
            { 'location.longitude': { greater_than_equal: bboxMinLon } },
            { 'location.longitude': { less_than_equal: bboxMaxLon } },
            { 'location.latitude': { greater_than_equal: bboxMinLat } },
            { 'location.latitude': { less_than_equal: bboxMaxLat } },
            { 'location.latitude': { exists: true } },
            { 'location.longitude': { exists: true } },
            { status: { equals: 'active' } },
            { subscriptionActive: { equals: true } },
          ],
        },
        depth: 0,
        overrideAccess: true,
        limit: 500,
        select: {
          id: true,
          name: true,
          location: true,
          images: true,
        },
      })
      listingsDocs.push(...listings.docs)
    } else if (!id || !type || !COLLECTION_MAP[type]) {
      return Response.json({ error: 'Chybí nebo neplatný parametr id nebo type' }, { status: 400 })
    }

    return Response.json({
      data: listingsDocs.map((l) => ({
        id: l.id,
        name: l.name,
        latitude: l.location.latitude,
        longitude: l.location.longitude,
        coverImage: l.images.coverImage.filename,
      })),
    })
  },
}
