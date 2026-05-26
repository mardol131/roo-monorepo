import type { CollectionAfterChangeHook } from 'payload'
import type { Listing } from '@/payload-types'

/**
 * Při změně statusu listingu kaskáduje změny na navázané záznamy:
 *
 * inactive / archived / disabled
 *   → otevřené poptávky se označí jako nedostupné (listing unavailable)
 *
 * archived / disabled
 *   → varianty, spaces a kalendářní události se deaktivují
 */
export const cascadeStatusChange: CollectionAfterChangeHook<Listing> = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (doc.status === previousDoc?.status) return
  if (doc.status === 'active') return

  const listingFilter = { listing: { equals: doc.id } }

  if (doc.status === 'inactive' || doc.status === 'archived' || doc.status === 'disabled') {
    await req.payload.update({
      collection: 'inquiries',
      where: {
        and: [
          listingFilter,
          {
            or: [
              { 'status.company': { not_equals: 'confirmed' } },
              { 'status.user': { not_equals: 'confirmed' } },
            ],
          },
        ],
      },
      data: { status: { listing: 'unavailable' } },
    })
  }

  if (doc.status === 'archived' || doc.status === 'disabled') {
    await Promise.all([
      req.payload.update({
        collection: 'variants',
        where: listingFilter,
        data: { status: 'disabled' },
      }),
      req.payload.update({
        collection: 'spaces',
        where: listingFilter,
        data: { status: 'disabled' },
      }),
      req.payload.update({
        collection: 'calendar-events',
        where: listingFilter,
        data: { status: 'cancelled' },
      }),
    ])
  }
}
