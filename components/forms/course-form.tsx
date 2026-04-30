import { createCourse, updateCourse } from '@/actions/courses';

type CourseFormProps = {
  mode: 'create' | 'edit';
  initialData?: {
    id: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    status: 'draft' | 'published' | 'archived';
  };
};

export function CourseForm({ mode, initialData }: CourseFormProps) {
  const action = mode === 'create' ? createCourse : updateCourse;

  return (
    <form action={action} className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      {mode === 'edit' ? <input type="hidden" name="courseId" value={initialData?.id} /> : null}

      <div className="space-y-1">
        <label htmlFor="title" className="text-sm">Título</label>
        <input id="title" name="title" defaultValue={initialData?.title ?? ''} required className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2" />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm">Descrição</label>
        <textarea id="description" name="description" defaultValue={initialData?.description ?? ''} className="min-h-28 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2" />
      </div>

      <div className="space-y-1">
        <label htmlFor="thumbnailUrl" className="text-sm">Thumbnail URL</label>
        <input id="thumbnailUrl" name="thumbnailUrl" type="url" defaultValue={initialData?.thumbnailUrl ?? ''} className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2" />
      </div>

      <div className="space-y-1">
        <label htmlFor="status" className="text-sm">Status</label>
        <select id="status" name="status" defaultValue={initialData?.status ?? 'draft'} className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface-1)] px-3 py-2">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <button type="submit" className="rounded-md bg-[var(--color-surface-3)] px-4 py-2 font-medium">
        {mode === 'create' ? 'Criar curso' : 'Salvar alterações'}
      </button>
    </form>
  );
}
