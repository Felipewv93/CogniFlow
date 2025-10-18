'use client';

import { useState, useEffect } from 'react';
import { FileText, Search, Filter, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  content: any;
  tags: string[];
  is_public: boolean;
  created_at: string;
}

const CATEGORIES = [
  'all',
  'startup',
  'design',
  'feature',
  'marketing',
  'content',
  'business',
];

const SAMPLE_TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'Pitch de Startup',
    description:
      'Template completo para criar seu pitch deck de startup, incluindo problema, solução, mercado e projeções.',
    category: 'startup',
    content: {},
    tags: ['pitch', 'investimento', 'startup'],
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Planejamento de Produto',
    description:
      'Estrutura para planejar features de produto, definir MVP e roadmap de desenvolvimento.',
    category: 'feature',
    content: {},
    tags: ['produto', 'mvp', 'roadmap'],
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Estratégia de Marketing',
    description:
      'Framework para criar sua estratégia de marketing digital, incluindo personas, canais e métricas.',
    category: 'marketing',
    content: {},
    tags: ['marketing', 'digital', 'estratégia'],
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Análise Competitiva',
    description:
      'Template para análise detalhada de concorrentes, forças, fraquezas e oportunidades de mercado.',
    category: 'business',
    content: {},
    tags: ['competição', 'análise', 'mercado'],
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Sistema de Design',
    description:
      'Estrutura para documentar seu sistema de design, componentes, cores, tipografia e padrões.',
    category: 'design',
    content: {},
    tags: ['design', 'ui', 'componentes'],
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Calendário de Conteúdo',
    description:
      'Planejamento de conteúdo para redes sociais, blog e email marketing com temas e datas.',
    category: 'content',
    content: {},
    tags: ['conteúdo', 'social', 'calendário'],
    is_public: true,
    created_at: new Date().toISOString(),
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory]);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, templates]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      // Por enquanto, usar templates de exemplo
      // Em produção, descomentar linha abaixo:
      // const response = await fetch(`/api/templates?category=${selectedCategory}`);
      // const data = await response.json();
      // setTemplates(data.templates || []);

      // Filtrar templates de exemplo por categoria
      const filtered =
        selectedCategory === 'all'
          ? SAMPLE_TEMPLATES
          : SAMPLE_TEMPLATES.filter((t) => t.category === selectedCategory);

      setTemplates(filtered);
      toast.success('Templates carregados');
    } catch (error: any) {
      toast.error('Erro ao carregar templates');
      setTemplates(SAMPLE_TEMPLATES);
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

  const useTemplate = (template: Template) => {
    toast.success(`Template "${template.title}" selecionado!`);
    // Redirecionar para dashboard com template
    router.push(`/dashboard?template=${template.id}`);
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="w-8 h-8 text-cyber-blue" />
            <h1 className="text-4xl font-bold">Biblioteca de Templates</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore templates prontos para acelerar seu trabalho criativo
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar templates..."
              className="w-full pl-12 pr-4 py-3 border rounded-lg bg-background"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-muted-foreground" />
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-cyber-blue" />
          </div>
        ) : filteredTemplates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="border rounded-lg p-6 hover:border-cyber-blue/50 transition-all bg-card"
              >
                <div className="mb-3">
                  <span className="text-xs bg-cyber-blue/10 text-cyber-blue px-3 py-1 rounded-full font-medium">
                    {template.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2">{template.title}</h3>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-muted px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => useTemplate(template)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-cyber-blue to-cyber-cyan text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Usar Template
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum template encontrado. Tente outra busca.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
