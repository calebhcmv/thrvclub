import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-bold">Página não encontrada</h1>
      <p className="text-[var(--color-text-secondary)]">O recurso pode não existir ou você não tem permissão de acesso.</p>
      <Link href="/" className="rounded-md bg-[var(--color-surface-3)] px-4 py-2">Voltar para início</Link>
    </main>
  );
}
