import { and, eq, inArray } from 'drizzle-orm';

import { db } from '@/lib/db';
import { courses, lessons, modules, userProfiles, userProgress } from '@/lib/db/schema';

export async function getCourses() {
  return db.select().from(courses).where(eq(courses.status, 'published'));
}

export async function getCourseById(courseId: string) {
  const course = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (course.length === 0) return null;

  const moduleRows = await db.select().from(modules).where(eq(modules.courseId, courseId));
  const moduleIds = moduleRows.map((moduleRow) => moduleRow.id);
  const lessonRows = moduleIds.length ? await db.select().from(lessons).where(inArray(lessons.moduleId, moduleIds)) : [];

  return { course: course[0], modules: moduleRows, lessons: lessonRows };
}

export async function getAllCoursesAdmin(userId: string) {
  return db.select().from(courses).where(eq(courses.userId, userId));
}

export async function getLessonProgress(userId: string, lessonId: string) {
  const row = await db.select().from(userProgress).where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId))).limit(1);
  return row[0] ?? null;
}

export async function getCourseProgress(userId: string, courseId: string) {
  const moduleRows = await db.select({ id: modules.id }).from(modules).where(eq(modules.courseId, courseId));
  const moduleIds = moduleRows.map((moduleRow) => moduleRow.id);
  const lessonRows = moduleIds.length ? await db.select({ id: lessons.id }).from(lessons).where(inArray(lessons.moduleId, moduleIds)) : [];
  const lessonIds = lessonRows.map((row) => row.id);
  const doneRows = lessonIds.length
    ? await db.select({ id: userProgress.id }).from(userProgress).where(and(eq(userProgress.userId, userId), eq(userProgress.completed, true), inArray(userProgress.lessonId, lessonIds)))
    : [];

  const totalLessons = lessonIds.length;
  const completedLessons = doneRows.length;
  const percentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  return { totalLessons, completedLessons, percentage };
}

export async function getUserDashboardData(userId: string) {
  const allCourses = await getCourses();
  const recentCourses = allCourses.slice(0, 5);
  const progress = await Promise.all(recentCourses.map((course) => getCourseProgress(userId, course.id)));
  return { recentCourses, progress };
}

export async function getAllUsers() {
  return db.select().from(userProfiles);
}
