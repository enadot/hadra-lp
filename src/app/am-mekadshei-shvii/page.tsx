import type { Metadata } from 'next';
import { LandingShell } from '@/components/landing';
import { amMekadsheiShvii } from '@/content/campaigns/am-mekadshei-shvii';

const campaign = amMekadsheiShvii;

export const metadata: Metadata = {
  title: campaign.metaTitle,
  description: campaign.metaDescription,
  alternates: { canonical: `/${campaign.slug}` },
  openGraph: {
    type: 'website',
    locale: 'he_IL',
    title: campaign.metaTitle,
    description: campaign.metaDescription,
    images: [campaign.product.image.src],
  },
};

export default function AmMekadsheiShviiPage() {
  return <LandingShell campaign={campaign} />;
}
