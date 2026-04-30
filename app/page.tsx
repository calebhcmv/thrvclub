import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight">THRVCLUB</h1>
      <p className="text-[var(--color-text-secondary)]">Base da nova stack pronta para a fase 2.</p>
      <div className="flex gap-3">
        <Link href="/login" className="rounded-md bg-[var(--color-surface-2)] px-4 py-2">Login</Link>
        <Link href="/members" className="rounded-md bg-[var(--color-surface-2)] px-4 py-2">Members</Link>
        <Link href="/admin" className="rounded-md bg-[var(--color-surface-2)] px-4 py-2">Admin</Link>
      </div>
    </main>
  );
}
