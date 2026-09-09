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

  form: {
    title: 'להזמנת הספר',
    subtitle: 'מלאו פרטים ונחזור אליכם להשלמת ההזמנה · 45 ש"ח בלבד',
    consentLabel: 'אני מסכים שיצרו איתי קשר מטעם "הדרא" לבירור והמשך הזמנה',
    submitLabel: 'אני רוצה את הספר »',
    successTitle: 'ההזמנה התקבלה!',
    successText: 'תודה {name}, נציג יחזור אליכם בהקדם להשלמת ההזמנה.',
    quantities: [
      { value: '1', label: 'כמות: 1 ספר' },
      { value: '2', label: 'כמות: 2 ספרים' },
      { value: '3', label: 'כמות: 3 ספרים' },
      { value: '4', label: 'כמות: 4 ספרים' },
      { value: '5', label: 'כמות: 5 ומעלה' },
    ],
  },

  footer: { text: 'הוצאה לאור והפצה: הדרא — הרבה יותר מהוצאה לאור' },
};
