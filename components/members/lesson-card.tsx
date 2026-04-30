type LessonCardProps = {
  title: string;
  durationSec?: number | null;
  completed?: boolean;
};

export function LessonCard({ title, durationSec, completed = false }: LessonCardProps) {
  const durationMin = durationSec ? Math.ceil(durationSec / 60) : null;

  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-3">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-[var(--color-text-secondary)]">{durationMin ? `${durationMin} min` : 'Sem duração'}</p>
      </div>
      <span className="text-xs">{completed ? 'Concluída' : 'Pendente'}</span>
    </div>
  );
}
