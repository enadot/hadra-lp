import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isAuthenticated, isAdminConfigured } from '@/lib/auth';
import { LoginForm } from './LoginForm';
import styles from '../admin.module.css';

export const metadata: Metadata = {
  title: 'כניסה — לוח בקרה',
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await isAuthenticated()) redirect('/admin');

  return (
    <main className={styles.loginShell} dir="rtl">
      <div className={styles.loginCard}>
        <h1 className={styles.brand}>לוח בקרה — הדרא</h1>
        {isAdminConfigured() ? (
          <LoginForm />
        ) : (
          <p className={styles.noticeBad}>
            לא הוגדרה סיסמת מנהל. הגדירו את משתנה הסביבה ADMIN_PASSWORD ב-Vercel
            (Settings → Environment Variables) ופרסו מחדש.
          </p>
        )}
      </div>
    </main>
  );
}
