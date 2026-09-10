import 'server-only';
import { getStore } from './store';
import { newId, pendingDelivery, postToWebhook, type Delivery } from './webhook';
import type { OrderInput } from './validation';
import { trackingToPayload, type Tracking } from './tracking';

const MAX_ORDERS = 200;

export type { DeliveryStatus } from './webhook';

export type Order = {
  id: string;
  campaign: string;
  name: string;
  phone: string;
  address: string;
  qty: string;
  consent: true;
  createdAt: string;
  tracking: Tracking;
  delivery: Delivery;
};

const orderKey = (id: string) => `order:${id}`;
const indexKey = (slug: string) => `orders:${slug}`;

function orderPayload(order: Order): Record<string, unknown> {
  return {
    type: 'order',
    id: order.id,
    campaign: order.campaign,
    name: order.name,
    phone: order.phone,
    address: order.address,
    qty: order.qty,
    consent: order.consent,
    createdAt: order.createdAt,
    ...trackingToPayload(order.tracking),
  };
}

/** Store the order, then forward it. The order is kept even if forwarding fails. */
export async function createOrder(input: OrderInput): Promise<Order> {
  const store = getStore();
  const order: Order = {
    id: newId(),
    campaign: input.campaign,
    name: input.name,
    phone: input.phone,
    address: input.address ?? '',
    qty: input.qty || '1',
    consent: true,
    createdAt: new Date().toISOString(),
    tracking: input.tracking ?? {},
    delivery: pendingDelivery,
  };

  order.delivery = await postToWebhook(order.campaign, orderPayload(order));

  await store.set(orderKey(order.id), order);
  await store.listPrepend(indexKey(order.campaign), order.id, MAX_ORDERS);

  return order;
}

export async function listOrders(slug: string, limit = 50): Promise<Order[]> {
  const store = getStore();
  const ids = await store.listIds(indexKey(slug), limit);
  const orders = await Promise.all(ids.map((id) => store.get<Order>(orderKey(id))));
  return orders.filter((o): o is Order => o !== null);
}

export async function getOrder(id: string): Promise<Order | null> {
  return getStore().get<Order>(orderKey(id));
}

/** Re-send a stored order to the webhook and persist the new result. */
export async function retryOrder(id: string): Promise<Order | null> {
  const order = await getOrder(id);
  if (!order) return null;
  const updated: Order = {
    ...order,
    delivery: await postToWebhook(order.campaign, orderPayload(order)),
  };
  await getStore().set(orderKey(id), updated);
  return updated;
}
