'use server';

import { and, eq, inArray } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { requireSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { lessons, modules, userProgress } from '@/lib/db/schema';
import { lessonProgressSchema } from '@/schemas/progress';

export async function markLessonComplete(formData: FormData) {
  const session = await requireSession();
  const parsed = lessonProgressSchema.safeParse({ lessonId: String(formData.get('lessonId') ?? '') });

  if (!parsed.success) {
    return { ok: false, message: 'Dados inválidos.' };
  }

  await db
    .insert(userProgress)
    .values({
      userId: session.user.id,
      lessonId: parsed.data.lessonId,
      completed: true,
      completedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [userProgress.userId, userProgress.lessonId],
      set: { completed: true, completedAt: new Date(), updatedAt: new Date() },
    });

  revalidatePath('/members');
  return { ok: true };
}

export async function markLessonIncomplete(formData: FormData) {
  const session = await requireSession();
  const parsed = lessonProgressSchema.safeParse({ lessonId: String(formData.get('lessonId') ?? '') });

  if (!parsed.success) {
    return { ok: false, message: 'Dados inválidos.' };
  }

  await db
    .update(userProgress)
    .set({ completed: false, completedAt: null, updatedAt: new Date() })
    .where(and(eq(userProgress.userId, session.user.id), eq(userProgress.lessonId, parsed.data.lessonId)));

  revalidatePath('/members');
  return { ok: true };
}

export async function getCourseProgress(courseId: string) {
  const session = await requireSession();

  const moduleRows = await db.select({ id: modules.id }).from(modules).where(eq(modules.courseId, courseId));
  const moduleIds = moduleRows.map((row) => row.id);

  if (moduleIds.length === 0) {
    return { completedLessons: 0, totalLessons: 0, percentage: 0 };
  }

  const lessonRows = await db.select({ id: lessons.id }).from(lessons).where(inArray(lessons.moduleId, moduleIds));
  const lessonIds = lessonRows.map((row) => row.id);

  if (lessonIds.length === 0) {
    return { completedLessons: 0, totalLessons: 0, percentage: 0 };
  }

  const progressRows = await db
    .select({ lessonId: userProgress.lessonId })
    .from(userProgress)
    .where(and(eq(userProgress.userId, session.user.id), eq(userProgress.completed, true), inArray(userProgress.lessonId, lessonIds)));

  const completedLessons = progressRows.length;
  const totalLessons = lessonIds.length;
  const percentage = Math.round((completedLessons / totalLessons) * 100);

  return { completedLessons, totalLessons, percentage };
}
