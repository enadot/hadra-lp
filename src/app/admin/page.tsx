import type { Metadata } from 'next';
import Link from 'next/link';
import { campaigns } from '@/content/campaigns';
import { getWebhookSettings } from '@/lib/settings';
import { listOrders } from '@/lib/orders';
import { listClickEvents } from '@/lib/events';
import { ClicksTable } from './ClicksTable';
import { getStore } from '@/lib/store';
import { storageEnvNames } from '@/lib/redis-env';
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

  let data: Array<{
    campaign: (typeof campaigns)[number];
    settings: Awaited<ReturnType<typeof getWebhookSettings>>;
    orders: Awaited<ReturnType<typeof listOrders>>;
    clicks: Awaited<ReturnType<typeof listClickEvents>>;
  }> = [];
  let storageError: string | null = null;

  try {
    data = await Promise.all(
      campaigns.map(async (campaign) => ({
        campaign,
        settings: await getWebhookSettings(campaign.slug),
        orders: campaign.form ? await listOrders(campaign.slug, 50) : [],
        clicks: campaign.purchase ? await listClickEvents(campaign.slug, 100) : [],
      })),
    );
  } catch (error) {
    storageError = error instanceof Error ? error.message : String(error);
  }

  const envNames = storageEnvNames();

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

        {store.persistent ? (
          <p className={styles.hint}>
            אחסון: Redis (חובר דרך <code>{store.source}</code>)
          </p>
        ) : (
          <p className={styles.noticeWarn}>
            אחסון זמני בלבד — ההגדרות וההזמנות לא יישמרו. לא נמצאו פרטי חיבור
            ל-Redis (מחפשים <code>KV_REST_API_URL</code> +{' '}
            <code>KV_REST_API_TOKEN</code>, <code>UPSTASH_REDIS_REST_URL</code> +{' '}
            <code>UPSTASH_REDIS_REST_TOKEN</code>, או כל prefix שמסתיים ב-
            <code>_REST_API_URL</code>/<code>_TOKEN</code>).
            {envNames.length > 0 ? (
              <>
                {' '}
                משתנים שקיימים כרגע: {envNames.join(', ')}.
              </>
            ) : (
              <> לא נמצא אף משתנה עם REDIS / UPSTASH / KV_ בשם.</>
            )}{' '}
            אחרי חיבור או שינוי משתנים ב-Vercel צריך לפרוס מחדש (Redeploy).
          </p>
        )}

        {storageError ? (
          <p className={styles.noticeBad}>
            שגיאה בחיבור לאחסון ({store.source}): {storageError}
          </p>
        ) : null}

        {data.map(({ campaign, settings, orders, clicks }) => (
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
              mode={campaign.form ? 'orders' : 'clicks'}
            />

            {campaign.form ? (
              <section className={styles.panel}>
                <h2 className={styles.panelTitle}>הזמנות אחרונות ({orders.length})</h2>
                <OrdersTable orders={orders} />
              </section>
            ) : null}

            {campaign.purchase ? (
              <section className={styles.panel}>
                <h2 className={styles.panelTitle}>קליקים על כפתורי הרכישה</h2>
                <p className={styles.hint}>
                  קישור הרכישה נשלח עם UTM:{' '}
                  <code>
                    {campaign.purchase.online.utm.source} / {campaign.purchase.online.utm.medium} /{' '}
                    {campaign.purchase.online.utm.campaign}
                  </code>
                </p>
                <ClicksTable events={clicks} />
              </section>
            ) : null}
          </section>
        ))}
      </div>
    </main>
  );
}
