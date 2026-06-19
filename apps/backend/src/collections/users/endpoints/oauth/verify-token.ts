import type { OAuthProfile, OAuthProvider } from './types'
import { verifyGoogleToken } from './providers/google'

export async function verifyOAuthToken(
  provider: OAuthProvider,
  idToken: string,
): Promise<OAuthProfile | null> {
  switch (provider) {
    case 'google':
      return verifyGoogleToken(idToken)
  }
}
