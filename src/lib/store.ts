import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Redis } from '@upstash/redis';
import { findRedisCredentials } from './redis-env';

/**
 * Tiny key/value abstraction so the app runs with zero setup locally and on
 * Upstash Redis (Vercel Marketplace) in production.
 *
 * The webhook address deliberately lives here rather than in an env var, so it
 * can be changed from /admin without a redeploy.
 */
export type StoreDriver = 'redis' | 'file';

export type Store = {
  driver: StoreDriver;
  /** false = data disappears on redeploy/cold start (local file fallback). */
  persistent: boolean;
  /** Which env var supplied the connection (redis) or the file path (file). */
  source: string;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  del(key: string): Promise<void>;
  /** Prepend to a capped list of ids. */
  listPrepend(key: string, id: string, cap: number): Promise<void>;
  listIds(key: string, limit: number): Promise<string[]>;
};

function createRedisStore(url: string, token: string, source: string): Store {
  const redis = new Redis({ url, token });
  return {
    driver: 'redis',
    persistent: true,
    source,
    async get<T>(key: string) {
      return (await redis.get<T>(key)) ?? null;
    },
    async set<T>(key: string, value: T) {
      await redis.set(key, value);
    },
    async del(key: string) {
      await redis.del(key);
    },
    async listPrepend(key: string, id: string, cap: number) {
      await redis.lpush(key, id);
      await redis.ltrim(key, 0, cap - 1);
    },
    async listIds(key: string, limit: number) {
      return (await redis.lrange<string>(key, 0, limit - 1)) ?? [];
    },
  };
}

/* ---------- file fallback (local dev / preview without Redis) ------------- */

const filePath = process.env.VERCEL
  ? path.join('/tmp', 'hadra-store.json')
  : path.join(process.cwd(), '.data', 'store.json');

type FileShape = Record<string, unknown>;

async function readFileStore(): Promise<FileShape> {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8')) as FileShape;
  } catch {
    return {};
  }
}

async function writeFileStore(data: FileShape): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function createFileStore(): Store {
  return {
    driver: 'file',
    persistent: false,
    source: filePath,
    async get<T>(key: string) {
      const data = await readFileStore();
      return (data[key] as T) ?? null;
    },
    async set<T>(key: string, value: T) {
      const data = await readFileStore();
      data[key] = value;
      await writeFileStore(data);
    },
    async del(key: string) {
      const data = await readFileStore();
      delete data[key];
      await writeFileStore(data);
    },
    async listPrepend(key: string, id: string, cap: number) {
      const data = await readFileStore();
      const list = Array.isArray(data[key]) ? (data[key] as string[]) : [];
      data[key] = [id, ...list].slice(0, cap);
      await writeFileStore(data);
    },
    async listIds(key: string, limit: number) {
      const data = await readFileStore();
      const list = Array.isArray(data[key]) ? (data[key] as string[]) : [];
      return list.slice(0, limit);
    },
  };
}

let cached: Store | null = null;

export function getStore(): Store {
  if (!cached) {
    const creds = findRedisCredentials();
    cached = creds
      ? createRedisStore(creds.url, creds.token, creds.source)
      : createFileStore();
  }
  return cached;
}
