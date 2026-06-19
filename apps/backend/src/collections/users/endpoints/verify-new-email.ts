import { brevoTemplates } from '@/brevo/templates'
import { BrevoClient } from '@getbrevo/brevo'
import { Endpoint, PayloadRequest } from 'payload'

export const verifyNewEmailEndpoint: Endpoint = {
  path: '/verify-new-email',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!req.json) {
      return Response.json({ error: 'Invalid request' }, { status: 400 })
    }

    const data = await req.json()
    const { pendingEmail, redirectTo } = data ?? {}

    if (!pendingEmail || typeof pendingEmail !== 'string') {
      return Response.json({ error: 'Chybí nový email' }, { status: 400 })
    }

    if (pendingEmail === req.user.email) {
      return Response.json({ error: 'Nový email je stejný jako současný' }, { status: 400 })
    }

    const existing = await req.payload.find({
      collection: 'users',
      where: {
        and: [
          { email: { equals: pendingEmail } },
          { _verified: { equals: true } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      // Nevracíme chybu, aby nedošlo k user enumeration
      return Response.json({ success: true }, { status: 200 })
    }

    const token = crypto.randomUUID()
    const expiration = new Date()
    expiration.setHours(expiration.getHours() + 24)

    await req.payload.update({
      collection: 'users',
      id: req.user.id,
      data: {
        pendingEmail,
        emailVerificationToken: token,
        emailVerificationTokenExpiration: expiration.toISOString(),
      },
    })

    const brevoApiKey = process.env.BREVO_API_KEY
    if (!brevoApiKey) {
      return Response.json({ error: 'Chybí konfigurace emailové služby' }, { status: 500 })
    }

    const brevo = new BrevoClient({ apiKey: brevoApiKey })
    const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'http://localhost:3000'
    const confirmUrl = new URL(`${baseUrl}/api/users/confirm-new-email-address`)
    confirmUrl.searchParams.set('token', token)

    if (redirectTo && typeof redirectTo == 'string') {
      confirmUrl.searchParams.set('redirectTo', redirectTo)
    }
    await brevo.transactionalEmails.sendTransacEmail({
      templateId: brevoTemplates.emailChange,
      to: [{ email: pendingEmail }],
      params: {
        emailAddress: pendingEmail,
        buttonUrl: confirmUrl.toString(),
      },
    })

    return Response.json({ success: true }, { status: 200 })
  },
}
