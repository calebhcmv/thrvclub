import { requireSession } from '@/lib/auth/session';

export default async function MembersPage() {
  await requireSession();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Área de Membros</h1>
      <p className="mt-2 text-[var(--color-text-secondary)]">Acesso autenticado. Próximo passo: biblioteca e progresso reais.</p>
    </main>
  );
}
