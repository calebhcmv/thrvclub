import Link from 'next/link';

import { requireAdminRole } from '@/lib/access/roles';
import { requireSession } from '@/lib/auth/session';
import { getAdminOverview, listPublishedCoursesCountByUser } from '@/lib/admin/queries';

export default async function AdminPage() {
  const session = await requireSession();
  await requireAdminRole(session.user.id);

  const [overview, myCourses] = await Promise.all([
    getAdminOverview(),
    listPublishedCoursesCountByUser(session.user.id),
  ]);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-[var(--color-text-secondary)]">Visão geral da plataforma.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
          <h2 className="text-sm text-[var(--color-text-secondary)]">Usuários</h2>
          <p className="text-2xl font-bold">{overview.usersTotal}</p>
        </article>
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
          <h2 className="text-sm text-[var(--color-text-secondary)]">Cursos</h2>
          <p className="text-2xl font-bold">{overview.coursesTotal}</p>
        </article>
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
          <h2 className="text-sm text-[var(--color-text-secondary)]">Aulas</h2>
          <p className="text-2xl font-bold">{overview.lessonsTotal}</p>
        </article>
        <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
          <h2 className="text-sm text-[var(--color-text-secondary)]">Meus cursos</h2>
          <p className="text-2xl font-bold">{myCourses}</p>
        </article>
      </section>

      <section className="flex gap-3">
        <Link href="/admin/courses" className="rounded-md bg-[var(--color-surface-3)] px-4 py-2">Gerenciar cursos</Link>
        <Link href="/admin/users" className="rounded-md bg-[var(--color-surface-3)] px-4 py-2">Ver usuários</Link>
      </section>
    </main>
  );
}
