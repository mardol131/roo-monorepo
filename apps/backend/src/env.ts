import { createEnv } from '@t3-oss/env-nextjs'
import zod from 'zod'

export const envConfig = createEnv({
  server: {
    PAYLOAD_SECRET: zod.string().min(1),
    DATABASE_URL: zod.string().min(1),
    SUPABASE_SERVICE_KEY: zod.string().min(1),
    STRIPE_SECRET_KEY: zod.string().min(1),
    STRIPE_PRICE_BASIC: zod.string().min(1),
    STRIPE_WEBHOOK_SECRET: zod.string().min(1),
    BREVO_API_KEY: zod.string().min(1),
  },
  client: {
    NEXT_PUBLIC_WEBSITE_URL: zod.string().min(1),
    NEXT_PUBLIC_BACKEND_URL: zod.string().min(1),
    NEXT_PUBLIC_SUPABASE_URL: zod.string().min(1),
  },
  runtimeEnv: {
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PRICE_BASIC: process.env.STRIPE_PRICE_BASIC,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    BREVO_API_KEY: process.env.BREVO_API_KEY,
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  },
})
