export function generateVerificationEmail({
  req,
  token,
}: {
  req: { data?: Record<string, unknown> }
  token: string
}): string {
  const redirectTo = req.data?.redirectTo as string | undefined
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL ?? 'http://localhost:3000'
  const url = new URL(`${baseUrl}/user-verification`)
  url.searchParams.set('emailVerificationToken', token)
  if (redirectTo) url.searchParams.set('redirectTo', redirectTo)

  return `
    <p>Potvrďte svůj účet kliknutím na odkaz níže:</p>
    <a href="${url.toString()}">Ověřit účet</a>
    <p>Odkaz je platný 24 hodin.</p>
  `
}
