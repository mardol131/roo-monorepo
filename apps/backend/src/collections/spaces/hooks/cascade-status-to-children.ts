import type { CollectionAfterChangeHook } from 'payload'

export const cascadeStatusToChildren: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (doc.status === previousDoc?.status) return
  if (doc.status === 'active') return

  await req.payload.update({
    collection: 'spaces',
    where: { parent: { equals: doc.id } },
    data: { status: 'disabled' },
  })
}
