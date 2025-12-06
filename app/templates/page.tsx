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

const CATEGORIES = [
  { id: 'all', name: 'Todos', color: 'from-gray-500 to-gray-600' },
  { id: 'startup', name: 'Startup', color: 'from-pink-500 to-purple-500' },
  { id: 'design', name: 'Design', color: 'from-blue-500 to-cyan-500' },
  { id: 'feature', name: 'Produto', color: 'from-green-500 to-emerald-500' },
  { id: 'marketing', name: 'Marketing', color: 'from-orange-500 to-red-500' },
  { id: 'content', name: 'Conteúdo', color: 'from-yellow-500 to-amber-500' },
  { id: 'business', name: 'Negócios', color: 'from-indigo-500 to-violet-500' },
];

const CATEGORY_COLORS: Record<string, string> = {
  startup: 'from-pink-500 to-purple-500',
  design: 'from-blue-500 to-cyan-500',
  feature: 'from-green-500 to-emerald-500',
  marketing: 'from-orange-500 to-red-500',
  content: 'from-yellow-500 to-amber-500',
  business: 'from-indigo-500 to-violet-500',
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Capturar teamId da URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setTeamId(urlParams.get('team'));
    }

    if (!authLoading) {
      loadTemplates();
    }
  }, [authLoading]);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, templates, selectedCategory]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const allTemplates = TEMPLATES_DATA.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        category: t.category,
        tags: t.tags,
        is_public: t.is_public,
        created_at: t.created_at,
      }));

      setTemplates(allTemplates);
    } catch (error: any) {
      toast.error('Erro ao carregar templates');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleUseTemplate = (template: Template) => {
    if (!user) {
      toast.error('Faça login para usar templates');
      router.push('/auth/login');
      return;
    }

    // Se vier de um time, passar o parâmetro team
    const url = teamId ? `/templates/${template.id}?team=${teamId}` : `/templates/${template.id}`;

    router.push(url);
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
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white`
                      : 'border hover:bg-muted/50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Templates Grid */}
          {loading || authLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyber-blue" />
            </div>
          ) : (
            <>
              {selectedCategory === 'all' ? (
                // Mostrar por categoria
                CATEGORIES.filter((cat) => cat.id !== 'all').map((category) => {
                  const categoryTemplates = filteredTemplates.filter(
                    (t) => t.category === category.id
                  );

                  if (categoryTemplates.length === 0) return null;

                  return (
                    <div key={category.id} className="mb-12">
                      <div className="mb-6 flex items-center gap-3">
                        <h2
                          className={`bg-gradient-to-r ${category.color} bg-clip-text text-2xl font-bold text-transparent`}
                        >
                          {category.name}
                        </h2>
                        <span className="text-sm text-muted-foreground">
                          ({categoryTemplates.length})
                        </span>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categoryTemplates.map((template) => (
                          <div
                            key={template.id}
                            className="group rounded-lg border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl"
                          >
                            <div className="mb-3">
                              <span
                                className={`rounded-full bg-gradient-to-r ${
                                  CATEGORY_COLORS[template.category]
                                } px-3 py-1 text-xs font-medium text-white`}
                              >
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
                              className={`flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${
                                CATEGORY_COLORS[template.category]
                              } px-4 py-2 font-semibold text-white transition hover:opacity-90`}
                            >
                              <Plus className="h-4 w-4" />
                              Usar Template
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : filteredTemplates.length > 0 ? (
                // Mostrar categoria selecionada
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="rounded-lg border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl"
                    >
                      <div className="mb-3">
                        <span
                          className={`rounded-full bg-gradient-to-r ${
                            CATEGORY_COLORS[template.category]
                          } px-3 py-1 text-xs font-medium text-white`}
                        >
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
                        className={`flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r ${
                          CATEGORY_COLORS[template.category]
                        } px-4 py-2 font-semibold text-white transition hover:opacity-90`}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
