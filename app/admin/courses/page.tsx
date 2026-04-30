import Link from 'next/link';

import { requireSession } from '@/lib/auth/session';
import { requireAdminRole } from '@/lib/access/roles';
import { listCoursesByUser } from '@/lib/courses/queries';

export default async function AdminCoursesPage() {
  const session = await requireSession();
  await requireAdminRole(session.user.id);
  const courseList = await listCoursesByUser(session.user.id);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cursos</h1>
        <Link href="/admin/courses/new" className="rounded-md bg-[var(--color-surface-3)] px-4 py-2">Novo curso</Link>
      </div>

      <div className="space-y-3">
        {courseList.length === 0 ? (
          <p className="text-[var(--color-text-secondary)]">Nenhum curso cadastrado.</p>
        ) : (
          courseList.map((course) => (
            <article key={course.id} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
              <h2 className="font-medium">{course.title}</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">Status: {course.status}</p>
              <Link href={`/admin/courses/${course.id}/edit`} className="mt-3 inline-block text-sm underline">Editar</Link>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
