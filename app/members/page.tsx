import Link from 'next/link';

import { requireSession } from '@/lib/auth/session';
import { listPublishedCourses } from '@/lib/members/queries';
import { getCourseProgress } from '@/actions/progress';

export default async function MembersPage() {
  await requireSession();
  const courses = await listPublishedCourses();

  const coursesWithProgress = await Promise.all(
    courses.slice(0, 5).map(async (course) => ({
      course,
      progress: await getCourseProgress(course.id),
    })),
  );

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      <div className="space-y-4">
        {coursesWithProgress.length === 0 ? <p>Nenhum curso disponível.</p> : null}
        {coursesWithProgress.map(({ course, progress }) => (
          <article key={course.id} className="rounded border border-[var(--color-border)] p-4">
            <h2 className="font-medium">{course.title}</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Progresso: {progress.completedLessons}/{progress.totalLessons} ({progress.percentage}%)
            </p>
            <Link href={`/members/courses/${course.id}`} className="underline">Continuar</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
