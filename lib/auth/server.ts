import { createNeonAuth } from '@neondatabase/auth/next/server';

import { env } from '@/lib/env';

export const auth = createNeonAuth({
  authUrl: env.NEON_AUTH_URL,
  jwksUrl: env.NEON_AUTH_JWKS_URL,
});
