import type { CollectionAfterChangeHook } from 'payload'

export const cancelPendingInquiriesOnDeactivation: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (doc.status === previousDoc?.status) return
  if (doc.status === 'active') return

  await req.payload.update({
    collection: 'inquiries',
    where: {
      and: [
        { variant: { equals: doc.id } },
        {
          or: [
            { 'status.company': { not_equals: 'confirmed' } },
            { 'status.user': { not_equals: 'confirmed' } },
          ],
        },
      ],
    },
    data: { status: { variant: 'unavailable' } },
  })
}
