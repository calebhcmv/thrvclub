import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/server';

export default async function HomePage() {
  const candidate = auth as unknown as Record<string, unknown>;
  const getSession = candidate.getSession;

  if (typeof getSession === 'function') {
    const session = await (getSession as () => Promise<unknown>)();
    if (session && typeof session === 'object') {
      redirect('/members');
    }
  }

  redirect('/login');
}
