import type { SEOConfig } from '@/types';

export function getDefaultSEO(): SEOConfig {
  return {
    title: 'Cogniflow - Desbloqueie Sua Criatividade Oculta',
    description:
      'Plataforma SaaS de inteligência criativa que ajuda você a desbloquear, estruturar e conectar suas ideias em prompts e templates para ferramentas como Lovable, Notion e Figma.',
    canonical: process.env.NEXT_PUBLIC_SITE_URL,
    openGraph: {
      title: 'Cogniflow - Inteligência Criativa',
      description:
        'Transforme suas ideias em realidade com IA. Gere prompts, templates e estruture conceitos criativos.',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Cogniflow - Plataforma de Inteligência Criativa',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@cogniflow',
      creator: '@cogniflow',
    },
  };
}

export function getPageSEO(page: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}): SEOConfig {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cogniflow.app';
  
  return {
    title: `${page.title} | Cogniflow`,
    description: page.description,
    canonical: page.path ? `${baseUrl}${page.path}` : baseUrl,
    openGraph: {
      title: page.title,
      description: page.description,
      images: [
        {
          url: page.image || `${baseUrl}/images/og-image.png`,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@cogniflow',
      creator: '@cogniflow',
    },
  };
}

export const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Cogniflow',
  description: 'Plataforma SaaS de inteligência criativa',
  url: process.env.NEXT_PUBLIC_SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Cogniflow',
  description: 'Desbloqueie sua criatividade com inteligência artificial',
  url: process.env.NEXT_PUBLIC_SITE_URL,
  logo: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.svg`,
  sameAs: [
    'https://twitter.com/cogniflow',
    'https://github.com/felipewv93/cogniflow',
  ],
};
