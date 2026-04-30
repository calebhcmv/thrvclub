import { z } from 'zod';

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEON_AUTH_URL: z.string().url(),
  NEON_AUTH_JWKS_URL: z.string().url(),
  NEON_AUTH_COOKIE_SECRET: z.string().min(32),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_NEON_AUTH_URL: z.string().url(),
});

export const env = serverEnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  NEON_AUTH_URL: process.env.NEON_AUTH_URL,
  NEON_AUTH_JWKS_URL: process.env.NEON_AUTH_JWKS_URL,
  NEON_AUTH_COOKIE_SECRET: process.env.NEON_AUTH_COOKIE_SECRET,
});

export const publicEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_NEON_AUTH_URL: process.env.NEXT_PUBLIC_NEON_AUTH_URL,
});
