import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

async function main() {
  const userId = process.env.SEED_ADMIN_USER_ID;

  if (!userId) {
    throw new Error('SEED_ADMIN_USER_ID é obrigatório.');
  }

  await db
    .insert(users)
    .values({ authUserId: userId, email: `${userId}@placeholder.local`, role: 'admin' })
    .onConflictDoUpdate({
      target: users.authUserId,
      set: { role: 'admin', updatedAt: new Date() },
    });

  console.log('Admin seed aplicado com sucesso.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
