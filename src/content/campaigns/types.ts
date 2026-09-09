/**
 * A campaign is one landing page's content. Adding a landing page for הדרא
 * means adding a config here plus a route that composes the shared blocks in
 * `src/components/landing`.
 */
export type Campaign = {
  /** URL slug and storage key. Must be unique. */
  slug: string;
  /** Browser tab / OG title. */
  metaTitle: string;
  metaDescription: string;

  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };

  product: {
    image: { src: string; alt: string; width: number; height: number };
    lede: string;
    benefits: string[];
    price: { label: string; amount: string };
    cta: { label: string; href: string };
  };

  /** Full-bleed background behind the whole page. */
  background: { src: string; width: number; height: number };

  form: {
    title: string;
    subtitle: string;
    consentLabel: string;
    submitLabel: string;
    successTitle: string;
    /** `{name}` is replaced with the buyer's name. */
    successText: string;
    quantities: { value: string; label: string }[];
  };

  footer: { text: string };
};
