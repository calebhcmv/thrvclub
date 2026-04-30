import { and, asc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { courses, lessons, modules } from '@/lib/db/schema';

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

export async function getCourseStructureForUser(courseId: string, userId: string) {
  const course = await getCourseByIdForUser(courseId, userId);
  if (!course) return null;

  const moduleRows = await db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(asc(modules.position));

  const moduleWithLessons = await Promise.all(
    moduleRows.map(async (moduleRow) => {
      const lessonRows = await db
        .select()
        .from(lessons)
        .where(eq(lessons.moduleId, moduleRow.id))
        .orderBy(asc(lessons.position));
      return { ...moduleRow, lessons: lessonRows };
    }),
  );

  return { course, modules: moduleWithLessons };
}
