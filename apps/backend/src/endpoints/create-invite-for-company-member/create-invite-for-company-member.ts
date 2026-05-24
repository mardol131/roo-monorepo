import { CollectionSlug, Endpoint, PayloadRequest } from 'payload'
import { Company, User } from '../../payload-types'
import { getIdFromRelationshipField } from '@roo/common'

export const createInviteForCompanyMember: Endpoint = {
  path: '/create-invite-for-company-member',
  method: 'post',

  handler: async (req: PayloadRequest) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!req.json) {
      return Response.json({ error: 'Invalid request' }, { status: 400 })
    }
    const data = await req.json()
    const { email, companyId } = data ?? {}

    if (!email || !companyId) {
      return Response.json({ error: 'Chybí email nebo companyId' }, { status: 400 })
    }

    const company = (await req.payload.findByID({
      collection: 'companies',
      id: companyId,
    })) as Company | null

    if (!company) {
      return Response.json({ error: 'Firma nenalezena' }, { status: 404 })
    }

    const ownerId = getIdFromRelationshipField(company.owner)
    if (ownerId !== req.user.id) {
      return Response.json(
        { error: 'Nemáte oprávnění pozvat člena do této firmy' },
        { status: 403 },
      )
    }

    const alreadyMember = (company.members ?? []).some((m) => {
      if (typeof m.user === 'string') return false
      return m.user.email === email
    })

    if (alreadyMember) {
      return Response.json({ error: 'Uživatel je již členem týmu' }, { status: 409 })
    }

    const existingInvitation = await req.payload.find({
      collection: 'invitations',
      where: {
        and: [
          { email: { equals: email } },
          { company: { equals: companyId } },
          { status: { equals: 'pending' } },
        ],
      },
      limit: 1,
    })

    if (existingInvitation.docs.length > 0) {
      return Response.json({ error: 'Pozvánka pro tento email již existuje' }, { status: 409 })
    }

    const token = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    await req.payload.create({
      collection: 'invitations',
      data: {
        token,
        email,
        company: companyId,
        status: 'pending' as never,
        expiresAt: expiresAt.toISOString(),
        invitedBy: req.user.id,
      },
    })

    // TODO: odeslat email s odkazem /invite/accept?token=<token>

    return Response.json({ success: true }, { status: 201 })
  },
}
