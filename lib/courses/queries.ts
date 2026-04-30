import { and, asc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { courses } from '@/lib/db/schema';

export async function listCoursesByUser(userId: string) {
  return db.select().from(courses).where(eq(courses.userId, userId)).orderBy(asc(courses.createdAt));
}

export async function getCourseByIdForUser(courseId: string, userId: string) {
  const result = await db
    .select()
    .from(courses)
    .where(and(eq(courses.id, courseId), eq(courses.userId, userId)))
    .limit(1);

  return result[0] ?? null;
}
