# הדרא — דפי נחיתה

אתר דפי הנחיתה של הוצאת **הדרא**, בנוי ב-Next.js ומיועד לפריסה ב-Vercel.
הדף הראשון הוא **עם מקדשי שביעי** (גרסה C מהעיצוב המאושר), עם אנימציות GSAP.
בלוק ההזמנה של הדף מפנה לרכישה בחנות המקוונת (עם UTM) ולאיסוף עצמי.
ערכת הבלוקים כוללת גם טופס לידים שנשלח לוובהוק המוגדר מלוח בקרה — לדפים הבאים.

## הרצה מקומית

```bash
npm install
npm run dev
```

- דף הנחיתה: http://localhost:3000/am-mekadshei-shvii (הכתובת `/` מפנה אליו)
- לוח בקרה: http://localhost:3000/admin — סיסמת ברירת מחדל בפיתוח: `hadra`

בפיתוח, ההגדרות וההזמנות נשמרות בקובץ `.data/store.json` (לא נכנס לגיט).

## סקריפטים

| פקודה | מה היא עושה |
| --- | --- |
| `npm run dev` | שרת פיתוח |
| `npm run build` | בילד לפרודקשן |
| `npm run start` | הרצת הבילד |
| `npm run lint` | ESLint |
| `npm run typecheck` | בדיקת טיפוסים |

## מבנה הפרויקט

```
src/
  app/
    page.tsx                      הפניה לקמפיין הפעיל
    am-mekadshei-shvii/page.tsx   דף הנחיתה
    api/orders/route.ts           קליטת הזמנות + שליחה לוובהוק
    admin/                        לוח הבקרה (מוגן בסיסמה)
  components/landing/             ספריית הבלוקים המשותפת
  content/campaigns/              התוכן של כל דף נחיתה
  fonts/                          FB Livorna + FB Metropolitana
  lib/                            אחסון, הגדרות, הזמנות, אימות
  app/globals.css                 טוקנים של המותג (צבעים, טיפוגרפיה)
design/                           חומרי העיצוב המקוריים (Claude Design)
```

## הוספת דף נחיתה חדש

1. הוסיפו קובץ תוכן ב-`src/content/campaigns/<slug>.ts` לפי הטיפוס `Campaign`.
2. רשמו אותו במערך `campaigns` ב-`src/content/campaigns/index.ts`.
3. הוסיפו תמונות ב-`public/campaigns/<slug>/`.
4. צרו `src/app/<slug>/page.tsx` שמרנדר `<LandingShell campaign={...} />`,
   או שמרכיב את הבלוקים מ-`src/components/landing` בסדר אחר אם העיצוב שונה.

בלוק ההזמנה נקבע לפי התוכן: `purchase` = כפתורים לחנות חיצונית + איסוף עצמי
(`PurchaseOptions`), `form` = טופס לידים לוובהוק (`OrderForm`).

### קישור הרכישה החיצוני

`purchase.online.url` נשלח עם ה-UTM מ-`purchase.online.utm`
(`utm_source` / `utm_medium` / `utm_campaign`). אם המבקר הגיע מפרסום עם UTM משלו,
המקור שלו מצורף כ-`utm_content` (למשל `facebook_shabbat-launch`), כך שהאנליטיקס
של החנות רואה גם את הדף וגם את המודעה שהובילה למכירה.

הדף החדש יופיע אוטומטית בלוח הבקרה עם הגדרות וובהוק והזמנות משלו.

## לוח הבקרה — `/admin`

לכל דף יש וובהוק משלו. דף עם טופס (`form`) שולח הזמנות; דף עם כפתורי רכישה (`purchase`) שולח קליקים.

- **כתובת וובהוק** לכל קמפיין, עם מתג הפעלה וטוקן אבטחה אופציונלי.
  הכתובת נשמרת באחסון, לא במשתני סביבה — אפשר לשנות אותה בכל רגע.
- **שליחת בדיקה** לכתובת השמורה, עם הצגת התשובה.
- **הזמנות אחרונות** (עד 200) עם סטטוס שליחה וכפתור שליחה חוזרת — לדפים עם טופס.
- **קליקים על כפתורי הרכישה** (עד 500) עם ספירה לכל כפתור והמקור (UTM) של כל קליק — לדפים עם `purchase`.

כל הזמנה נשמרת גם אם הוובהוק נכשל, כך שאף ליד לא הולך לאיבוד — והמזמין
תמיד רואה אישור.

### מבנה ה-JSON שנשלח לוובהוק

כל הודעה נושאת שדה `type` — `order` (טופס), `click` (כפתור רכישה) או `test`
(בדיקה מלוח הבקרה) — כדי שאפשר יהיה להסתעף ב-Make/n8n.

