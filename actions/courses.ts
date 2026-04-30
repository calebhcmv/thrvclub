'use server';

import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { courses } from '@/lib/db/schema';
import { requireSession } from '@/lib/auth/session';
import { createCourseSchema, updateCourseSchema } from '@/schemas/courses';

type ActionResult = {
  ok: boolean;
  message: string;
};

function normalizeFormData(formData: FormData) {
  return {
    courseId: String(formData.get('courseId') ?? ''),
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    thumbnailUrl: String(formData.get('thumbnailUrl') ?? ''),
    status: String(formData.get('status') ?? 'draft'),
  };
}

export async function createCourse(formData: FormData): Promise<ActionResult> {
  const session = await requireSession();
  const payload = normalizeFormData(formData);

  const parsed = createCourseSchema.safeParse({
    title: payload.title,
    description: payload.description || undefined,
    thumbnailUrl: payload.thumbnailUrl || undefined,
    status: payload.status,
  });

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

  await logAudit({ userId: session.user.id, action: 'create', entity: 'course', metadata: { title: parsed.data.title } });

  revalidatePath('/admin/courses');
  return { ok: true, message: 'Curso criado com sucesso.' };
}

export async function updateCourse(formData: FormData): Promise<ActionResult> {
  const session = await requireSession();
  const payload = normalizeFormData(formData);

  const parsed = updateCourseSchema.safeParse({
    courseId: payload.courseId,
    title: payload.title,
    description: payload.description || undefined,
    thumbnailUrl: payload.thumbnailUrl || undefined,
    status: payload.status,
  });

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

  await logAudit({ userId: session.user.id, action: 'update', entity: 'course', entityId: parsed.data.courseId });

  revalidatePath('/admin/courses');
  revalidatePath(`/admin/courses/${parsed.data.courseId}/edit`);
  return { ok: true, message: 'Curso atualizado com sucesso.' };
}


export async function deleteCourse(formData: FormData): Promise<ActionResult> {
  const session = await requireSession();
  const courseId = String(formData.get('courseId') ?? '');

  if (!courseId) {
    return { ok: false, message: 'Curso inválido.' };
  }

  await db.delete(courses).where(and(eq(courses.id, courseId), eq(courses.userId, session.user.id)));
  await logAudit({ userId: session.user.id, action: 'delete', entity: 'course', entityId: courseId });
  revalidatePath('/admin/courses');
  return { ok: true, message: 'Curso removido com sucesso.' };
}
