import 'server-only';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
  isValidSessionToken,
} from './auth-token';

/**
 * The admin password is the one secret that has to come from the environment —
 * it is what protects the panel where the webhook address is edited.
 * In development it falls back to "hadra" so `npm run dev` works out of the box.
 */
function adminPassword(): string | null {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  if (fromEnv) return fromEnv;
  return process.env.NODE_ENV === 'production' ? null : 'hadra';
}

export function isAdminConfigured(): boolean {
  return adminPassword() !== null;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function signIn(password: string): Promise<boolean> {
  const expected = adminPassword();
  if (!expected || password !== expected) return false;

  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return true;
}

export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
