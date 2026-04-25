// Database Types
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  tags: string[];
  content: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export type IdeaCategory = 'startup' | 'design' | 'app-feature' | 'content' | 'marketing' | 'other';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  content: string;
  variables: TemplateVariable[];
  is_public: boolean;
  user_id: string | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export type TemplateCategory =
  | 'startup-idea'
  | 'product-feature'
  | 'design-concept'
  | 'content-prompt'
  | 'marketing-campaign'
  | 'custom';

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  label: string;
  placeholder?: string;
  options?: string[];
  required: boolean;
}

export interface ExportConfig {
  id: string;
  user_id: string;
  platform: ExportPlatform;
  credentials: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
}

export type ExportPlatform = 'lovable' | 'notion' | 'figma' | 'base44' | 'custom';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  idea_id: string | null;
  created_at: string;
  updated_at: string;
}

// UI Types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  external?: boolean;
}

export interface SidebarNavItem extends NavItem {
  items?: SidebarNavItem[];
}

export interface DashboardConfig {
  mainNav: NavItem[];
  sidebarNav: SidebarNavItem[];
}

// Form Types
export interface IdeaFormData {
  title: string;
  description: string;
  category: IdeaCategory;
  tags: string[];
  content: string;
}

export interface TemplateFormData {
  name: string;
  description: string;
  category: TemplateCategory;
  content: string;
  variables: TemplateVariable[];
  is_public: boolean;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// SEO Types
export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  openGraph?: {
    title: string;
    description: string;
    images: Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
    type: string;
  };
  twitter?: {
    card: string;
    site: string;
    creator: string;
  };
}
