'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { requireAdminRole } from '@/lib/access/roles';
import { requireSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { courses, lessons, modules } from '@/lib/db/schema';
import { createLessonSchema, updateLessonSchema } from '@/schemas/lessons';

async function verifyModuleOwnership(moduleId: string, userId: string) {
  const owned = await db
    .select({ moduleId: modules.id, courseId: courses.id })
    .from(modules)
    .innerJoin(courses, eq(courses.id, modules.courseId))
    .where(and(eq(modules.id, moduleId), eq(courses.userId, userId)))
    .limit(1);

  return owned[0] ?? null;
}

export async function createLesson(formData: FormData) {
  const session = await requireSession();
  await requireAdminRole(session.user.id);

  const parsed = createLessonSchema.safeParse({
    moduleId: String(formData.get('moduleId') ?? ''),
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? '') || undefined,
    videoProvider: String(formData.get('videoProvider') ?? 'none'),
    embedUrl: String(formData.get('embedUrl') ?? '') || undefined,
    position: String(formData.get('position') ?? ''),
  });

  if (!parsed.success) return { ok: false, message: 'Dados inválidos.' };

  const owned = await verifyModuleOwnership(parsed.data.moduleId, session.user.id);
  if (!owned) return { ok: false, message: 'Módulo não autorizado.' };

  await db.insert(lessons).values({
    moduleId: parsed.data.moduleId,
    title: parsed.data.title,
    description: parsed.data.description,
    videoProvider: parsed.data.videoProvider,
    embedUrl: parsed.data.embedUrl,
    position: parsed.data.position,
  });

  await logAudit({ userId: session.user.id, action: 'create', entity: 'lesson', metadata: { moduleId: parsed.data.moduleId, title: parsed.data.title } });

  await logAudit({ userId: session.user.id, action: 'update', entity: 'lesson', entityId: parsed.data.lessonId });

  revalidatePath(`/admin/courses/${owned.courseId}/edit`);
  return { ok: true };
}

export async function updateLesson(formData: FormData) {
  const session = await requireSession();
  await requireAdminRole(session.user.id);

  const parsed = updateLessonSchema.safeParse({
    lessonId: String(formData.get('lessonId') ?? ''),
    moduleId: String(formData.get('moduleId') ?? ''),
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? '') || undefined,
    videoProvider: String(formData.get('videoProvider') ?? 'none'),
    embedUrl: String(formData.get('embedUrl') ?? '') || undefined,
    position: String(formData.get('position') ?? ''),
  });

  if (!parsed.success) return { ok: false, message: 'Dados inválidos.' };

  const owned = await verifyModuleOwnership(parsed.data.moduleId, session.user.id);
  if (!owned) return { ok: false, message: 'Módulo não autorizado.' };

  await db
    .update(lessons)
    .set({
      moduleId: parsed.data.moduleId,
      title: parsed.data.title,
      description: parsed.data.description,
      videoProvider: parsed.data.videoProvider,
      embedUrl: parsed.data.embedUrl,
      position: parsed.data.position,
      updatedAt: new Date(),
    })
    .where(eq(lessons.id, parsed.data.lessonId));

  revalidatePath(`/admin/courses/${owned.courseId}/edit`);
  return { ok: true };
}

export async function deleteLesson(formData: FormData) {
  const session = await requireSession();
  await requireAdminRole(session.user.id);

  const lessonId = String(formData.get('lessonId') ?? '');
  const moduleId = String(formData.get('moduleId') ?? '');
  const owned = await verifyModuleOwnership(moduleId, session.user.id);
  if (!owned) return { ok: false, message: 'Módulo não autorizado.' };

  await db.delete(lessons).where(and(eq(lessons.id, lessonId), eq(lessons.moduleId, moduleId)));
  await logAudit({ userId: session.user.id, action: 'delete', entity: 'lesson', entityId: lessonId });
  revalidatePath(`/admin/courses/${owned.courseId}/edit`);
  return { ok: true };
}
