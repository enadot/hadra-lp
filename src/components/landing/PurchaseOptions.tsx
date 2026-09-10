'use client';

import { useEffect, useState } from 'react';
import type { Campaign } from '@/content/campaigns';
import { readTracking, type Tracking } from '@/lib/tracking';
import styles from './PurchaseOptions.module.css';

type Purchase = NonNullable<Campaign['purchase']>;

/**
 * Build the shop link with this page's UTM tags. If the visitor arrived from
 * an ad (their own utm_source / utm_campaign), that origin is carried in
 * utm_content so the shop's analytics can still see which ad drove the sale.
 */
export function buildShopUrl(online: Purchase['online'], visitor: Tracking = {}): string {
  const url = new URL(online.url);
  url.searchParams.set('utm_source', online.utm.source);
  url.searchParams.set('utm_medium', online.utm.medium);
  url.searchParams.set('utm_campaign', online.utm.campaign);

  const origin = [visitor.utm_source, visitor.utm_campaign].filter(Boolean).join('_');
  if (origin) url.searchParams.set('utm_content', origin);

  return url.toString();
}

const encode = (q: string) => encodeURIComponent(q);

function TruckIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
      <path d="M4 12v9h16v-9" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

export function PurchaseOptions({ purchase }: { purchase: Purchase }) {
  // Server-rendered href carries our UTMs; after mount we add the visitor's origin.
  const [shopUrl, setShopUrl] = useState(() => buildShopUrl(purchase.online));

  useEffect(() => {
    setShopUrl(buildShopUrl(purchase.online, readTracking()));
  }, [purchase.online]);

  const { pickup } = purchase;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encode(pickup.mapsQuery)}`;
  const wazeUrl = `https://waze.com/ul?q=${encode(pickup.mapsQuery)}&navigate=yes`;

  return (
    <section className={styles.order} id="order">
      <div className={styles.card} data-animate="order-card">
        <div className={styles.head}>
          <h2 className={styles.title}>{purchase.title}</h2>
          <p className={styles.subtitle}>{purchase.subtitle}</p>
        </div>

        <div className={styles.options}>
          <a className={styles.online} href={shopUrl} target="_blank" rel="noopener">
            <TruckIcon />
            <span>{purchase.online.label} ›</span>
          </a>

          <div className={styles.pickupDetails}>
            <a className={styles.pickup} href={mapsUrl} target="_blank" rel="noopener">
              <StoreIcon />
              <span>{pickup.label}</span>
            </a>
            <p className={styles.address}>
              <strong>{pickup.address}</strong> · {pickup.note}
            </p>
            <div className={styles.navLinks}>
              <a className={styles.navLink} href={wazeUrl} target="_blank" rel="noopener">
                ניווט ב-Waze
              </a>
              <a className={styles.navLink} href={mapsUrl} target="_blank" rel="noopener">
                Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
