import Image from 'next/image';
import styles from './SiteFooter.module.css';

export function SiteFooter({ text }: { text: string }) {
  return (
    <footer className={styles.footer}>
      <Image
        className={styles.logo}
        src="/brand/hadra-logo-white.png"
        alt="הדרא"
        width={1266}
        height={473}
      />
      <span className={styles.text}>{text}</span>
    </footer>
  );
}
