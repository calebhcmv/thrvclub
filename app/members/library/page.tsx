import Link from 'next/link';

import { requireSession } from '@/lib/auth/session';
import { listPublishedCourses } from '@/lib/members/queries';

export default async function MembersLibraryPage() {
  await requireSession();
  const courseList = await listPublishedCourses();

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Biblioteca</h1>
      <div className="space-y-3">
        {courseList.length === 0 ? <p>Nenhum curso publicado.</p> : null}
        {courseList.map((course) => (
          <article key={course.id} className="rounded border border-[var(--color-border)] p-4">
            <h2 className="font-medium">{course.title}</h2>
            <Link href={`/members/courses/${course.id}`} className="underline">Abrir curso</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
