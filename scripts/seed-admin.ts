import { db } from '@/lib/db';
import { userProfiles } from '@/lib/db/schema';

async function main() {
  const userId = process.env.SEED_ADMIN_USER_ID;

  if (!userId) {
    throw new Error('SEED_ADMIN_USER_ID é obrigatório.');
  }

  await db
    .insert(userProfiles)
    .values({ id: userId, role: 'admin' })
    .onConflictDoUpdate({
      target: userProfiles.id,
      set: { role: 'admin', updatedAt: new Date() },
    });

  console.log('Admin seed aplicado com sucesso.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
