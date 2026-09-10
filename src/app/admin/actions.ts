'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { isAuthenticated, signIn, signOut } from '@/lib/auth';
import { saveWebhookSettings, getWebhookSettings } from '@/lib/settings';
import { retryOrder } from '@/lib/orders';
import { webhookSettingsSchema } from '@/lib/validation';
import { getCampaign } from '@/content/campaigns';
import type { ActionState } from './state';
import { trackingToPayload } from '@/lib/tracking';
import { getStore } from '@/lib/store';
import { postToWebhook } from '@/lib/webhook';

async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) redirect('/admin/login');
}

/* --- login / logout -------------------------------------------------------- */

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get('password') ?? '');
  if (!password) {
    return { status: 'error', message: 'נא להזין סיסמה' };
  }
  if (!(await signIn(password))) {
    return { status: 'error', message: 'סיסמה שגויה' };
  }
  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  await signOut();
  redirect('/admin/login');
}

/* --- webhook settings ------------------------------------------------------ */

export async function saveWebhookAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const slug = String(formData.get('campaign') ?? '');
  if (!getCampaign(slug)) {
    return { status: 'error', message: 'קמפיין לא מוכר' };
  }

  const parsed = webhookSettingsSchema.safeParse({
    url: String(formData.get('url') ?? ''),
    enabled: formData.get('enabled') === 'on',
    token: String(formData.get('token') ?? ''),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'נתונים לא תקינים',
    };
  }

  if (parsed.data.enabled && !parsed.data.url) {
    return {
      status: 'error',
      message: 'כדי להפעיל שליחה צריך למלא כתובת וובהוק',
    };
  }

  await saveWebhookSettings(slug, parsed.data);
  revalidatePath('/admin');

  const store = getStore();
  if (!store.persistent && process.env.VERCEL) {
    return {
      status: 'error',
      message:
        'נשמר באחסון זמני בלבד — Redis לא מחובר, וההגדרה תיעלם. ראו את הדיאגנוסטיקה למעלה.',
    };
  }
  return { status: 'ok', message: 'ההגדרות נשמרו' };
}

/** Fire a sample payload at the saved webhook so you can verify it end to end. */
export async function testWebhookAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const slug = String(formData.get('campaign') ?? '');
  if (!getCampaign(slug)) {
    return { status: 'error', message: 'קמפיין לא מוכר' };
  }

  const settings = await getWebhookSettings(slug);
  if (!settings.url) {
    return { status: 'error', message: 'לא הוגדרה כתובת וובהוק. שמרו כתובת ואז בדקו.' };
  }
  if (!settings.enabled) {
    return { status: 'error', message: 'השליחה כבויה — סמנו "שליחה פעילה" ושמרו לפני הבדיקה.' };
  }

  const delivery = await postToWebhook(slug, {
    type: 'test',
    id: 'test',
    campaign: slug,
    name: 'בדיקה מלוח הבקרה',
    phone: '050-0000000',
    address: 'כתובת לדוגמה',
    qty: '1',
    consent: true,
    button: 'online',
    buttonLabel: 'רכישה מקוונת',
    href: 'https://example.com/',
    createdAt: new Date().toISOString(),
    ...trackingToPayload({
      utm_source: 'test',
      utm_medium: 'admin',
      utm_campaign: slug,
      landing_url: `/${slug}?utm_source=test&utm_medium=admin`,
    }),
    test: true,
  });

  return delivery.status === 'delivered'
    ? { status: 'ok', message: `הוובהוק ענה ${delivery.httpStatus} — הבדיקה עברה` }
    : { status: 'error', message: delivery.detail };
}

/* --- orders ---------------------------------------------------------------- */

export async function retryOrderAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '');
  const order = await retryOrder(id);
  if (!order) {
    return { status: 'error', message: 'ההזמנה לא נמצאה' };
  }

  revalidatePath('/admin');
  return order.delivery.status === 'delivered'
    ? { status: 'ok', message: 'ההזמנה נשלחה מחדש בהצלחה' }
    : { status: 'error', message: order.delivery.detail };
}
