import type { Campaign } from './types';
import { amMekadsheiShvii } from './am-mekadshei-shvii';

/** Every campaign in the site. Add new landing pages here. */
export const campaigns: Campaign[] = [amMekadsheiShvii];

/** The campaign `/` redirects to. */
export const primaryCampaign = amMekadsheiShvii;

export function getCampaign(slug: string): Campaign | undefined {
  return campaigns.find((c) => c.slug === slug);
}

export type { Campaign };
