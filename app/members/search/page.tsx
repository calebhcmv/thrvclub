import Link from 'next/link';

import { requireSession } from '@/lib/auth/session';
import { searchPublishedCoursesAndLessons } from '@/lib/members/queries';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function MembersSearchPage({ searchParams }: Props) {
  await requireSession();
  const { q = '' } = await searchParams;

  const results = q.trim().length >= 2 ? await searchPublishedCoursesAndLessons(q.trim()) : null;

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Busca</h1>

      <form className="mb-6" action="/members/search" method="GET">
        <input name="q" defaultValue={q} placeholder="Buscar cursos e aulas" className="w-full rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2" />
      </form>

      {results ? (
        <div className="space-y-6">
          <section>
            <h2 className="mb-2 font-medium">Cursos</h2>
            {results.courseMatches.map((course) => (
              <div key={course.id}>
                <Link href={`/members/courses/${course.id}`} className="underline">{course.title}</Link>
              </div>
            ))}
          </section>

          <section>
            <h2 className="mb-2 font-medium">Aulas</h2>
            {results.lessonMatches.map((lesson) => (
              <div key={lesson.id}>
                <Link href={`/members/courses/${lesson.courseId}/${lesson.id}`} className="underline">{lesson.title}</Link>
              </div>
            ))}
          </section>
        </div>
      ) : (
        <p className="text-[var(--color-text-secondary)]">Digite ao menos 2 caracteres para buscar.</p>
      )}
    </main>
  );
}
