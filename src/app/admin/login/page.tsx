import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isAuthenticated, missingAdminConfig } from '@/lib/auth';
import { LoginForm } from './LoginForm';
import styles from '../admin.module.css';

export const metadata: Metadata = {
  title: 'כניסה — לוח בקרה',
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAuthenticated()) redirect('/admin');
  const missing = missingAdminConfig();

  return (
    <main className={styles.loginShell} dir="rtl">
      <div className={styles.loginCard}>
        <h1 className={styles.brand}>לוח בקרה — הדרא</h1>
        {missing.length === 0 ? (
          <LoginForm />
        ) : (
          <p className={styles.noticeBad}>
            חסרות הגדרות: {missing.join(', ')}. הגדירו אותן ב-Vercel (Settings →
            Environment Variables) עם ערך לא ריק, ופרסו מחדש.
          </p>
        )}
      </div>
    </main>
  );
}
