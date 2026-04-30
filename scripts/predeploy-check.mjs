/* eslint-disable no-console */

const required = [
  'DATABASE_URL',
  'NEON_AUTH_URL',
  'NEON_AUTH_JWKS_URL',
  'NEON_AUTH_COOKIE_SECRET',
  'NEXT_PUBLIC_NEON_AUTH_URL',
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error('Variáveis ausentes para deploy:', missing.join(', '));
  process.exit(1);
}

if ((process.env.NEON_AUTH_COOKIE_SECRET ?? '').length < 32) {
  console.error('NEON_AUTH_COOKIE_SECRET deve ter no mínimo 32 caracteres.');
  process.exit(1);
}

console.log('Predeploy check OK: variáveis essenciais configuradas.');
