'use client';

type DeleteButtonProps = {
  label?: string;
  onConfirm?: () => void;
};

export function DeleteButton({ label = 'Excluir', onConfirm }: DeleteButtonProps) {
  return (
    <button
      type="button"
      className="rounded-md border border-red-500/40 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
      onClick={() => {
        const allowed = window.confirm('Tem certeza que deseja excluir?');
        if (allowed) {
          onConfirm?.();
        }
      }}
    >
      {label}
    </button>
  );
}
