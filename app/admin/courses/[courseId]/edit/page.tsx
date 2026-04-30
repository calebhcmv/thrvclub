import { requireAdminRole } from '@/lib/access/roles';
import { requireSession } from '@/lib/auth/session';
import { CourseForm } from '@/components/forms/course-form';
import { createLesson, deleteLesson } from '@/actions/lessons';
import { createModule } from '@/actions/modules';
import { getCourseStructureForUser } from '@/lib/courses/queries';
import { notFound } from 'next/navigation';

type EditPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function EditCoursePage({ params }: EditPageProps) {
  const session = await requireSession();
  await requireAdminRole(session.user.id);
  const { courseId } = await params;

  const data = await getCourseStructureForUser(courseId, session.user.id);
  if (!data) notFound();

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-6">
      <section>
        <h1 className="mb-4 text-2xl font-semibold">Editar curso</h1>
        <CourseForm
          mode="edit"
          initialData={{
            id: data.course.id,
            title: data.course.title,
            description: data.course.description,
            thumbnailUrl: data.course.thumbnailUrl,
            status: data.course.status,
          }}
        />
      </section>

      <section className="space-y-4 rounded-xl border border-[var(--color-border)] p-4">
        <h2 className="text-xl font-semibold">Adicionar módulo</h2>
        <form action={createModule} className="grid gap-3 md:grid-cols-3">
          <input type="hidden" name="courseId" value={data.course.id} />
          <input name="title" placeholder="Título do módulo" className="rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2" />
          <input name="position" type="number" min={1} placeholder="Posição" className="rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2" />
          <button className="rounded bg-[var(--color-surface-3)] px-4 py-2">Criar módulo</button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Módulos e aulas</h2>
        {data.modules.length === 0 ? <p>Nenhum módulo ainda.</p> : null}
        {data.modules.map((moduleRow) => (
          <article key={moduleRow.id} className="space-y-4 rounded-xl border border-[var(--color-border)] p-4">
            <header>
              <h3 className="font-medium">{moduleRow.position}. {moduleRow.title}</h3>
            </header>

            <form action={createLesson} className="grid gap-2 md:grid-cols-3">
              <input type="hidden" name="moduleId" value={moduleRow.id} />
              <input name="title" placeholder="Título da aula" className="rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2" />
              <input name="position" type="number" min={1} placeholder="Posição" className="rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2" />
              <select name="videoProvider" defaultValue="none" className="rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2">
                <option value="none">none</option>
                <option value="youtube">youtube</option>
                <option value="vk">vk</option>
              </select>
              <input name="embedUrl" placeholder="Embed URL" className="rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 md:col-span-2" />
              <textarea name="description" placeholder="Descrição" className="rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 md:col-span-3" />
              <button className="rounded bg-[var(--color-surface-3)] px-4 py-2 md:col-span-3">Criar aula</button>
            </form>

            <div className="space-y-2">
              {moduleRow.lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between rounded border border-[var(--color-border)] p-2">
                  <span>{lesson.position}. {lesson.title}</span>
                  <form action={deleteLesson}>
                    <input type="hidden" name="lessonId" value={lesson.id} />
                    <input type="hidden" name="moduleId" value={moduleRow.id} />
                    <button className="text-sm underline">Excluir</button>
                  </form>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