**הזמנה מטופס** (`type: "order"`):

```json
{
  "type": "order",
  "id": "mtu9ghi4-11fu8v",
  "campaign": "am-mekadshei-shvii",
  "name": "ישראל ישראלי",
  "phone": "050-1234567",
  "address": "רחוב הרב קוק 5, ירושלים",
  "qty": "2",
  "consent": true,
  "createdAt": "2026-09-09T15:36:08.860Z",
  "utm_source": "facebook",
  "utm_medium": "cpc",
  "utm_campaign": "shabbat-launch",
  "utm_term": "",
  "utm_content": "",
  "fbclid": "IwAR...",
  "gclid": "",
  "landing_url": "https://example.com/am-mekadshei-shvii?utm_source=facebook&utm_medium=cpc",
  "referrer": "https://l.facebook.com/"
}
```

**קליק על כפתור רכישה** (`type: "click"`) — `button` הוא `online` (רכישה מקוונת),
`pickup` (איסוף עצמי), `waze` או `maps`; `href` הוא הקישור שנפתח, כולל ה-UTM:

```json
{
  "type": "click",
  "id": "mtuk1x2y-ab12cd",
  "campaign": "am-mekadshei-shvii",
  "button": "online",
  "buttonLabel": "רכישה מקוונת",
  "href": "https://www.hbooks.co.il/product/...?utm_source=hadra-lp&utm_medium=landing-page&utm_campaign=am-mekadshei-shvii&utm_content=facebook_shabbat-launch",
  "createdAt": "2026-09-10T08:12:44.120Z",
  "utm_source": "facebook",
  "utm_medium": "cpc",
  "utm_campaign": "shabbat-launch",
  "utm_term": "",
  "utm_content": "",
  "fbclid": "IwAR...",
  "gclid": "",
  "landing_url": "https://example.com/am-mekadshei-shvii?utm_source=facebook&utm_medium=cpc",
  "referrer": "https://l.facebook.com/"
}
```

הקליק נשלח מהדפדפן עם `navigator.sendBeacon`, כך שהוא לא מעכב את פתיחת החנות
ונרשם גם אם המבקר עזב מיד.

פרמטרי ה-UTM ומזהי הקליק (`fbclid`, `gclid`) נקלטים מכתובת הדף בכניסה הראשונה
ונשמרים ל-session, כך שהם מגיעים גם אם המבקר רענן את הדף לפני ששלח את הטופס.
שדה שלא היה בכתובת נשלח כמחרוזת ריקה — כדי שהעמודות ב-Sheets/Make יישארו קבועות.

נשלח כ-`POST` עם `Content-Type: application/json`. אם הוגדר טוקן, הוא נשלח
בכותרת `X-Hadra-Token`. שליחת בדיקה מלוח הבקרה מוסיפה `"test": true`.

## פריסה ב-Vercel

1. חברו את הריפו ב-Vercel (Next.js מזוהה אוטומטית, בלי הגדרות מיוחדות).
2. **אחסון:** Storage → Marketplace → Upstash Redis. החיבור מזריק אוטומטית את
   `UPSTASH_REDIS_REST_URL` ו-`UPSTASH_REDIS_REST_TOKEN`. בלי זה האתר עובד,
   אבל ההגדרות וההזמנות נמחקות בכל פריסה — ולוח הבקרה מציג על כך אזהרה.
3. **משתני סביבה** (Settings → Environment Variables):
   - `ADMIN_PASSWORD` — סיסמת הכניסה ל-`/admin` (חובה בפרודקשן).
   - `AUTH_SECRET` — מפתח לחתימת עוגיית ההתחברות. ליצירה: `openssl rand -base64 32`.
4. פרסו, היכנסו ל-`/admin`, והדביקו את כתובת הוובהוק.

הרשימה המלאה נמצאת ב-`.env.example`. שימו לב: כתובת הוובהוק **לא** נמצאת שם —
היא מוגדרת בלוח הבקרה. כתובת האתר לתגיות OG נגזרת אוטומטית מ-Vercel.

## עיצוב

הערכים העיצוביים (צבעים, סקאלת טיפוגרפיה, מרווחים) הועברו 1:1 מהעיצוב המאושר
ויושבים כטוקנים ב-`src/app/globals.css`. חומרי המקור — קבצי `.dc.html`,
התמלילים וה-PDF של המודעה — נשמרו תחת `design/`.

האנימציות (GSAP + ScrollTrigger) מרוכזות ב-`src/components/landing/LandingMotion.tsx`
ומופעלות לפי `data-animate`. מי שביקש תנועה מופחתת בהגדרות המערכת מקבל את הדף
ללא אנימציה כלל.
