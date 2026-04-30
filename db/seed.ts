import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;

  if (!email) {
    throw new Error('SEED_ADMIN_EMAIL é obrigatório para seed inicial.');
  }

  await db
    .insert(users)
    .values({
      authUserId: `seed:${email}`,
      email,
      name: 'Admin Seed',
      role: 'admin',
    })
    .onConflictDoNothing();

  console.log('Seed finalizada com sucesso.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
