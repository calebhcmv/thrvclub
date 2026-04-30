import Link from 'next/link';

export function AdminSidebar() {
  return (
    <aside className="space-y-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4">
      <Link href="/admin" className="block text-sm">Dashboard</Link>
      <Link href="/admin/courses" className="block text-sm">Cursos</Link>
      <Link href="/admin/users" className="block text-sm">Usuários</Link>
    </aside>
  );
}
