import { createNeonAuth } from '@neondatabase/auth/next/server';

const authUrl = process.env.NEON_AUTH_URL;
const jwksUrl = process.env.NEON_AUTH_JWKS_URL;

if (!authUrl || !jwksUrl) {
  throw new Error('NEON_AUTH_URL e NEON_AUTH_JWKS_URL devem estar definidos no ambiente.');
}

export const auth = createNeonAuth({
  authUrl,
  jwksUrl,
});
