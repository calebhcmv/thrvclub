'use client';

import Link from 'next/link';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen items-center justify-center p-6">
        <main className="max-w-xl space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Ocorreu um erro inesperado</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{error.message || 'Erro interno.'}</p>
          <div className="flex justify-center gap-3">
            <button onClick={reset} className="rounded-md bg-[var(--color-surface-3)] px-4 py-2">Tentar novamente</button>
            <Link href="/" className="rounded-md bg-[var(--color-surface-3)] px-4 py-2">Ir para início</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
