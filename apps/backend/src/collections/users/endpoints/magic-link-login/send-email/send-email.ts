import { Endpoint, PayloadRequest } from 'payload'
import { randomBytes } from 'crypto'
import { BrevoClient } from '@getbrevo/brevo'
import { envConfig } from '@/env'
import { brevoTemplates } from '@/brevo/templates'

export const sendEmailEndpoint: Endpoint = {
  path: '/magic-link-login/send-email',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    if (!req.json) {
      return Response.json({ error: 'Invalid request' }, { status: 400 })
    }

    const data = await req.json()
    const { email, redirectTo } = data ?? {}

    if (!email || typeof email !== 'string') {
      return Response.json({ error: 'Chybí email' }, { status: 400 })
    }

    const result = await req.payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    })

    const user = result.docs[0]

    // Vracíme 200 i když uživatel neexistuje — zabraňuje email enumeration
    if (!user) {
      return Response.json({ success: true }, { status: 200 })
    }

    const token = randomBytes(32).toString('hex')

    await req.payload.update({
      collection: 'users',
      id: user.id,
      overrideAccess: true,
      data: {
        loginToken: token,
        loginTokenExpiration: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minut
      },
    })

    const url = new URL(`${envConfig.NEXT_PUBLIC_WEBSITE_URL}/api/users/magic-link-login/verify`)
    url.searchParams.set('token', token)
    if (redirectTo) {
      url.searchParams.set('redirectTo', redirectTo)
    }

    console.log(`Magic link login URL for ${email}: ${url.toString()}`)

    const brevo = new BrevoClient({ apiKey: envConfig.BREVO_API_KEY })

    await brevo.transactionalEmails.sendTransacEmail({
      templateId: brevoTemplates.loginWithMagicLink,
      to: [{ email }],
      params: {
        buttonUrl: url.toString(),
      },
    })

    return Response.json({ success: true }, { status: 200 })
  },
}
