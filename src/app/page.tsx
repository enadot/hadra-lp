import { redirect } from 'next/navigation';
import { primaryCampaign } from '@/content/campaigns';

/** The domain root points at whichever campaign is currently running. */
export default function Home() {
  redirect(`/${primaryCampaign.slug}`);
}
