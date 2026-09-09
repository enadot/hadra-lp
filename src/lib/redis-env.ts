/**
 * Locate Upstash REST credentials in the environment.
 *
 * Vercel's Marketplace integration injects KV_REST_API_URL / KV_REST_API_TOKEN
 * (or a custom prefix the user picked), while Upstash's own console uses
 * UPSTASH_REDIS_REST_URL / _TOKEN. Blank values are treated as absent — env
 * vars pasted from .env.example are often defined but empty.
 */
export type RedisCredentials = { url: string; token: string; source: string };

const KNOWN_PAIRS: Array<[string, string]> = [
  ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
  ['KV_REST_API_URL', 'KV_REST_API_TOKEN'],
];

const present = (v: string | undefined): string | null => {
  const t = v?.trim();
  return t ? t : null;
};

export function findRedisCredentials(env: NodeJS.ProcessEnv = process.env): RedisCredentials | null {
  for (const [urlKey, tokenKey] of KNOWN_PAIRS) {
    const url = present(env[urlKey]);
    const token = present(env[tokenKey]);
    if (url && token) return { url, token, source: urlKey };
  }

  // Any custom prefix: <PREFIX>_REST_API_URL + <PREFIX>_REST_API_TOKEN,
  // or <PREFIX>_REDIS_REST_URL + <PREFIX>_REDIS_REST_TOKEN.
  for (const key of Object.keys(env).sort()) {
    if (!/(REST_API_URL|REDIS_REST_URL)$/.test(key)) continue;
    const url = present(env[key]);
    const token = present(env[key.replace(/URL$/, 'TOKEN')]);
    if (url && token && /^https?:\/\//i.test(url)) return { url, token, source: key };
  }

  return null;
}

/** Names (never values) of env vars that look storage-related — for the admin diagnostics. */
export function storageEnvNames(env: NodeJS.ProcessEnv = process.env): string[] {
  return Object.keys(env)
    .filter((k) => /REDIS|UPSTASH|KV_/i.test(k))
    .sort()
    .map((k) => (present(env[k]) ? k : `${k} (ריק)`));
}
