import { Endpoint, PayloadRequest } from 'payload'
import { Company, Invitation, User } from '../../../../payload-types'

export const verifyMemberEndpoint: Endpoint = {
  path: '/members/verify',
  method: 'post',

  handler: async (req: PayloadRequest) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!req.json) {
      return Response.json({ error: 'Invalid request' }, { status: 400 })
    }

    const data = await req.json()
    const { companyMemberInviteToken } = data ?? {}

    if (!companyMemberInviteToken) {
      return Response.json({ error: 'Chybí token' }, { status: 400 })
    }

    const result = await req.payload.find({
      collection: 'invitations',
      where: { token: { equals: companyMemberInviteToken } },
      limit: 1,
    })

    const invitation = result.docs[0] as Invitation | undefined

    if (!invitation) {
      return Response.json({ error: 'Pozvánka nenalezena' }, { status: 404 })
    }

    if (invitation.status !== 'pending') {
      return Response.json(
        { error: 'Pozvánka již byla použita nebo byla zrušena' },
        { status: 409 },
      )
    }

    const user = req.user as User
    if (user.email !== invitation.email) {
      return Response.json({ error: 'Pozvánka je určena pro jiný e-mail' }, { status: 403 })
    }

    const companyId =
      typeof invitation.company === 'string' ? invitation.company : invitation.company.id

    const company = await req.payload.findByID({
      collection: 'companies',
      id: companyId,
    })

    const alreadyMember = (company.members ?? []).some((m) => {
      const memberId = typeof m.user === 'string' ? m.user : m.user.id
      return memberId === user.id
    })

    if (alreadyMember) {
      return Response.json({ error: 'Uživatel je již členem týmu' }, { status: 409 })
    }

    await req.payload.update({
      collection: 'companies',
      id: companyId,
      data: {
        members: [
          ...(company.members ?? []).map((m) => ({
            ...m,
            user: typeof m.user === 'string' ? m.user : m.user.id,
            invitationEmail: m.invitationEmail,
          })),
          {
            user: user.id,
            role: invitation.role,
          },
        ],
      },
    })

    await req.payload.update({
      collection: 'invitations',
      id: invitation.id,
      data: { status: 'accepted' as never },
    })

    return Response.json({ success: true }, { status: 200 })
  },
}
