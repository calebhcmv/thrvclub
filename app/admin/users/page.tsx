import { requireAdminRole } from '@/lib/access/roles';
import { requireSession } from '@/lib/auth/session';
import { listUsers } from '@/lib/admin/queries';
import { EmptyState } from '@/components/ui/empty-state';

export default async function AdminUsersPage() {
  const session = await requireSession();
  await requireAdminRole(session.user.id);

  const users = await listUsers();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-2xl font-semibold">Usuários</h1>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-[var(--color-surface-2)] text-left">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td className="p-4" colSpan={4}><EmptyState title="Sem usuários" description="Nenhum usuário cadastrado até o momento." /></td></tr>
            ) : null}
            {users.map((user) => (
              <tr key={user.id} className="border-t border-[var(--color-border)]">
                <td className="p-3">{user.name ?? '-'}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
