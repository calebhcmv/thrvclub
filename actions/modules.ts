'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { requireAdminRole } from '@/lib/access/roles';
import { requireSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { logAudit } from '@/lib/audit';
import { courses, modules } from '@/lib/db/schema';
import { createModuleSchema } from '@/schemas/modules';

export async function createModule(formData: FormData) {
  const session = await requireSession();
  await requireAdminRole(session.user.id);

  const parsed = createModuleSchema.safeParse({
    courseId: String(formData.get('courseId') ?? ''),
    title: String(formData.get('title') ?? ''),
    position: String(formData.get('position') ?? ''),
  });

  if (!parsed.success) return { ok: false, message: 'Dados inválidos.' };

  const owner = await db
    .select({ id: courses.id })
    .from(courses)
    .where(and(eq(courses.id, parsed.data.courseId), eq(courses.userId, session.user.id)))
    .limit(1);

  if (owner.length === 0) return { ok: false, message: 'Curso não autorizado.' };

  await db.insert(modules).values({
    courseId: parsed.data.courseId,
    title: parsed.data.title,
    position: parsed.data.position,
  });

  await logAudit({ userId: session.user.id, action: 'create', entity: 'module', metadata: { courseId: parsed.data.courseId, title: parsed.data.title } });

  revalidatePath(`/admin/courses/${parsed.data.courseId}/edit`);
  return { ok: true };
}


export async function updateModule(formData: FormData) {
  const session = await requireSession();
  await requireAdminRole(session.user.id);

  const moduleId = String(formData.get('moduleId') ?? '');
  const title = String(formData.get('title') ?? '');
  const position = Number(formData.get('position') ?? 0);

  if (!moduleId || !title || position < 1) return { ok: false, message: 'Dados inválidos.' };

  await db.update(modules).set({ title, position, updatedAt: new Date() }).where(eq(modules.id, moduleId));
  await logAudit({ userId: session.user.id, action: 'update', entity: 'module', entityId: moduleId });
  revalidatePath('/admin/courses');
  return { ok: true };
}

export async function deleteModule(formData: FormData) {
  const session = await requireSession();
  await requireAdminRole(session.user.id);

  const moduleId = String(formData.get('moduleId') ?? '');
  if (!moduleId) return { ok: false, message: 'Módulo inválido.' };

  await db.delete(modules).where(eq(modules.id, moduleId));
  await logAudit({ userId: session.user.id, action: 'delete', entity: 'module', entityId: moduleId });
  revalidatePath('/admin/courses');
  return { ok: true };
}
