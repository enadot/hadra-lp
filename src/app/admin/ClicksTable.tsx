import { clickButtonLabels, CLICK_BUTTONS, type ClickEvent } from '@/lib/events';
import styles from './admin.module.css';

const statusLabel: Record<ClickEvent['delivery']['status'], string> = {
  delivered: 'נשלח',
  failed: 'נכשל',
  skipped: 'לא נשלח',
};

const statusClass: Record<ClickEvent['delivery']['status'], string> = {
  delivered: styles.badgeDelivered,
  failed: styles.badgeFailed,
  skipped: styles.badgeSkipped,
};

function source(t: ClickEvent['tracking']): string {
  const parts = [t?.utm_source, t?.utm_medium, t?.utm_campaign].filter(Boolean);
  return parts.length ? parts.join(' / ') : '—';
}

export function ClicksTable({ events }: { events: ClickEvent[] }) {
  if (events.length === 0) {
    return <p className={styles.empty}>עדיין אין קליקים.</p>;
  }

  const counts = CLICK_BUTTONS.map((button) => ({
    button,
    count: events.filter((e) => e.button === button).length,
  }));

  return (
    <>
      <p className={styles.hint}>
        {counts.map(({ button, count }) => `${clickButtonLabels[button]}: ${count}`).join(' · ')}
        {' '}(מתוך {events.length} האחרונים)
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>תאריך</th>
              <th>כפתור</th>
              <th>מקור</th>
              <th>שליחה</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>{new Date(event.createdAt).toLocaleString('he-IL')}</td>
                <td title={event.href}>{clickButtonLabels[event.button]}</td>
                <td>{source(event.tracking)}</td>
                <td title={event.delivery.detail}>
                  <span className={statusClass[event.delivery.status]}>
                    {statusLabel[event.delivery.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
