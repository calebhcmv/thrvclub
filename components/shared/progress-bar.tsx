type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-3)]">
      <div className="h-full rounded-full bg-[var(--color-accent-soft-pink)] transition-all" style={{ width: `${safeValue}%` }} />
    </div>
  );
}
