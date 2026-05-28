import type { CollectionAfterChangeHook } from 'payload'
import type { Listing, Variant } from '@/payload-types'

/**
 * Pokud se změní typ prostorů (spacesType) na detailu listingu,
 * vymaže includedSpaces ze všech variant tohoto listingu.
 */
export const clearVariantSpacesOnSpacesTypeChange: CollectionAfterChangeHook<Listing> = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (!doc.detail?.value || !previousDoc?.detail?.value) return

  let docDetail = doc.detail.value
  let prevDocDetail = previousDoc.detail.value

  if (typeof doc.detail.value === 'string') {
    const detailRes = await req.payload.findByID({
      collection: doc.detail.relationTo,
      id: doc.detail.value,
    })
    if (!detailRes) throw new Error('Failed to fetch listing detail')
    docDetail = detailRes
  }

  if (typeof prevDocDetail === 'string') {
    const detailRes = await req.payload.findByID({
      collection: previousDoc.detail.relationTo,
      id: prevDocDetail,
    })
    if (!detailRes) throw new Error('Failed to fetch listing detail')
    prevDocDetail = detailRes
  }

  if (typeof docDetail !== 'string' && 'spacesType' in docDetail) {
    const newSpacesType = docDetail.spacesType
    const prevSpacesType =
      typeof prevDocDetail !== 'string' && 'spacesType' in prevDocDetail
        ? prevDocDetail.spacesType
        : undefined

    if (!newSpacesType || newSpacesType === prevSpacesType) return

    const variants = await req.payload.find({
      collection: 'variants',
      where: { listing: { equals: doc.id } },
      limit: 1000,
    })

    await Promise.all(
      variants.docs.map((variant) => {
        const updatedDetails: Variant['details'] = variant.details?.map((block) => {
          if (block.blockType === 'venue') {
            return { ...block, includedSpaces: [] }
          }
          return block
        })
        return req.payload.update({
          collection: 'variants',
          id: variant.id,
          data: { details: updatedDetails },
        })
      }),
    )
  }
}
