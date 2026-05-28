import type { CollectionAfterReadHook } from 'payload'
import type { Company } from '@/payload-types'
import { getIdFromRelationshipField } from '@roo/common'

export const stripForPublic: CollectionAfterReadHook = ({ doc, req, context }) => {
  const company = doc

  if (req.user?.collection === 'admins') return company
  if (context.skipPublicStrip) return company

  const ownerId = getIdFromRelationshipField(company.owner)
  const isOwner = ownerId === req.user?.id

  const isMember = company.members?.some((m: NonNullable<Company['members']>[number]) => {
    const userId = getIdFromRelationshipField(m.user)
    return userId === req.user?.id
  })
  const stripped = company

  if (!isOwner && !isMember) {
    delete stripped.members
    delete stripped.billingAddress
    delete stripped.vatId
    delete stripped.owner
  }

  return stripped
}
