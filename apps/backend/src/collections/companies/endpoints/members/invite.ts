import { CollectionSlug, Endpoint, PayloadRequest } from 'payload'
import { Company, User } from '../../../../payload-types'
import { getIdFromRelationshipField } from '@roo/common'
import { Brevo, BrevoClient } from '@getbrevo/brevo'
import { brevoTemplates } from '@/brevo/templates'

export const membersInviteEndpoint: Endpoint = {
  path: '/members/invite',
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

    const role = data.role

    if (role !== 'editor' && role !== 'manager') {
      return Response.json({ error: 'Neplatná role' }, { status: 400 })
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
      return (m.user as User).email === email
    })

    if (alreadyMember) {
      return Response.json({ error: 'Uživatel je již členem týmu' }, { status: 409 })
    }

    const existingInvitation = await req.payload.find({
      collection: 'invitations' as CollectionSlug,
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

    await req.payload.create({
      collection: 'invitations' as CollectionSlug,
      data: {
        role,
        token,
        email,
        company: companyId,
        status: 'pending' as never,
        invitedBy: req.user.id,
      },
    })

    const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'http://localhost:3000'
    const inviteUrl = new URL(`${baseUrl}/companies/members/invite`)
    inviteUrl.searchParams.set('companyMemberInviteToken', token)
    inviteUrl.searchParams.set('email', email)

    const brevoApiKey = process.env.BREVO_API_KEY
    if (!brevoApiKey) {
      return Response.json({ error: 'Chybí konfigurace emailové služby' }, { status: 500 })
    }

    const brevo = new BrevoClient({ apiKey: brevoApiKey })

    const res = await brevo.transactionalEmails.sendTransacEmail({
      templateId: brevoTemplates.companyMemberInvite,
      to: [{ email }],
      params: {
        companyName: company.name,
        buttonUrl: inviteUrl.toString(),
      },
    })

    console.log('Brevo response:', res)

    return Response.json({ success: true }, { status: 201 })
  },
}
