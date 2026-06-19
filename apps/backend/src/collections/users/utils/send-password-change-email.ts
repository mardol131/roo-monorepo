import { PayloadRequest } from 'payload'
import { BrevoClient } from '@getbrevo/brevo'
import { brevoTemplates } from '@/brevo/templates'

export async function sendPasswordChangeEmail(
  arg:
    | {
        req?: PayloadRequest | undefined
        token?: string
        user?: any
      }
    | undefined,
): Promise<string> {
  const { req, token } = arg || {}
  const brevoApiKey = process.env.BREVO_API_KEY
  if (!brevoApiKey) {
    throw new Error('Missing Brevo API key. Please set the BREVO_API_KEY environment variable.')
  }
  if (!req || !token) {
    throw new Error('Missing required parameters: req and token are required.')
  }

  const email = req.data?.email
  const redirectTo = req.data?.redirectTo

  if (typeof email !== 'string' || !email) {
    throw new Error('Missing email in request data.')
  }

  let brevo = new BrevoClient({
    apiKey: brevoApiKey,
  })
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'http://localhost:3000'
  const url = new URL(`${baseUrl}/password-reset`)
  url.searchParams.set('token', token)
  if (redirectTo && typeof redirectTo == 'string') {
    url.searchParams.set('redirectAfterLogin', redirectTo)
  }
  const result = await brevo.transactionalEmails.sendTransacEmail({
    templateId: brevoTemplates.passwordReset,
    to: [{ email }],
    params: {
      resetUrl: url.toString(),
    },
  })

  return `
    <p>Kliknutím na tlačítko níže si nastavte nové heslo:</p>
    <a href="${url.toString()}" style="display:inline-flex;align-items:center;justify-content:center;padding:8px 16px;background-color:#f43f5e;color:#ffffff;font-weight:600;font-size:16px;text-decoration:none;border-radius:9999px;box-shadow:0 1px 3px rgba(0,0,0,0.1);transition:box-shadow 0.2s;">Nastavit nové heslo</a>
    <p>Odkaz je platný 24 hodin.</p>
  `
}
