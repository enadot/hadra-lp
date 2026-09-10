import type { Campaign } from './types';

export const amMekadsheiShvii: Campaign = {
  slug: 'am-mekadshei-shvii',
  metaTitle: 'עם מקדשי שביעי — הלכות שבת בשפה ברורה ואקטואלית',
  metaDescription:
    'חדש! בהסכמת גדולי הפוסקים — ספר הלכות שבת בשפה ברורה ואקטואלית לכל המשפחה. מחיר מסובסד 45 ש"ח. להזמנה מהירה.',

  hero: {
    eyebrow: 'חדש! בהסכמת גדולי הפוסקים',
    title: 'עם מקדשי שביעי',
    subtitle: 'הלכות שבת בשפה ברורה ואקטואלית',
  },

  product: {
    image: {
      src: '/campaigns/am-mekadshei-shvii/book.webp',
      alt: 'הספר עם מקדשי שביעי',
      width: 1672,
      height: 2424,
    },
    lede: 'שפה קלה ונוחה לכל המשפחה ולכל גיל. מתאים לעיון תלמידי חכמים ואנשי הלכה, ולהוראה למעשה לכל יהודי. הביאו ברכה אל ביתכם לכבוד שבת המלכה!',
    benefits: [
      'הלכה למעשה',
      'אקטואלי לכל המשפחה',
      'אידיאלי לסעודות השבת',
      'ללימוד עם בני המשפחה',
    ],
    price: { label: 'מחיר מסובסד:', amount: '45 ש"ח' },
    cta: { label: 'להזמנה מהירה ›', href: '#order' },
  },

  background: {
    src: '/campaigns/am-mekadshei-shvii/bg.webp',
    width: 4368,
    height: 2912,
  },

  purchase: {
    title: 'להזמנת הספר',
    subtitle: 'בחרו את הדרך הנוחה לכם · 45 ש"ח בלבד',
    online: {
      label: 'לרכישה מקוונת ומשלוח עד הבית',
      url: 'https://www.hbooks.co.il/product/%D7%A2%D7%9D-%D7%9E%D7%A7%D7%93%D7%A9%D7%99-%D7%A9%D7%91%D7%99%D7%A2%D7%99--%D7%94%D7%9C%D7%9B%D7%95%D7%AA-%D7%A9%D7%91%D7%AA-%D7%91%D7%A9%D7%A4%D7%94-%D7%91%D7%A8%D7%95%D7%A8%D7%94-%D7%95%D7%90%D7%A7%D7%98%D7%95%D7%90%D7%9C%D7%99%D7%AA--%D7%94%D7%A8%D7%94%D7%92-%D7%9E%D7%A0%D7%97%D7%9D-%D7%90%D7%A7%D7%A8%D7%9E%D7%9F-%D7%A9%D7%9C%D7%99%D7%98%D7%90',
      utm: { source: 'hadra-lp', medium: 'landing-page', campaign: 'am-mekadshei-shvii' },
    },
    pickup: {
      label: 'איסוף עצמי מחנות ספרי חיים',
      storeName: 'ספרי חיים',
      address: 'כנפי נשרים 26, ירושלים',
      note: 'בחניה של רמי לוי',
      mapsQuery: 'ספרי חיים, כנפי נשרים 26, ירושלים',
    },
  },

  footer: { text: 'הוצאה לאור והפצה: הדרא — הרבה יותר מהוצאה לאור' },
};
