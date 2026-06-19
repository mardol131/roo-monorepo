import { Endpoint, generatePayloadCookie, PayloadRequest } from 'payload'
import { generatePayloadTokenFromUser } from './generate-payload-token-from-user'

export const verifyLoginTokenEndpoint: Endpoint = {
  path: '/magic-link-login/verify-login-token',
  method: 'get',
  handler: async (req: PayloadRequest) => {
    const token = req.query?.token
    const rawRedirectTo = (req.query?.redirectTo as string) || '/'
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    const redirectBase = rawRedirectTo.startsWith('http') ? rawRedirectTo : `${frontendUrl}${rawRedirectTo}`

    if (!token || typeof token !== 'string') {
      return Response.redirect(`${redirectBase}?error=missing-token`)
    }

    const users = await req.payload.find({
      collection: 'users',
      where: {
        loginToken: { equals: token },
        loginTokenExpiration: { greater_than: new Date().toISOString() },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (users.docs.length === 0) {
      return Response.redirect(`${redirectBase}?error=invalid-token`)
    }

    await req.payload.update({
      collection: 'users',
      id: users.docs[0].id,
      overrideAccess: true,
      data: {
        loginToken: null,
        loginTokenExpiration: null,
      },
    })

    const { token: payloadToken } = await generatePayloadTokenFromUser(users.docs[0], req.payload)

    const collectionAuthConfig = req.payload.collections.users.config.auth
    const cookie = generatePayloadCookie({
      collectionAuthConfig,
      cookiePrefix: req.payload.config.cookiePrefix,
      token: payloadToken,
    })

    return new Response(null, {
      status: 302,
      headers: {
        Location: `${redirectBase}`,
        'Set-Cookie': cookie,
      },
    })
  },
}
