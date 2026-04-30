import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/server';

export type SessionUser = {
  id: string;
  email?: string;
};

export type AppSession = {
  user: SessionUser;
};

type UnknownSession = {
  user?: {
    id?: string;
    email?: string;
  };
};

function isSessionLike(value: unknown): value is UnknownSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return 'user' in value;
}

async function tryGetSession(): Promise<AppSession | null> {
  const candidate = auth as unknown as Record<string, unknown>;
  const getSession = candidate.getSession;

  if (typeof getSession !== 'function') {
    return null;
  }

  const raw = await (getSession as () => Promise<unknown>)();

  if (!isSessionLike(raw) || !raw.user?.id) {
    return null;
  }

  return {
    user: {
      id: raw.user.id,
      email: raw.user.email,
    },
  };
}

export async function requireSession(): Promise<AppSession> {
  const session = await tryGetSession();

  if (!session) {
    redirect('/login');
  }

  return session;
}
