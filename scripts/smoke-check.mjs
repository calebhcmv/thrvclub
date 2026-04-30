/* eslint-disable no-console */

const baseUrl = process.env.SMOKE_BASE_URL;

if (!baseUrl) {
  console.error('SMOKE_BASE_URL não definido.');
  process.exit(1);
}

async function check(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Falha no smoke check: ${url} (${response.status})`);
  }
  console.log(`OK ${url}`);
}

await check(`${baseUrl}/api/health`);
await check(`${baseUrl}/login`);
await check(`${baseUrl}/`);

console.log('Smoke check concluído.');
