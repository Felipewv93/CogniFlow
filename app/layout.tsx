import '../styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { cn } from '@/lib/helpers/utils';
import { getDefaultSEO, jsonLdWebsite, jsonLdOrganization } from '@/utils/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const seo = getDefaultSEO();
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cogniflow-beta.vercel.app';

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: [
    'inteligência criativa',
    'gerador de ideias',
    'templates',
    'prompts',
    'IA',
    'criatividade',
    'startup',
    'design',
  ],
  authors: [{ name: 'Cogniflow Team' }],
  creator: 'Cogniflow',
  metadataBase: new URL(siteUrl),
  // Use uma query param de versão para forçar re-fetch em caches de redes sociais
  openGraph: {
    title: 'Cogniflow - Inteligência Criativa',
    description:
      'Transforme suas ideias em realidade com IA. Gere prompts, templates e estruture conceitos criativos.',
    url: siteUrl,
    siteName: 'Cogniflow',
    images: [
      {
        url: `/images/og-image.png?v=5`,
        width: 1200,
        height: 630,
        alt: 'Cogniflow - Plataforma de Inteligência Criativa',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cogniflow - Inteligência Criativa',
    description:
      'Transforme suas ideias em realidade com IA. Gere prompts, templates e estruture conceitos criativos.',
    images: [`/images/og-image.png?v=5`],
    creator: '@cogniflow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'icon', url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
      { rel: 'icon', url: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
      </head>
      <body className={cn('min-h-screen antialiased', inter.variable, inter.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
