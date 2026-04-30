import { notFound } from 'next/navigation';

import { markLessonComplete, markLessonIncomplete } from '@/actions/progress';
import { requireSession } from '@/lib/auth/session';
import { getLessonForCourse } from '@/lib/members/queries';

type Props = { params: Promise<{ courseId: string; lessonId: string }> };

export default async function LessonPlayerPage({ params }: Props) {
  await requireSession();
  const { courseId, lessonId } = await params;
  const lesson = await getLessonForCourse(courseId, lessonId);

  if (!lesson) notFound();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-semibold">{lesson.lessonTitle}</h1>
      <p className="mb-4 text-sm text-[var(--color-text-secondary)]">{lesson.courseTitle}</p>

      {lesson.embedUrl ? (
        <div className="relative">
          <iframe src={lesson.embedUrl} className="aspect-video w-full rounded" allowFullScreen />
          <div className="absolute right-0 top-0 z-10 h-10 w-20 bg-black" style={{ pointerEvents: 'none' }} />
        </div>
      ) : (
        <p>Essa aula ainda não possui embed.</p>
      )}

      <div className="mt-4 flex gap-3">
        <form action={markLessonComplete}>
          <input type="hidden" name="lessonId" value={lesson.lessonId} />
          <button className="rounded bg-[var(--color-surface-3)] px-4 py-2">Marcar concluída</button>
        </form>
        <form action={markLessonIncomplete}>
          <input type="hidden" name="lessonId" value={lesson.lessonId} />
          <button className="rounded bg-[var(--color-surface-3)] px-4 py-2">Desmarcar</button>
        </form>
      </div>
    </main>
  );
}
