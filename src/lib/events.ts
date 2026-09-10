import 'server-only';
import { getStore } from './store';
import { trackingToPayload, type Tracking } from './tracking';
import { newId, pendingDelivery, postToWebhook, type Delivery } from './webhook';

const MAX_EVENTS = 500;

export const CLICK_BUTTONS = ['online', 'pickup', 'waze', 'maps'] as const;
export type ClickButton = (typeof CLICK_BUTTONS)[number];

export const clickButtonLabels: Record<ClickButton, string> = {
  online: 'רכישה מקוונת',
  pickup: 'איסוף עצמי',
  waze: 'ניווט Waze',
  maps: 'Google Maps',
};

export type ClickEvent = {
  id: string;
  campaign: string;
  button: ClickButton;
  href: string;
  createdAt: string;
  tracking: Tracking;
  delivery: Delivery;
};

const eventKey = (id: string) => `event:${id}`;
const indexKey = (slug: string) => `events:${slug}`;

export async function createClickEvent(input: {
  campaign: string;
  button: ClickButton;
  href: string;
  tracking?: Tracking;
}): Promise<ClickEvent> {
  const store = getStore();
  const event: ClickEvent = {
    id: newId(),
    campaign: input.campaign,
    button: input.button,
    href: input.href,
    createdAt: new Date().toISOString(),
    tracking: input.tracking ?? {},
    delivery: pendingDelivery,
  };

  event.delivery = await postToWebhook(event.campaign, {
    type: 'click',
    id: event.id,
    campaign: event.campaign,
    button: event.button,
    buttonLabel: clickButtonLabels[event.button],
    href: event.href,
    createdAt: event.createdAt,
    ...trackingToPayload(event.tracking),
  });

  await store.set(eventKey(event.id), event);
  await store.listPrepend(indexKey(event.campaign), event.id, MAX_EVENTS);
  return event;
}

export async function listClickEvents(slug: string, limit = 50): Promise<ClickEvent[]> {
  const store = getStore();
  const ids = await store.listIds(indexKey(slug), limit);
  const events = await Promise.all(ids.map((id) => store.get<ClickEvent>(eventKey(id))));
  return events.filter((e): e is ClickEvent => e !== null);
}
