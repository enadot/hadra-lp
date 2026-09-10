import 'server-only';
import { getWebhookSettings } from './settings';

export type DeliveryStatus = 'delivered' | 'failed' | 'skipped';

export type Delivery = {
  status: DeliveryStatus;
  /** HTTP status, or null when no request was made. */
  httpStatus: number | null;
  detail: string;
  attemptedAt: string | null;
};

export const pendingDelivery: Delivery = {
  status: 'skipped',
  httpStatus: null,
  detail: 'ממתין לשליחה',
  attemptedAt: null,
};

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/** POST a JSON payload to the campaign's configured webhook. Never throws. */
export async function postToWebhook(
  campaign: string,
  payload: Record<string, unknown>,
): Promise<Delivery> {
  const settings = await getWebhookSettings(campaign);
  const attemptedAt = new Date().toISOString();

  if (!settings.enabled || !settings.url) {
    return {
      status: 'skipped',
      httpStatus: null,
      detail: 'לא הוגדר וובהוק פעיל — נשמר בלוח הבקרה בלבד',
      attemptedAt: null,
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(settings.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(settings.token ? { 'X-Hadra-Token': settings.token } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    return response.ok
      ? { status: 'delivered', httpStatus: response.status, detail: 'נשלח בהצלחה', attemptedAt }
      : {
          status: 'failed',
          httpStatus: response.status,
          detail: `הוובהוק החזיר שגיאה ${response.status}`,
          attemptedAt,
        };
  } catch (error) {
    return {
      status: 'failed',
      httpStatus: null,
      detail:
        error instanceof Error && error.name === 'AbortError'
          ? 'הוובהוק לא הגיב תוך 10 שניות'
          : 'לא ניתן היה להתחבר לכתובת הוובהוק',
      attemptedAt,
    };
  }
}
