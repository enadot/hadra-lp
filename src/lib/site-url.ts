/**
 * Resolve the canonical site URL for metadata (Open Graph, canonical links).
 *
 * Env vars on Vercel are often *defined but empty* (e.g. pasted from
 * .env.example), so every candidate is treated as missing unless it parses as
 * a real URL. Never throws — a bad value falls through to the next candidate.
 */
export function resolveSiteUrl(): URL {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withProtocol);
    } catch {
      // not a URL — try the next candidate
    }
  }

  return new URL('http://localhost:3000');
}
