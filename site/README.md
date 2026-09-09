# עם מקדשי שביעי — landing page

Production implementation of the Claude Design prototype
`project/גרסה C - עם מקדשי שביעי.dc.html` (version C — the one the user selected).

Plain static HTML/CSS/JS, RTL Hebrew, no build step and no dependencies.
Serve the folder as-is:

```
python3 -m http.server 8000 --directory site
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page markup — masthead, hero, product block, order form, footer |
| `styles.css` | All styling; the prototype's inline styles ported to classes |
| `script.js` | Form validation, confirmation state, optional order submission |
| `assets/` | Background, book cover, logo, and the FB Livorna / Metropolitana fonts |

## Order submission — needs a decision

The prototype never sent orders anywhere; it only showed a confirmation. That
question was raised in the design chat and never answered, so the same behaviour
is preserved here by default.

`script.js` starts with:

```js
const ORDER_ENDPOINT = '';
```

Leave it empty and the form validates and shows the confirmation, sending
nothing. Set it to a URL (a Make/Zapier webhook, a Google Apps Script Web App,
your own API) and each order is POSTed there as JSON:

```json
{
  "name": "…",
  "phone": "…",
  "address": "…",
  "qty": "1",
  "consent": true,
  "product": "עם מקדשי שביעי",
  "submittedAt": "2026-09-09T15:00:00.000Z"
}
```

On a network or non-2xx response the user sees an error and can retry.

## Validation rules (unchanged from the prototype)

- Name and phone required — `נא למלא שם וטלפון`
- Consent checkbox required — `נא לאשר יצירת קשר`
- Address and quantity are optional; quantity defaults to `1`

## Notes on the port

- The `<x-dc>` / `DCLogic` prototype runtime is gone; state is plain DOM.
- Visual output matches the prototype exactly — same colors, `clamp()` type
  scales, spacing, radii, shadows and the `contain` / 30% opacity background.
- Added for production, with no visual change: semantic landmarks, `aria-label`
  on the placeholder-only fields, `autocomplete` / `inputmode`, visible focus
  rings, page metadata and Open Graph tags, font preloading, and a
  `prefers-reduced-motion` guard.
