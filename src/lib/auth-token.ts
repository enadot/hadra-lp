import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'hadra_admin';
const SESSION_HOURS = 12;

/** The configured secret, or null when missing/empty in production. */
export function authSecret(): string | null {
  const fromEnv = process.env.AUTH_SECRET?.trim();
  if (fromEnv) return fromEnv;
  return process.env.NODE_ENV === 'production' ? null : 'dev-only-insecure-secret';
}

function secretKey(): Uint8Array {
  const secret = authSecret();
  if (!secret) {
    throw new Error('AUTH_SECRET is not set — the admin panel cannot sign in.');
  }
  return new TextEncoder().encode(secret.padEnd(32, '.'));
}

export async function createSessionToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_HOURS}h`)
    .sign(secretKey());
}

export async function isValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export const SESSION_MAX_AGE = SESSION_HOURS * 60 * 60;
