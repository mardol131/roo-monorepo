import { getIdFromRelationshipField } from '@roo/common'
import type { FieldAccess, PayloadRequest, Where } from 'payload'
import { CollectionAccess } from '../common/utils'
import type { Company, Listing } from '@/payload-types'

/**
 * Pomocná funkce — načte company přes listing.
 * Použití v detail kolekcích (venue, gastro, entertainment), kde je vazba detail → listing → company.
 */
async function fetchCompanyViaListing(
  req: PayloadRequest,
  listingId: string,
): Promise<Company | null> {
  const listing = (await req.payload.findByID({
    collection: 'listings',
    id: listingId,
  })) as Listing | null

  if (!listing) return null

  const companyId = getIdFromRelationshipField(listing.company)
  if (!companyId) return null

  return (await req.payload.findByID({
    collection: 'companies',
    id: companyId,
  })) as Company | null
}

/** Pole může měnit pouze Payload admin (tariff, type, detail, slug, subscriptionActive). */
export const payloadAdminOnly: FieldAccess = ({ req }) =>
  req.user?.collection === 'admins'

/**
 * Pole může měnit owner firmy nebo člen s rolí admin/manager.
 * Použití: field access pro `status`.
 */
export const isCompanyManagerOrAbove: FieldAccess = async ({ req, doc }) => {
  if (!req.user) return false
  if (req.user.collection === 'admins') return true

  const companyId = getIdFromRelationshipField(doc?.company)
  if (!companyId) return false

  const company = (await req.payload.findByID({
    collection: 'companies',
    id: companyId,
  })) as Company | null

  if (!company) return false

  const ownerId = getIdFromRelationshipField(company.owner)
  if (ownerId === req.user.id) return true

  return (
    company.members?.some((member) => {
      const memberId = getIdFromRelationshipField(member.user)
      return (
        memberId === req.user?.id &&
        (member.role === 'admin' || member.role === 'manager')
      )
    }) ?? false
  )
}

export const listingAccessControl: CollectionAccess = {
  create: async ({ req, data }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const companyId = getIdFromRelationshipField(data?.company)
    if (!companyId) return false

    const company = await req.payload.findByID({
      collection: 'companies',
      id: companyId,
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
      const query: Where = { status: { equals: 'active' } }
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
        { status: { equals: 'active' } },
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
  create: async ({ req, data }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const listingId = getIdFromRelationshipField(data?.listing)
    if (!listingId) return false

    const company = await fetchCompanyViaListing(req, listingId)
    if (!company) return false

    const ownerId = getIdFromRelationshipField(company.owner)
    if (ownerId === req.user.id) return true

    return (
      company.members?.some((member) => {
        const memberId = getIdFromRelationshipField(member.user)
        return (
          memberId === req.user?.id &&
          (member.role === 'admin' || member.role === 'manager')
        )
      }) ?? false
    )
  },
  update: async ({ req, data }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true

    const listingId = getIdFromRelationshipField(data?.listing)
    if (!listingId) return false

    const company = await fetchCompanyViaListing(req, listingId)
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
