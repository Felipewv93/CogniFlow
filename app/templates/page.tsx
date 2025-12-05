'use client';

import { useState, useEffect } from 'react';
import { FileText, Search, Filter, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/navbar';
import { TEMPLATES_DATA } from '@/lib/templates-data';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  is_public: boolean;
  created_at: string;
}

const CATEGORIES = ['all', 'startup', 'design', 'feature', 'marketing', 'content', 'business'];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      loadTemplates();
    }
  }, [selectedCategory, authLoading]);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, templates]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      // Usar templates com dados completos
      const allTemplates = TEMPLATES_DATA.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        category: t.category,
        tags: t.tags,
        is_public: t.is_public,
        created_at: t.created_at,
      }));

      const filtered =
        selectedCategory === 'all'
          ? allTemplates
          : allTemplates.filter((t) => t.category === selectedCategory);

      setTemplates(filtered);
      toast.success('Templates carregados');
    } catch (error: any) {
      toast.error('Erro ao carregar templates');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    if (!searchQuery.trim()) {
      setFilteredTemplates(templates);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = templates.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some((tag) => tag.toLowerCase().includes(query))
    );
    setFilteredTemplates(filtered);
  };

  const handleUseTemplate = (template: Template) => {
    if (!user) {
      toast.error('Faça login para usar templates');
      router.push('/auth/login');
      return;
    }
    router.push(`/templates/${template.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="py-12">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <FileText className="h-8 w-8 text-cyber-blue" />
              <h1 className="text-4xl font-bold">Biblioteca de Templates</h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Explore templates prontos para acelerar seu trabalho criativo
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar templates..."
                className="w-full rounded-lg border bg-background py-3 pl-12 pr-4"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-cyber-blue to-cyber-cyan text-white'
                      : 'border hover:bg-muted/50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          {loading || authLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyber-blue" />
            </div>
          ) : filteredTemplates.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-lg border bg-card p-6 transition-all hover:border-cyber-blue/50"
                >
                  <div className="mb-3">
                    <span className="rounded-full bg-cyber-blue/10 px-3 py-1 text-xs font-medium text-cyber-blue">
                      {template.category}
                    </span>
                  </div>

                  <h3 className="mb-2 text-xl font-bold">{template.title}</h3>

                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {template.description}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded bg-muted px-2 py-1 text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyber-blue to-cyber-cyan px-4 py-2 font-semibold text-white transition hover:opacity-90"
                  >
                    <Plus className="h-4 w-4" />
                    Usar Template
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Nenhum template encontrado. Tente outra busca.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
