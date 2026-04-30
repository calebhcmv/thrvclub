import { requireAdminRole } from '@/lib/access/roles';
import { requireSession } from '@/lib/auth/session';

export default async function AdminPage() {
  const session = await requireSession();
  await requireAdminRole(session.user.id);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <p className="mt-2 text-[var(--color-text-secondary)]">Acesso autorizado. Próximo passo: dashboard administrativo real.</p>
    </main>
  );
}
