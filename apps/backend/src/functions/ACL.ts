import { PayloadRequest } from 'payload'

export function adminOrApiKeyAuth(req: PayloadRequest): boolean {
  if (req.user && req.user.collection === 'admins' && req.user?.role.includes('admin')) return true
  return false
}
