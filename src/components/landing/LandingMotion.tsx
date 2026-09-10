'use client';

import { useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * All landing-page motion lives here, keyed off `data-animate` attributes so
 * the content blocks themselves stay server components.
 *
 * Everything is wrapped in gsap.matchMedia(): visitors who ask for reduced
 * motion get the page with no animation at all, fully visible.
 */
export function LandingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          animate: '(prefers-reduced-motion: no-preference)',
          reduce: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { animate } = context.conditions as { animate: boolean };

          // CSS hides [data-animate] until JS is ready; hand control to GSAP
          // *before* building any .from() tween, so 1 is the resting value.
          gsap.set('[data-animate]', { opacity: 1 });
          if (!animate) return;

          /* --- entrance: masthead → hero → book + lede ------------------- */
          const intro = gsap.timeline({
            defaults: { ease: 'power3.out', duration: 0.8 },
          });

          intro
            .from('[data-animate="masthead"]', { opacity: 0, y: -14, duration: 0.6 })
            .from(
              [
                '[data-animate="hero-eyebrow"]',
                '[data-animate="hero-title"]',
                '[data-animate="hero-subtitle"]',
              ],
              { opacity: 0, y: 28, stagger: 0.12 },
              '-=0.25',
            )
            .from(
              '[data-animate="book"]',
              { opacity: 0, y: 44, scale: 0.94, duration: 1 },
              '-=0.5',
            )
            .from('[data-animate="lede"]', { opacity: 0, y: 20 }, '-=0.7');

          /* --- the book breathes, very slightly, once it has landed ----- */
          intro.eventCallback('onComplete', () => {
            const book = root.current?.querySelector('[data-animate="book"]');
            if (!book) return;
            gsap.to(book, {
              y: -10,
              duration: 3.2,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            });
          });

          /* --- benefits tick in from the right (RTL) -------------------- */
          gsap.from('[data-animate="benefit"]', {
            opacity: 0,
            x: 26,
            duration: 0.55,
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: '[data-animate="benefit"]',
              start: 'top 88%',
              once: true,
            },
          });

          /* --- price pops ----------------------------------------------- */
          gsap.from('[data-animate="price"]', {
            opacity: 0,
            scale: 0.9,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: '[data-animate="price"]',
              start: 'top 90%',
              once: true,
            },
          });

          /* --- CTA keeps a slow gold glow ------------------------------- */
          const cta = root.current?.querySelector('[data-animate="cta"]');
          if (cta) {
            gsap.to(cta, {
              boxShadow: '0 12px 34px rgba(243, 201, 107, 0.55)',
              duration: 1.8,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
              delay: 2.4,
            });
          }

          /* --- order card rises into view ------------------------------- */
          gsap.from('[data-animate="order-card"]', {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: '[data-animate="order-card"]',
              start: 'top 88%',
              once: true,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
