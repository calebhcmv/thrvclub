'use server';

import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { courses } from '@/lib/db/schema';
import { requireSession } from '@/lib/auth/session';
import { createCourseSchema, updateCourseSchema } from '@/schemas/courses';

type ActionResult = {
  ok: boolean;
  message: string;
};

export async function createCourse(input: unknown): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = createCourseSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: 'Dados inválidos para criação de curso.' };
  }

  await db.insert(courses).values({
    userId: session.user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    thumbnailUrl: parsed.data.thumbnailUrl,
    status: parsed.data.status,
  });

  revalidatePath('/admin/courses');
  return { ok: true, message: 'Curso criado com sucesso.' };
}

export async function updateCourse(input: unknown): Promise<ActionResult> {
  const session = await requireSession();
  const parsed = updateCourseSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: 'Dados inválidos para atualização de curso.' };
  }

  await db
    .update(courses)
    .set({
      title: parsed.data.title,
      description: parsed.data.description,
      thumbnailUrl: parsed.data.thumbnailUrl,
      status: parsed.data.status,
      updatedAt: new Date(),
    })
    .where(and(eq(courses.id, parsed.data.courseId), eq(courses.userId, session.user.id)));

  revalidatePath('/admin/courses');
  revalidatePath(`/admin/courses/${parsed.data.courseId}/edit`);
  return { ok: true, message: 'Curso atualizado com sucesso.' };
}
