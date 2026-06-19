import { Endpoint, PayloadRequest } from 'payload'
import { User } from '../../../payload-types'

export const confirmNewEmailEndpoint: Endpoint = {
  path: '/confirm-new-email',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    if (!req.json) {
      return Response.json({ error: 'Invalid request' }, { status: 400 })
    }

    const data = await req.json()
    const { token } = data ?? {}

    if (!token || typeof token !== 'string') {
      return Response.json({ error: 'Chybí token' }, { status: 400 })
    }

    const result = await req.payload.find({
      collection: 'users',
      where: { emailVerificationToken: { equals: token } },
      limit: 1,
    })

    const user = result.docs[0] as User | undefined

    if (!user) {
      return Response.json({ error: 'Neplatný token' }, { status: 404 })
    }

    if (!user.pendingEmail) {
      return Response.json({ error: 'Čekající email nenalezen' }, { status: 400 })
    }

    if (
      !user.emailVerificationTokenExpiration ||
      new Date(user.emailVerificationTokenExpiration) < new Date()
    ) {
      return Response.json({ error: 'Token vypršel' }, { status: 410 })
    }

    await req.payload.update({
      collection: 'users',
      id: user.id,
      data: {
        email: user.pendingEmail,
        pendingEmail: null,
        emailVerificationToken: null,
        emailVerificationTokenExpiration: null,
      },
    })

    return Response.json({ success: true }, { status: 200 })
  },
}
