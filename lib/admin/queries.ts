import { count, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { courses, lessons, users } from '@/lib/db/schema';

export async function getAdminOverview() {
  const [usersTotal] = await db.select({ value: count() }).from(users);
  const [coursesTotal] = await db.select({ value: count() }).from(courses);
  const [lessonsTotal] = await db.select({ value: count() }).from(lessons);

  return {
    usersTotal: usersTotal?.value ?? 0,
    coursesTotal: coursesTotal?.value ?? 0,
    lessonsTotal: lessonsTotal?.value ?? 0,
  };
}

export async function listUsers() {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(users.createdAt);
}

export async function listPublishedCoursesCountByUser(authUserId: string) {
  const [row] = await db
    .select({ value: count() })
    .from(courses)
    .where(eq(courses.userId, authUserId));

  return row?.value ?? 0;
}
