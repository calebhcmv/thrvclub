export default function SignupPage() {
  return (
    <main className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Criar conta</h1>
      <p className="text-[var(--color-text-secondary)]">Use o fluxo do Neon Auth para cadastro.</p>
      <a href="/api/auth/sign-up" className="rounded-md bg-[var(--color-surface-3)] px-4 py-2 inline-block">Cadastrar</a>
    </main>
  );
}
