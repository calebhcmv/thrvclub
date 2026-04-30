import { LessonCard } from '@/components/members/lesson-card';

type ModuleAccordionProps = {
  modules: Array<{
    id: string;
    title: string;
    lessons: Array<{ id: string; title: string; durationSec?: number | null; completed?: boolean }>;
  }>;
};

export function ModuleAccordion({ modules }: ModuleAccordionProps) {
  return (
    <div className="space-y-3">
      {modules.map((moduleItem) => (
        <details key={moduleItem.id} className="rounded-xl border border-[var(--color-border)] p-3">
          <summary className="cursor-pointer font-medium">{moduleItem.title}</summary>
          <div className="mt-3 space-y-2">
            {moduleItem.lessons.map((lesson) => (
              <LessonCard key={lesson.id} title={lesson.title} durationSec={lesson.durationSec} completed={lesson.completed} />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
