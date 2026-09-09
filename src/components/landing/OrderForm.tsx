'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Campaign } from '@/content/campaigns';
import { readTracking } from '@/lib/tracking';
import styles from './OrderForm.module.css';

type Props = {
  campaign: string;
  form: Campaign['form'];
};

export function OrderForm({ campaign, form }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [qty, setQty] = useState(form.quantities[0]?.value ?? '1');
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState(''); // honeypot
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const successRef = useRef<HTMLDivElement>(null);

  // Persist UTM params from the landing URL as soon as the page loads.
  useEffect(() => {
    readTracking();
  }, []);

  useGSAP(
    () => {
      if (!submittedName) return;
      gsap.from(successRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        ease: 'power2.out',
      });
    },
    { dependencies: [submittedName], scope: successRef },
  );

  const clearError = () => setError('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      setError('נא למלא שם וטלפון');
      return;
    }
    if (!consent) {
      setError('נא לאשר יצירת קשר');
      return;
    }

    setError('');
    setPending(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign,
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          qty,
          consent,
          company,
          tracking: readTracking(),
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setError(data?.error ?? 'אירעה תקלה בשליחה. נסו שוב או צרו קשר טלפונית.');
        return;
      }

      setSubmittedName(name.trim());
    } catch {
      setError('אירעה תקלה בשליחה. נסו שוב או צרו קשר טלפונית.');
    } finally {
      setPending(false);
    }
  }

  return (
    <section className={styles.order} id="order">
      <div className={styles.card} data-animate="form-card">
        {submittedName ? (
          <div className={styles.success} ref={successRef} tabIndex={-1}>
            <span className={styles.successTitle}>{form.successTitle}</span>
            <span className={styles.successText}>
              {form.successText.replace('{name}', submittedName)}
            </span>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.head}>
              <h2 className={styles.title}>{form.title}</h2>
              <p className={styles.subtitle}>{form.subtitle}</p>
            </div>

            <div className={styles.grid}>
              <input
                className={styles.field}
                type="text"
                name="name"
                placeholder="שם מלא"
                aria-label="שם מלא"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError();
                }}
              />
              <input
                className={`${styles.field} ${styles.tel}`}
                type="tel"
                name="phone"
                placeholder="טלפון"
                aria-label="טלפון"
                autoComplete="tel"
                inputMode="tel"
                dir="rtl"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  clearError();
                }}
              />
              <input
                className={styles.field}
                type="text"
                name="address"
                placeholder="כתובת למשלוח"
                aria-label="כתובת למשלוח"
                autoComplete="street-address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  clearError();
                }}
              />
              <select
                className={styles.field}
                name="qty"
                aria-label="כמות"
                value={qty}
                onChange={(e) => {
                  setQty(e.target.value);
                  clearError();
                }}
              >
                {form.quantities.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* honeypot — hidden from people, tempting to bots */}
            <div className={styles.honeypot} aria-hidden="true">
              <label htmlFor="company">אל תמלאו שדה זה</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <label className={styles.consent}>
              <input
                className={styles.checkbox}
                type="checkbox"
                name="consent"
                checked={consent}
                onChange={(e) => {
                  setConsent(e.target.checked);
                  clearError();
                }}
              />
              <span>{form.consentLabel}</span>
            </label>

            {error ? (
              <p className={styles.error} role="alert">
                {error}
              </p>
            ) : null}

            <button className={styles.submit} type="submit" disabled={pending}>
              {pending ? 'שולח…' : form.submitLabel}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
