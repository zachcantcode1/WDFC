import type { Metadata } from 'next';
import { Barlow_Condensed, Geist, Geist_Mono } from 'next/font/google';
import { community } from '@/lib/community';
import './globals.css';

const sans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
const mono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});
const display = Barlow_Condensed({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000'),
  ),
  title: `${community.name} — Find your squad`,
  description:
    'Join the English-speaking WARDOGS PvP community in North America.',
  icons: { icon: '/images/wdfc-logo-192.png' },
  openGraph: {
    type: 'website',
    title: `${community.name} — Find your squad`,
    description:
      'Join an English-speaking, NA-based WARDOGS PvP community with monthly giveaways and activity rewards.',
    images: [
      {
        url: '/images/social-preview.webp',
        width: 1200,
        height: 630,
        alt: `${community.name} — Find your squad`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${community.name} — Find your squad`,
    description:
      'Join an English-speaking, NA-based WARDOGS PvP community with monthly giveaways and activity rewards.',
    images: ['/images/social-preview.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${sans.variable} ${mono.variable} ${display.variable}`}>
        {children}
      </body>
    </html>
  );
}
