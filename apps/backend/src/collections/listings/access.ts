import { getIdFromRelationshipField } from '@roo/common'
import type { FieldAccess, PayloadRequest, Where } from 'payload'
import { CollectionAccess } from '../common/utils'
import type { Company, Listing } from '@/payload-types'

async function fetchCompanyViaDetail(
  req: PayloadRequest,
  detailId: string,
): Promise<Company | null> {
  const result = await req.payload.find({
    collection: 'listings',
    where: { 'detail.value': { equals: detailId } },
    limit: 1,
  })

  const listing = result.docs[0]
  if (!listing) return null

  const companyId = getIdFromRelationshipField(listing.company)
  if (!companyId) return null

  return req.payload.findByID({
    collection: 'companies',
    id: companyId,
    overrideAccess: true,
    context: { skipPublicStrip: true },
  })
}

/** Pole může měnit pouze Payload admin (tariff, type, detail, slug, subscriptionActive). */
export const payloadAdminOnly: FieldAccess = ({ req }) => req.user?.collection === 'admins'

/**
 * Pole může měnit owner firmy nebo člen s rolí admin/manager.
 * Použití: field access pro `status`.
 */
export const isCompanyManagerOrAbove: FieldAccess = async ({ req, doc }) => {
  if (!req.user) return false
  if (req.user.collection === 'admins') return true

  if (!doc?.company) return false
  const companyId = getIdFromRelationshipField(doc.company)

  const company = await req.payload.findByID({
    collection: 'companies',
    id: companyId,
    overrideAccess: true,
    context: { skipPublicStrip: true },
  })

  if (!company) return false

  const ownerId = getIdFromRelationshipField(company.owner)
  if (ownerId === req.user.id) return true

  return (
    company.members?.some((member) => {
      const memberId = getIdFromRelationshipField(member.user)
      return memberId === req.user?.id && (member.role === 'admin' || member.role === 'manager')
    }) ?? false
  )
}

export const listingAccessControl: CollectionAccess = {
  create: async ({ req, data }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    if (!data?.company) return false
    const companyId = getIdFromRelationshipField(data.company)

    const company = await req.payload.findByID({
      collection: 'companies',
      id: companyId,
      overrideAccess: true,
      context: { skipPublicStrip: true },
    })

    if (!company) return false

    const ownerId = getIdFromRelationshipField(company.owner)
    if (ownerId === req.user.id) return true

    return (
      company.members?.some((member) => {
        const memberId = getIdFromRelationshipField(member.user)
        return memberId === req.user?.id && (member.role === 'admin' || member.role === 'manager')
      }) ?? false
    )
  },
  read: ({ req }) => {
    if (req.user?.collection === 'admins') return true
    if (!req.user) {
      const query: Where = {
        and: [{ status: { equals: 'active' } }, { subscriptionActive: { equals: true } }],
      }
      return query
    }

    const query: Where = {
      or: [
        {
          and: [
            { 'company.owner': { equals: req.user.id } },
            { status: { in: ['active', 'inactive'] } },
          ],
        },
        {
          and: [
            { 'company.members.user': { equals: req.user.id } },
            { status: { in: ['active', 'inactive'] } },
          ],
        },
        {
          and: [{ status: { equals: 'active' } }, { subscriptionActive: { equals: true } }],
        },
      ],
    }
    return query
  },
  update: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true
    // Owner nebo jakýkoli člen firmy může listing upravovat
    const where: Where = {
      or: [
        { 'company.owner': { equals: req.user.id } },
        { 'company.members.user': { equals: req.user.id } },
      ],
    }
    return where
  },
  delete: ({ req }) => req.user?.collection === 'admins',
}

export const listingDetailAccessControl: CollectionAccess = {
  read: () => true,
  create: ({ req }) => !!req.user,
  update: async ({ req, id }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    if (!id) return false

    const company = await fetchCompanyViaDetail(req, String(id))
    if (!company) return false

    const ownerId = getIdFromRelationshipField(company.owner)
    if (ownerId === req.user.id) return true

    return (
      company.members?.some((member) => {
        const memberId = getIdFromRelationshipField(member.user)
        return memberId === req.user?.id
      }) ?? false
    )
  },
  delete: ({ req }) => req.user?.collection === 'admins',
}
