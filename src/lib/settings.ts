import 'server-only';
import { getStore } from './store';
import type { WebhookSettings } from './validation';

const key = (slug: string) => `settings:webhook:${slug}`;

export const defaultWebhookSettings: WebhookSettings = {
  url: '',
  enabled: false,
  token: '',
};

export type StoredWebhookSettings = WebhookSettings & {
  updatedAt: string | null;
};

export async function getWebhookSettings(
  slug: string,
): Promise<StoredWebhookSettings> {
  const stored = await getStore().get<StoredWebhookSettings>(key(slug));
  return { ...defaultWebhookSettings, updatedAt: null, ...(stored ?? {}) };
}

export async function saveWebhookSettings(
  slug: string,
  settings: WebhookSettings,
): Promise<StoredWebhookSettings> {
  const record: StoredWebhookSettings = {
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  await getStore().set(key(slug), record);
  return record;
}
