import { createHash } from 'crypto'
import type { Endpoint, PayloadRequest } from 'payload'
import { generatePayloadCookie, headersWithCors } from 'payload'
import type { OAuthProfile, OAuthProvider } from './types'
import { verifyOAuthToken } from './verify-token'
import { generatePayloadTokenFromUser } from '../magic-link-login/verify-login-token/generate-payload-token-from-user'
import { User } from '@/payload-types'

const SUPPORTED_PROVIDERS: OAuthProvider[] = ['google']

function deriveMockPassword(provider: OAuthProvider, sub: string): string {
  return createHash('sha256')
    .update(`oauth:${provider}:${sub}:${process.env.PAYLOAD_SECRET}`)
    .digest('hex')
}

async function findOrCreateUser(
  req: PayloadRequest,
  provider: OAuthProvider,
  profile: OAuthProfile,
): Promise<User> {
  const { sub, email, firstName, lastName } = profile

  // 1. Hledej existující oauth-account → vrať přidruženého uživatele
  const existingAccounts = await req.payload.find({
    collection: 'oauth-accounts',
    where: { and: [{ provider: { equals: provider } }, { providerAccountId: { equals: sub } }] },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })

  if (existingAccounts.docs.length > 0) {
    const linkedUser = existingAccounts.docs[0].user
    const userId = typeof linkedUser === 'string' ? linkedUser : linkedUser.id
    return req.payload.findByID({ collection: 'users', id: userId, overrideAccess: true })
  }

  // 2. Hledej uživatele podle emailu
  const existingUsers = await req.payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  let user: User
  if (existingUsers.docs.length > 0) {
    user = existingUsers.docs[0]
  } else {
    // 3. Vytvoř nového uživatele
    user = await req.payload.create({
      collection: 'users',
      data: {
        email,
        password: deriveMockPassword(provider, sub),
        firstName,
        lastName,
        roles: ['user'],
        gdprConsent: true,
        termsOfUseConsent: true,
        _verified: true,
      },
      overrideAccess: true,
    })
  }

  // 4. Vytvoř oauth-account záznam
  await req.payload.create({
    collection: 'oauth-accounts',
    data: { user: user.id, provider, providerAccountId: sub, email },
    overrideAccess: true,
  })

  return user
}

export const oauthEndpoint: Endpoint = {
  path: '/oauth/:provider',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    const provider = req.routeParams?.provider as OAuthProvider | undefined

    if (!provider || !SUPPORTED_PROVIDERS.includes(provider)) {
      return Response.json({ error: 'Nepodporovaný provider' }, { status: 400 })
    }

    if (!req.json) {
      return Response.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { idToken } = (await req.json()) ?? {}
    if (!idToken || typeof idToken !== 'string') {
      return Response.json({ error: 'Chybí idToken' }, { status: 400 })
    }

    const profile = await verifyOAuthToken(provider, idToken)
    if (!profile) {
      return Response.json({ error: 'Neplatný token' }, { status: 401 })
    }

    const user = await findOrCreateUser(req, provider, profile)
    const { token } = await generatePayloadTokenFromUser(user, req.payload)

    const collectionAuthConfig = req.payload.collections.users.config.auth
    const cookie = generatePayloadCookie({
      collectionAuthConfig,
      cookiePrefix: req.payload.config.cookiePrefix,
      token,
    })

    const headers = headersWithCors({ headers: new Headers({ 'Set-Cookie': cookie }), req })

    return Response.json({ user }, { status: 200, headers })
  },
}
