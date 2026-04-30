import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="text-[var(--color-text-secondary)]">
        O fluxo de autenticação é gerenciado pelo Neon Auth na rota <code>/api/auth</code>.
      </p>
      <div className="flex gap-3">
        <a href="/api/auth/sign-in" className="rounded-md bg-[var(--color-surface-3)] px-4 py-2">Entrar</a>
        <a href="/api/auth/sign-out" className="rounded-md bg-[var(--color-surface-3)] px-4 py-2">Sair</a>
        <Link href="/members" className="rounded-md bg-[var(--color-surface-3)] px-4 py-2">Ir para members</Link>
      </div>
    </main>
  );
}
