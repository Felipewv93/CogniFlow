export const SITE_CONFIG = {
  name: 'Cogniflow',
  description: 'Desbloqueie sua criatividade oculta com inteligência artificial',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://cogniflow.app',
  ogImage: '/images/og-image.png',
  links: {
    twitter: 'https://twitter.com',
    github: 'https://github.com/Ryanditko/Cogniflow',
  },
};

export const IDEA_CATEGORIES: Array<{
  value: IdeaCategory;
  label: string;
  description: string;
}> = [
  {
    value: 'startup',
    label: 'Startup',
    description: 'Ideias de negócios e produtos',
  },
  {
    value: 'design',
    label: 'Design',
    description: 'Conceitos visuais e UX',
  },
  {
    value: 'app-feature',
    label: 'Feature de App',
    description: 'Funcionalidades e recursos',
  },
  {
    value: 'content',
    label: 'Conteúdo',
    description: 'Posts, artigos e mídias',
  },
  {
    value: 'marketing',
    label: 'Marketing',
    description: 'Campanhas e estratégias',
  },
  {
    value: 'other',
    label: 'Outro',
    description: 'Outras categorias',
  },
];

export const TEMPLATE_CATEGORIES: Array<{
  value: TemplateCategory;
  label: string;
  icon: string;
}> = [
  {
    value: 'startup-idea',
    label: 'Ideia de Startup',
    icon: 'Rocket',
  },
  {
    value: 'product-feature',
    label: 'Feature de Produto',
    icon: 'Package',
  },
  {
    value: 'design-concept',
    label: 'Conceito de Design',
    icon: 'Palette',
  },
  {
    value: 'content-prompt',
    label: 'Prompt de Conteúdo',
    icon: 'FileText',
  },
  {
    value: 'marketing-campaign',
    label: 'Campanha de Marketing',
    icon: 'TrendingUp',
  },
  {
    value: 'custom',
    label: 'Personalizado',
    icon: 'Sparkles',
  },
];

export const EXPORT_PLATFORMS: Array<{
  value: ExportPlatform;
  label: string;
  icon: string;
  comingSoon?: boolean;
}> = [
  {
    value: 'lovable',
    label: 'Lovable',
    icon: 'Heart',
  },
  {
    value: 'notion',
    label: 'Notion',
    icon: 'BookOpen',
  },
  {
    value: 'figma',
    label: 'Figma',
    icon: 'Figma',
    comingSoon: true,
  },
  {
    value: 'base44',
    label: 'Base44',
    icon: 'Database',
    comingSoon: true,
  },
  {
    value: 'custom',
    label: 'Webhook Customizado',
    icon: 'Webhook',
  },
];

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  IDEAS: '/dashboard/ideas',
  TEMPLATES: '/templates',
  GENERATOR: '/generator',
  ASSISTANT: '/assistant',
  SETTINGS: '/dashboard/settings',
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    RESET: '/auth/reset-password',
  },
} as const;

export const UI_MESSAGES = {
  GENERATE_IDEA_ERROR: 'Não foi possível gerar ideias agora. Tente novamente em instantes.',
  CHAT_SEND_ERROR: 'Não foi possível enviar a mensagem agora. Tente novamente em instantes.',
} as const;

import type { IdeaCategory, TemplateCategory, ExportPlatform } from '@/types';
