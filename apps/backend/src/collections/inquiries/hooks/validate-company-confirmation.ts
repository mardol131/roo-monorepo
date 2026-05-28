import type { CollectionBeforeChangeHook } from 'payload'

export const validateCompanyConfirmation: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (operation !== 'update') return data

  const prevCompanyStatus = originalDoc.status?.company
  const nextCompanyStatus = data.status?.company
  const prevUserStatus = originalDoc.status?.user
  const nextUserStatus = data.status?.user

  // Firma potvrzuje — validace podmínek
  if (nextCompanyStatus === 'confirmed' && prevCompanyStatus !== 'confirmed') {
    if (!data.pricing?.quotedPrice && !originalDoc.pricing?.quotedPrice) {
      throw new Error('Nelze potvrdit poptávku bez stanovené ceny.')
    }

    const eventId =
      typeof originalDoc.event === 'object' ? originalDoc.event?.id : originalDoc.event

    const event = await req.payload.findByID({
      collection: 'events',
      id: eventId,
      depth: 0,
      overrideAccess: true,
    })

    if (!event.date?.start || !event.date?.end) {
      throw new Error('Nelze potvrdit poptávku — event nemá nastavené datum.')
    }
  }

  // Zákazník potvrzuje — vyžaduje předchozí potvrzení firmou + nastaví agreedPrice
  if (nextUserStatus === 'confirmed' && prevUserStatus !== 'confirmed') {
    if (prevCompanyStatus !== 'confirmed' && nextCompanyStatus !== 'confirmed') {
      throw new Error('Nelze potvrdit poptávku — firma ji ještě nepotvrdila.')
    }

    const quotedPrice = data.pricing?.quotedPrice ?? originalDoc.pricing?.quotedPrice
    data.pricing = { ...originalDoc.pricing, ...data.pricing, agreedPrice: quotedPrice }
  }

  return data
}
