import type { CollectionAfterChangeHook } from 'payload'
import type { Listing } from '@/payload-types'

/**
 * Pokud se změní typ prostorů (spacesType) na detailu listingu,
 * deaktivuje všechny existující spaces tohoto listingu.
 * Nový spacesType vyžaduje čistý stav — staré spaces jsou nekompatibilní.
 */
export const syncSpacesOnDetailTypeChange: CollectionAfterChangeHook<Listing> = async ({
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

    await req.payload.update({
      collection: 'spaces',
      where: { listing: { equals: doc.id } },
      data: { status: 'disabled' },
    })
  }
}
