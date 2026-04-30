import Link from 'next/link';

export function MemberHeader() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface-1)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/members" className="font-semibold">THRVCLUB</Link>
        <nav className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
          <Link href="/members/library">Biblioteca</Link>
          <Link href="/members/search">Busca</Link>
          <a href="/api/auth/sign-out">Sair</a>
        </nav>
      </div>
    </header>
  );
}
