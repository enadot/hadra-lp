import localFont from 'next/font/local';

/** FB Livorna — display face, used for the campaign title and price. */
export const livorna = localFont({
  src: [{ path: './fblivorna-bold.otf', weight: '700', style: 'normal' }],
  variable: '--font-livorna',
  display: 'swap',
  fallback: ['serif'],
});

/** FB Metropolitana — body face for everything else. */
export const metropolitana = localFont({
  src: [
    { path: './fbmetropolitana-regular.otf', weight: '400', style: 'normal' },
    { path: './fbmetropolitana-bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-metropolitana',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});
