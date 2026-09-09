import Link from 'next/link';
import { primaryCampaign } from '@/content/campaigns';

export default function NotFound() {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, margin: 0 }}>
        הדף לא נמצא
      </h1>
      <Link href={`/${primaryCampaign.slug}`}>חזרה לדף הבית</Link>
    </main>
  );
}
