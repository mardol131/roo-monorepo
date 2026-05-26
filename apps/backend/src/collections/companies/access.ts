import type { Access, FieldAccess, Where } from 'payload'
import { CollectionAccess } from '../common/utils'

export const companyAccess: CollectionAccess = {
  create: ({ req }) => !!req.user,
  read: () => true,
  update: ({ req }) => {
    if (!req.user) return false
    if (req.user.collection === 'admins') return true
    // Owner nebo člen s rolí 'admin' může editovat firmu
    const where: Where = {
      and: [
        { status: { equals: 'active' } },
        {
          or: [
            { owner: { equals: req.user.id } },
            {
              and: [
                { 'members.user': { equals: req.user.id } },
                { 'members.role': { equals: 'admin' } },
              ],
            },
          ],
        },
      ],
    }
    return where
  },
  delete: ({ req }) => req.user?.collection === 'admins',
}

/**
 * Vrací true, pokud je přihlášený uživatel vlastníkem firmy (owner)
 * nebo je uveden v poli members (bez ohledu na roli).
 *
 * Použití: read access pro citlivá pole (billingAddress, vatId, members).
 */
export const isCompanyMemberOrOwner: FieldAccess = ({ req, doc }) => {
  if (!req.user) return false
  if (req.user.collection === 'admins') return true
  if (!doc) return false

  // Ověření ownera
  const ownerId = typeof doc.owner === 'object' ? doc.owner?.id : doc.owner
  if (ownerId === req.user.id) return true

  // Ověření členství v members array
  const members = doc.members as { user: string | { id: string } }[] | undefined
  if (!members?.length) return false

  return members.some((member) => {
    const userId = typeof member.user === 'object' ? member.user?.id : member.user
    return userId === req.user?.id
  })
}
