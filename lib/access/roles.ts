import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

import { db } from '@/lib/db';
import { userProfiles } from '@/lib/db/schema';

export type UserRole = 'admin' | 'member';

export async function getRoleByAuthUserId(authUserId: string): Promise<UserRole | null> {
  const result = await db
    .select({ role: userProfiles.role })
    .from(userProfiles)
    .where(eq(userProfiles.id, authUserId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0].role;
}

export async function requireAdminRole(authUserId: string): Promise<void> {
  const role = await getRoleByAuthUserId(authUserId);

  if (role !== 'admin') {
    notFound();
  }
}
