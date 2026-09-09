/**
 * Attribution captured on the landing page and forwarded with every order.
 *
 * UTM parameters are read from the URL on the first page view and kept in
 * sessionStorage, so they survive a refresh or a scroll-to-#order navigation
 * before the form is submitted. Click ids (fbclid / gclid) ride along for
 * ad-platform conversion matching.
 */
export const TRACKING_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  'gclid',
] as const;

export type TrackingKey = (typeof TRACKING_KEYS)[number];

export type Tracking = Partial<Record<TrackingKey, string>> & {
  landing_url?: string;
  referrer?: string;
};

const STORAGE_KEY = 'hadra_tracking';
const MAX_LEN = 200;

function clean(value: string | null | undefined): string | undefined {
  const v = value?.trim();
  return v ? v.slice(0, MAX_LEN) : undefined;
}

/** Read tracking from the current URL, merged over what was saved earlier. Browser only. */
export function readTracking(): Tracking {
  if (typeof window === 'undefined') return {};

  let saved: Tracking = {};
  try {
    saved = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? '{}') as Tracking;
  } catch {
    saved = {};
  }

  const params = new URLSearchParams(window.location.search);
  const fromUrl: Tracking = {};
  for (const key of TRACKING_KEYS) {
    const value = clean(params.get(key));
    if (value) fromUrl[key] = value;
  }

  const hasUtmInUrl = Object.keys(fromUrl).length > 0;
  const merged: Tracking = {
    ...saved,
    ...fromUrl,
    // first touch wins for the landing url / referrer within the session
    landing_url: saved.landing_url ?? clean(window.location.href),
    referrer: saved.referrer ?? clean(document.referrer) ?? undefined,
  };

  if (hasUtmInUrl || !saved.landing_url) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // storage unavailable (private mode etc.) — still return what we have
    }
  }

  return merged;
}

/** Flatten for the webhook body: every key present, empty string when unknown. */
export function trackingToPayload(tracking: Tracking | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of TRACKING_KEYS) out[key] = tracking?.[key] ?? '';
  out.landing_url = tracking?.landing_url ?? '';
  out.referrer = tracking?.referrer ?? '';
  return out;
}
