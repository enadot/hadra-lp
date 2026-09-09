import type { Campaign } from '@/content/campaigns';
import styles from './Hero.module.css';

export function Hero({ hero }: { hero: Campaign['hero'] }) {
  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow} data-animate="hero-eyebrow">
        {hero.eyebrow}
      </p>
      <h1 className={styles.title} data-animate="hero-title">
        {hero.title}
      </h1>
      <p className={styles.subtitle} data-animate="hero-subtitle">
        {hero.subtitle}
      </p>
    </section>
  );
}
