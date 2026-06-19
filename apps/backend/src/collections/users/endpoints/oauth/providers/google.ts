import type { OAuthProfile } from '../types'

export async function verifyGoogleToken(idToken: string): Promise<OAuthProfile | null> {
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`)
  if (!res.ok) return null

  const data = await res.json()
  if (!data.sub || !data.email) return null

  const nameParts = (data.name as string | undefined)?.split(' ') ?? []

  return {
    sub: data.sub,
    email: data.email,
    firstName: nameParts[0] ?? data.given_name ?? '',
    lastName: nameParts.slice(1).join(' ') || data.family_name || '',
  }
}
