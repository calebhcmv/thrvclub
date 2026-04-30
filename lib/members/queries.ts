import { and, eq, ilike, inArray, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { courses, lessons, modules, userProgress } from '@/lib/db/schema';

export async function listPublishedCourses() {
  return db.select().from(courses).where(eq(courses.status, 'published'));
}

export async function searchPublishedCoursesAndLessons(term: string) {
  const likeTerm = `%${term}%`;

  const courseMatches = await db
    .select({ id: courses.id, title: courses.title, type: sql<string>`'course'` })
    .from(courses)
    .where(and(eq(courses.status, 'published'), ilike(courses.title, likeTerm)))
    .limit(20);

  const lessonMatches = await db
    .select({
      id: lessons.id,
      title: lessons.title,
      type: sql<string>`'lesson'`,
      courseId: courses.id,
    })
    .from(lessons)
    .innerJoin(modules, eq(modules.id, lessons.moduleId))
    .innerJoin(courses, eq(courses.id, modules.courseId))
    .where(and(eq(courses.status, 'published'), ilike(lessons.title, likeTerm)))
    .limit(20);

  return { courseMatches, lessonMatches };
}

export async function getCourseDetailsForUser(courseId: string, userId: string) {
  const course = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);

  if (course.length === 0) return null;

  const moduleList = await db.select().from(modules).where(eq(modules.courseId, courseId));
  const moduleIds = moduleList.map((moduleItem) => moduleItem.id);

  const lessonList = moduleIds.length === 0 ? [] : await db.select().from(lessons).where(inArray(lessons.moduleId, moduleIds));

  const lessonIds = lessonList.map((lesson) => lesson.id);
  const progressList = lessonIds.length === 0
    ? []
    : await db
        .select()
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), inArray(userProgress.lessonId, lessonIds)));

  return {
    course: course[0],
    modules: moduleList,
    lessons: lessonList,
    progress: progressList,
  };
}

export async function getLessonForCourse(courseId: string, lessonId: string) {
  const result = await db
    .select({
      lessonId: lessons.id,
      lessonTitle: lessons.title,
      description: lessons.description,
      embedUrl: lessons.embedUrl,
      videoProvider: lessons.videoProvider,
      moduleId: modules.id,
      courseId: courses.id,
      courseTitle: courses.title,
    })
    .from(lessons)
    .innerJoin(modules, eq(modules.id, lessons.moduleId))
    .innerJoin(courses, eq(courses.id, modules.courseId))
    .where(and(eq(courses.id, courseId), eq(lessons.id, lessonId)))
    .limit(1);

  return result[0] ?? null;
}
