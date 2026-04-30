import Link from 'next/link';

import { ProgressBar } from '@/components/shared/progress-bar';

type CourseCardProps = {
  id: string;
  title: string;
  progress: number;
};

export function CourseCard({ id, title, progress }: CourseCardProps) {
  return (
    <article className="space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <h3 className="font-medium">{title}</h3>
      <ProgressBar value={progress} />
      <Link href={`/members/courses/${id}`} className="text-sm underline">Abrir curso</Link>
    </article>
  );
}
