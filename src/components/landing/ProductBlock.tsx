import Image from 'next/image';
import type { Campaign } from '@/content/campaigns';
import styles from './ProductBlock.module.css';

export function ProductBlock({ product }: { product: Campaign['product'] }) {
  return (
    <section className={styles.product}>
      <Image
        className={styles.book}
        src={product.image.src}
        alt={product.image.alt}
        width={product.image.width}
        height={product.image.height}
        sizes="(max-width: 620px) 70vw, 380px"
        priority
        data-animate="book"
      />

      <div className={styles.panel}>
        <p className={styles.lede} data-animate="lede">
          {product.lede}
        </p>

        <ul className={styles.benefits}>
          {product.benefits.map((benefit) => (
            <li key={benefit} className={styles.benefit} data-animate="benefit">
              <span className={styles.tick} aria-hidden="true">
                ✓
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <p className={styles.price} data-animate="price">
          <span className={styles.priceLabel}>{product.price.label}</span>
          <span className={styles.priceAmount}>{product.price.amount}</span>
        </p>

        <a className={styles.cta} href={product.cta.href} data-animate="cta">
          {product.cta.label}
        </a>
      </div>
    </section>
  );
}
