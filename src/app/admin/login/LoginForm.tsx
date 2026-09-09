'use client';

import { useActionState } from 'react';
import { loginAction } from '../actions';
import { emptyState } from '../state';
import styles from '../admin.module.css';

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, emptyState);

  return (
    <form action={formAction} className={styles.panel} style={{ border: 'none', padding: 0, background: 'transparent' }}>
      <label className={styles.label}>
        סיסמה
        <input
          className={styles.input}
          type="password"
          name="password"
          autoComplete="current-password"
          autoFocus
        />
      </label>

      {state.status === 'error' ? (
        <p className={styles.noticeBad}>{state.message}</p>
      ) : null}

      <button className={styles.button} type="submit" disabled={pending}>
        {pending ? 'מתחבר…' : 'כניסה'}
      </button>
    </form>
  );
}
