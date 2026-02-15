import { PayloadRequest } from 'payload'

export function apiKeyAuth(authHeader: string): boolean {
  const apiKey = authHeader?.split(' ')
  if (!apiKey) return false
  if (apiKey[apiKey.length - 1] !== process.env.CMS_API_KEY) return false
  return true
}

export function adminOrApiKeyAuth(req: PayloadRequest): boolean {
  if (req.user && req.user.collection === 'users' && req.user?.role.includes('admin')) return true
  const apiKey = req.headers.get('authorization')
  if (!apiKey) return false
  return apiKeyAuth(apiKey)
}
