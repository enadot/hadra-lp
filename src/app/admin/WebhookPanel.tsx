'use client';

import { useActionState } from 'react';
import { saveWebhookAction, testWebhookAction } from './actions';
import { emptyState, type ActionState } from './state';
import type { StoredWebhookSettings } from '@/lib/settings';
import styles from './admin.module.css';

type Props = {
  slug: string;
  campaignTitle: string;
  settings: StoredWebhookSettings;
  /** What this page sends: lead-form orders, or clicks on the purchase buttons. */
  mode: 'orders' | 'clicks';
};

function Notice({ state }: { state: ActionState }) {
  if (state.status === 'idle') return null;
  return (
    <p className={state.status === 'ok' ? styles.noticeOk : styles.noticeBad}>
      {state.message}
    </p>
  );
}

export function WebhookPanel({ slug, campaignTitle, settings, mode }: Props) {
  const [saveState, saveFormAction, saving] = useActionState(
    saveWebhookAction,
    emptyState,
  );
  const [testState, testFormAction, testing] = useActionState(
    testWebhookAction,
    emptyState,
  );

  return (
    <section className={styles.panel}>
      <h2 className={styles.panelTitle}>וובהוק — {campaignTitle}</h2>
      <p className={styles.hint}>
        {mode === 'orders'
          ? 'כל הזמנה נשמרת כאן ובמקביל נשלחת לכתובת שתגדירו (POST עם JSON, type: "order").'
          : 'כל קליק על כפתורי הרכישה נשמר כאן ובמקביל נשלח לכתובת שתגדירו (POST עם JSON, type: "click", עם שם הכפתור וה-UTM של המבקר).'}{' '}
        אפשר לשנות את הכתובת מתי שרוצים — אין צורך בפריסה מחדש.
      </p>

      <form action={saveFormAction} className={styles.panel} style={{ border: 'none', padding: 0, background: 'transparent' }}>
        <input type="hidden" name="campaign" value={slug} />

        <label className={styles.label}>
          כתובת הוובהוק (https)
          <input
            className={styles.input}
            type="url"
            name="url"
            placeholder="https://hooks.example.com/..."
            defaultValue={settings.url}
            dir="ltr"
          />
        </label>

        <label className={styles.label}>
          טוקן אבטחה (אופציונלי) — יישלח בכותרת X-Hadra-Token
          <input
            className={styles.input}
            type="text"
            name="token"
            defaultValue={settings.token}
            dir="ltr"
          />
        </label>

        <label className={styles.checkboxRow}>
          <input
            className={styles.checkbox}
            type="checkbox"
            name="enabled"
            defaultChecked={settings.enabled}
          />
          שליחה פעילה
        </label>

        <div className={styles.actions}>
          <button className={styles.button} type="submit" disabled={saving}>
            {saving ? 'שומר…' : 'שמירה'}
          </button>
        </div>

        <Notice state={saveState} />
      </form>

      <form action={testFormAction}>
        <input type="hidden" name="campaign" value={slug} />
        <div className={styles.actions}>
          <button className={styles.buttonGhost} type="submit" disabled={testing}>
            {testing ? 'שולח בדיקה…' : 'שליחת בדיקה לכתובת השמורה'}
          </button>
        </div>
        <Notice state={testState} />
      </form>

      {settings.updatedAt ? (
        <p className={styles.hint}>
          עודכן לאחרונה: {new Date(settings.updatedAt).toLocaleString('he-IL')}
        </p>
      ) : null}
    </section>
  );
}
