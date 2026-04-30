import { createLesson } from '@/actions/lessons';

type LessonFormProps = {
  moduleId: string;
};

export function LessonForm({ moduleId }: LessonFormProps) {
  return (
    <form action={createLesson} className="grid gap-2 md:grid-cols-2">
      <input type="hidden" name="moduleId" value={moduleId} />
      <input name="title" placeholder="Título da aula" className="rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2" />
      <input name="position" type="number" min={1} placeholder="Posição" className="rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2" />
      <select name="videoProvider" defaultValue="none" className="rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2">
        <option value="none">none</option>
        <option value="youtube">youtube</option>
        <option value="vk">vk</option>
      </select>
      <input name="embedUrl" placeholder="Embed URL" className="rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2" />
      <textarea name="description" placeholder="Descrição" className="rounded border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2 md:col-span-2" />
      <button className="rounded bg-[var(--color-surface-3)] px-4 py-2 md:col-span-2">Criar aula</button>
    </form>
  );
}
