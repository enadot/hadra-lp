'use client';

import { useActionState } from 'react';
import { retryOrderAction } from './actions';
import { emptyState } from './state';
import type { Order } from '@/lib/orders';
import styles from './admin.module.css';

const statusLabel: Record<Order['delivery']['status'], string> = {
  delivered: 'נשלח',
  failed: 'נכשל',
  skipped: 'לא נשלח',
};

const statusClass: Record<Order['delivery']['status'], string> = {
  delivered: styles.badgeDelivered,
  failed: styles.badgeFailed,
  skipped: styles.badgeSkipped,
};

function RetryButton({ id }: { id: string }) {
  const [state, formAction, pending] = useActionState(retryOrderAction, emptyState);

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <button className={styles.buttonGhost} type="submit" disabled={pending}>
        {pending ? '…' : 'שלח שוב'}
      </button>
      {state.status !== 'idle' ? (
        <span className={styles.hint}> {state.message}</span>
      ) : null}
    </form>
  );
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p className={styles.empty}>עדיין אין הזמנות.</p>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>תאריך</th>
            <th>שם</th>
            <th>טלפון</th>
            <th>כתובת</th>
            <th>כמות</th>
            <th>שליחה</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{new Date(order.createdAt).toLocaleString('he-IL')}</td>
              <td>{order.name}</td>
              <td dir="ltr" style={{ textAlign: 'right' }}>
                {order.phone}
              </td>
              <td>{order.address || '—'}</td>
              <td>{order.qty}</td>
              <td title={order.delivery.detail}>
                <span className={statusClass[order.delivery.status]}>
                  {statusLabel[order.delivery.status]}
                </span>
              </td>
              <td>
                {order.delivery.status === 'delivered' ? null : (
                  <RetryButton id={order.id} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
