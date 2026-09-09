import Image from 'next/image';
import type { Campaign } from '@/content/campaigns';
import { LandingMotion } from './LandingMotion';
import { Masthead } from './Masthead';
import { Hero } from './Hero';
import { ProductBlock } from './ProductBlock';
import { OrderForm } from './OrderForm';
import { SiteFooter } from './SiteFooter';
import styles from './LandingShell.module.css';

/**
 * The approved layout for הדרא campaigns: background, masthead, hero, product
 * block, order form, footer. A new landing page can reuse this shell, or
 * compose the same blocks in a different order for a different design.
 */
export function LandingShell({ campaign }: { campaign: Campaign }) {
  return (
    <LandingMotion>
      <div className={styles.page} dir="rtl">
        <Image
          className={styles.background}
          src={campaign.background.src}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.scrim} aria-hidden="true" />

        <Masthead />
        <Hero hero={campaign.hero} />
        <ProductBlock product={campaign.product} />
        <OrderForm campaign={campaign.slug} form={campaign.form} />
        <SiteFooter text={campaign.footer.text} />
      </div>
    </LandingMotion>
  );
}
