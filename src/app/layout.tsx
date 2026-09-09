import type { Metadata, Viewport } from 'next';
import { livorna, metropolitana } from '@/fonts';
import { resolveSiteUrl } from '@/lib/site-url';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: resolveSiteUrl(),
  title: 'הדרא — הרבה יותר מהוצאה לאור',
  description: 'דפי נחיתה של הוצאת הדרא',
};

export const viewport: Viewport = {
  themeColor: '#061b2a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={`${livorna.variable} ${metropolitana.variable}`}>
      <head>
        {/* Only hide animated elements when JS is actually running, so the page
            still renders in full if scripts fail. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.setAttribute('data-js','on')",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
