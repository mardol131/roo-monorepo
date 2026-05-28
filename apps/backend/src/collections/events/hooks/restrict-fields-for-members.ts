import { Event } from '@/payload-types'
import type { CollectionAfterReadHook, PayloadRequest } from 'payload'

type MemberVisibleEvent = Partial<Event> & Pick<Event, 'id'>

export const restrictEventFieldsForMembers: CollectionAfterReadHook = async ({
  doc,
  req,
  context,
}: {
  doc: Event
  req: PayloadRequest
  context: Record<string, any>
}) => {
  if (context?.skipFieldRestriction) return doc
  if (!req.user) return doc
  if (req.user.collection === 'admins') return doc

  const ownerId = typeof doc.owner === 'string' ? doc.owner : doc.owner?.id
  if (req.user.id === ownerId) return doc

  // Member — omezit podle sharing nastavení
  const sharing = doc.sharing ?? {}
  const result: MemberVisibleEvent = { ...doc }
  delete result.owner

  if (!sharing.place) {
    delete result.location
  }

  // confirmedInquiries — není pole na event dokumentu, ale skryjeme příznak
  // aby frontend věděl, že nesmí dotazovat ostatní potvrzené poptávky
  if (!sharing.confirmedInquiries) {
    result.sharing = {
      ...result.sharing,
      confirmedInquiries: false,
    }
  }

  // budget, notes, checklist jsou vždy soukromé pro vlastníka
  delete result.budget
  delete result.notes
  delete result.checklist

  return result as Event
}
