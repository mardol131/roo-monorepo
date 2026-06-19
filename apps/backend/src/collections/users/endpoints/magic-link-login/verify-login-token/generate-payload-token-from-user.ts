import { User } from '@/payload-types'
import { SignJWT } from 'jose'
import { getFieldsToSign, Payload, SanitizedCollectionConfig } from 'payload'
import { randomUUID } from 'crypto'

async function customJwtSign({
  fieldsToSign,
  secret,
  tokenExpiration,
}: {
  fieldsToSign: Record<string, any>
  secret: string
  tokenExpiration: number
}) {
  const secretKey = new TextEncoder().encode(secret)
  const issuedAt = Math.floor(Date.now() / 1000)
  const expiration = issuedAt + tokenExpiration
  const token = await new SignJWT(fieldsToSign)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiration)
    .sign(secretKey)

  return { token, issuedAt, expiration }
}

export async function generatePayloadTokenFromUser(
  user: User,
  payload: Payload,
): Promise<{
  token: string
  issuedAt: number
  expiration: number
  collectionConfig: SanitizedCollectionConfig
}> {
  const collectionConfig = payload.collections['users'].config

  if (!collectionConfig.auth) {
    throw new Error('Collection users is not configured for authentication.')
  }

  const tokenExpiration = collectionConfig.auth.tokenExpiration
  let sid: string | undefined

  if (collectionConfig.auth.useSessions) {
    sid = randomUUID()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + tokenExpiration * 1000)
    const session = { id: sid, createdAt: now.toISOString(), expiresAt: expiresAt.toISOString() }

    const existingSessions = Array.isArray(user.sessions) ? user.sessions : []
    const activeSessions = existingSessions.filter(({ expiresAt: exp }: any) => {
      const expiry = exp instanceof Date ? exp : new Date(exp)
      return expiry > now
    })
    activeSessions.push(session as any)

    await payload.update({
      collection: 'users',
      id: user.id,
      data: { sessions: activeSessions },
      overrideAccess: true,
    })
  }

  const fieldsToSign = getFieldsToSign({
    collectionConfig,
    email: user.email,
    sid,
    user: { ...user, collection: 'users' },
  })

  const tokenData = await customJwtSign({
    fieldsToSign,
    secret: payload.secret,
    tokenExpiration,
  })

  return { ...tokenData, collectionConfig }
}
