import { Endpoint } from 'payload'
import { sendEmailEndpoint } from './send-email/send-email'
import { verifyLoginTokenEndpoint } from './verify-login-token/verify-login-token'

export const magicLinkLoginEndpoint: Endpoint[] = [sendEmailEndpoint, verifyLoginTokenEndpoint]
