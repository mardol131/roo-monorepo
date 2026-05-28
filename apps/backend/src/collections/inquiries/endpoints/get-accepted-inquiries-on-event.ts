import { getIdFromRelationshipField } from '@roo/common'
import type { Endpoint, PayloadRequest } from 'payload'

export const getAcceptedInquiriesOnEventEndpoint: Endpoint = {
  path: '/get-accepted-inquiries-on-event',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json?.()
    const { eventId, inquiryId } = data ?? {}

    if (!eventId || !inquiryId) {
      return Response.json({ error: 'Chybí eventId nebo inquiryId' }, { status: 400 })
    }

    // Ověříme, že event existuje a má zapnuté sdílení potvrzených dodavatelů
    const event = await req.payload.findByID({
      collection: 'events',
      id: eventId,
      depth: 0,
      overrideAccess: true,
      context: { skipFieldRestriction: true },
    })

    if (!event) {
      return Response.json({ error: 'Event nenalezen' }, { status: 404 })
    }

    if (!event.sharing?.confirmedInquiries) {
      return Response.json({ error: 'Sdílení dodavatelů není povoleno' }, { status: 403 })
    }

    // Ověříme, že konkrétní inquiry patří tomuto uživateli / jeho firmě a je na správném eventu
    const myInquiry = await req.payload.find({
      collection: 'inquiries',
      where: {
        and: [
          { id: { equals: inquiryId } },
          { event: { equals: eventId } },
          {
            or: [
              { user: { equals: req.user.id } },
              { 'listing.company.owner': { equals: req.user.id } },
              { 'listing.company.members.user': { equals: req.user.id } },
            ],
          },
        ],
      },
      overrideAccess: true,
      depth: 0,
      limit: 1,
    })

    if (myInquiry.totalDocs === 0) {
      return Response.json({ error: 'Nemáte přístup k této poptávce' }, { status: 403 })
    }

    // Vrátíme jen confirmed poptávky ostatních firem s omezenými daty
    const inquiries = await req.payload.find({
      collection: 'inquiries',
      where: {
        and: [{ event: { equals: eventId } }, { 'status.company': { equals: 'confirmed' } }],
      },
      overrideAccess: true,
      depth: 1,
      limit: 50,
    })
    console.log('inquiries', inquiries)

    const uniqueListingIds = [
      ...new Set(inquiries.docs.map((inq) => getIdFromRelationshipField(inq.listing))),
    ]
    console.log('uniqueListingIds', uniqueListingIds)
    const listings = await Promise.all(
      uniqueListingIds.map((id) =>
        req.payload.findByID({ collection: 'listings', id, depth: 0, overrideAccess: true }),
      ),
    )
    console.log('listings', listings)

    const listingsMap = Object.fromEntries(listings.filter(Boolean).map((l) => [l.id, l]))

    const result = inquiries.docs.map((inq) => {
      const listingId = getIdFromRelationshipField(inq.listing)
      const listing = listingsMap[listingId]
      return {
        listing: { id: listingId, name: listing?.name ?? '', type: listing?.type },
      }
    })

    return Response.json({ docs: result, totalDocs: result.length }, { status: 200 })
  },
}
