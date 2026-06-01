import type { CollectionAfterChangeHook } from 'payload'

const OPTION_KEYS = [
  'cuisines',
  'dishTypes',
  'services',
  'technologies',
  'personnel',
  'amenities',
  'activities',
] as const

const resolveRelationshipId = (value: unknown): string | null => {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value && typeof (value as { id: unknown }).id === 'string') {
    return (value as { id: string }).id
  }
  return null
}

export const syncOptionsToListing: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation === 'create') return doc

  const result = await req.payload.find({
    collection: 'listings',
    where: { 'detail.value': { equals: doc.id } },
    limit: 1,
    depth: 0,
  })

  if (!result.docs.length) return doc

  const optionsUpdate: Partial<Record<(typeof OPTION_KEYS)[number], string[]>> = {}

  for (const key of OPTION_KEYS) {
    const items = doc[key]
    if (!Array.isArray(items)) continue
    const ids: string[] = []
    for (const item of items) {
      if (item && typeof item === 'object' && 'option' in item) {
        const id = resolveRelationshipId(item.option)
        if (id) ids.push(id)
      }
    }
    optionsUpdate[key] = ids
  }

  await req.payload.update({
    collection: 'listings',
    id: result.docs[0].id,
    data: { options: optionsUpdate },
  })

  return doc
}
