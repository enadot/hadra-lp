import type { Metadata } from 'next';
import Link from 'next/link';
import { campaigns } from '@/content/campaigns';
import { getWebhookSettings } from '@/lib/settings';
import { listOrders } from '@/lib/orders';
import { getStore } from '@/lib/store';
import { WebhookPanel } from './WebhookPanel';
import { OrdersTable } from './OrdersTable';
import { logoutAction } from './actions';
import styles from './admin.module.css';

export const metadata: Metadata = {
  title: 'לוח בקרה — הדרא',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const store = getStore();

  const data = await Promise.all(
    campaigns.map(async (campaign) => ({
      campaign,
      settings: await getWebhookSettings(campaign.slug),
      orders: await listOrders(campaign.slug, 50),
    })),
  );

  return (
    <main className={styles.shell} dir="rtl">
      <div className={styles.inner}>
        <div className={styles.topbar}>
          <h1 className={styles.brand}>לוח בקרה — הדרא</h1>
          <form action={logoutAction}>
            <button className={styles.buttonGhost} type="submit">
              יציאה
            </button>
          </form>
        </div>

        {!store.persistent ? (
          <p className={styles.noticeWarn}>
            אחסון זמני בלבד — ההגדרות וההזמנות יימחקו בפריסה הבאה. חברו Upstash
            Redis ב-Vercel (Storage → Marketplace) כדי לשמור אותם באמת.
          </p>
        ) : null}

        {data.map(({ campaign, settings, orders }) => (
          <section key={campaign.slug} className={styles.panel}>
            <div className={styles.topbar}>
              <h2 className={styles.panelTitle}>{campaign.hero.title}</h2>
              <Link className={styles.hint} href={`/${campaign.slug}`} target="_blank">
                צפייה בדף ↗
              </Link>
            </div>

            <WebhookPanel
              slug={campaign.slug}
              campaignTitle={campaign.hero.title}
              settings={settings}
            />

            <section className={styles.panel}>
              <h2 className={styles.panelTitle}>
                הזמנות אחרונות ({orders.length})
              </h2>
              <OrdersTable orders={orders} />
            </section>
          </section>
        ))}
      </div>
    </main>
  );
}
