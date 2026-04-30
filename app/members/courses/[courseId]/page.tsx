import Link from 'next/link';
import { notFound } from 'next/navigation';

import { requireSession } from '@/lib/auth/session';
import { getCourseDetailsForUser } from '@/lib/members/queries';

type Props = { params: Promise<{ courseId: string }> };

export default async function CourseDetailsPage({ params }: Props) {
  const session = await requireSession();
  const { courseId } = await params;
  const details = await getCourseDetailsForUser(courseId, session.user.id);

  if (!details) notFound();

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">{details.course.title}</h1>
      <p className="mb-4 text-sm text-[var(--color-text-secondary)]">Módulos: {details.modules.length} • Aulas: {details.lessons.length}</p>
      <div className="space-y-3">
        {details.lessons.map((lesson) => (
          <article key={lesson.id} className="rounded border border-[var(--color-border)] p-4">
            <h2>{lesson.title}</h2>
            <Link href={`/members/courses/${courseId}/${lesson.id}`} className="underline">Assistir</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
