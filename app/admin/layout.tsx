import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface-1)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <Link href="/admin" className="font-semibold">THRVCLUB Admin</Link>
          <nav className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
            <Link href="/admin/courses">Cursos</Link>
            <Link href="/admin/users">Usuários</Link>
            <Link href="/members">Área de membros</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
