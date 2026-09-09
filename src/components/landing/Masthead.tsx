import Image from 'next/image';
import styles from './LandingShell.module.css';

export function Masthead() {
  return (
    <header className={styles.masthead} data-animate="masthead">
      <Image
        className={styles.logo}
        src="/brand/hadra-logo-white.png"
        alt="הדרא — הרבה יותר מהוצאה לאור"
        width={1266}
        height={473}
        priority
      />
    </header>
  );
}
