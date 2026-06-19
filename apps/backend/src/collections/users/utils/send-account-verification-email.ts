import { brevoTemplates } from '@/brevo/templates'
import { BrevoClient } from '@getbrevo/brevo'

export async function sendAccountVerificationEmail({
  req,
  token,
  user,
}: {
  req: { data?: Record<string, unknown> }
  token: string
  user?: { email?: string }
}): Promise<string> {
  const brevoApiKey = process.env.BREVO_API_KEY
  if (!brevoApiKey) {
    throw new Error('Missing Brevo API key. Please set the BREVO_API_KEY environment variable.')
  }
  if (!req || !token) {
    throw new Error('Missing required parameters: req and token are required.')
  }

  const email = (req.data?.email ?? user?.email) as string | undefined
  const redirectTo = req.data?.redirectTo

  if (!email || typeof email !== 'string') {
    return 'skipped'
  }

  let brevo = new BrevoClient({
    apiKey: brevoApiKey,
  })

  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'http://localhost:3000'
  const url = new URL(`${baseUrl}/user-verification`)
  url.searchParams.set('emailVerificationToken', token)
  if (redirectTo && typeof redirectTo == 'string') {
    url.searchParams.set('redirectTo', redirectTo)
  }
  const result = await brevo.transactionalEmails.sendTransacEmail({
    templateId: brevoTemplates.userVerification,
    to: [{ email: email }],
    params: {
      verificationUrl: url.toString(),
    },
  })

  return 'success'
}
