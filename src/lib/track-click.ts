import { readTracking } from './tracking';

export type TrackedButton = 'online' | 'pickup' | 'waze' | 'maps';

/**
 * Report a button click to /api/events without delaying navigation.
 * sendBeacon is queued by the browser even as the new tab opens; fetch with
 * keepalive is the fallback for browsers without it.
 */
export function trackClick(campaign: string, button: TrackedButton, href: string): void {
  if (typeof window === 'undefined') return;

  const body = JSON.stringify({ campaign, button, href, tracking: readTracking() });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon('/api/events', blob)) return;
    }
    void fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch {
    // tracking must never break the click
  }
}
