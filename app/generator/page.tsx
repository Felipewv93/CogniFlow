'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Lightbulb, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Idea {
  title: string;
  description: string;
  keyPoints: string[];
  nextSteps: string[];
}

const CATEGORIES = [
  'Negócios',
  'Tecnologia',
  'Criativo',
  'Marketing',
  'Produto',
  'Conteúdo',
  'Outro',
];

const TONES = [
  'Profissional',
  'Casual',
  'Inspirador',
  'Técnico',
  'Criativo',
];

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('');
  const [tone, setTone] = useState('');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Por favor, descreva o que você precisa');
      return;
    }

    setLoading(true);
    setIdeas([]);

    try {
      const response = await fetch('/api/generate-idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, category, tone }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar ideias');
      }

      const data = await response.json();
      setIdeas(data.ideas || []);
      toast.success('Ideias geradas com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao gerar ideias');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-cyber-blue" />
            <h1 className="text-4xl font-bold">Gerador de Ideias com IA</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descreva o que você precisa e deixe nossa IA gerar ideias criativas e detalhadas para você
          </p>
        </div>

        {/* Form */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                O que você precisa? *
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Ideias para um aplicativo de produtividade para estudantes universitários..."
                className="w-full px-4 py-3 border rounded-lg bg-background min-h-[120px] resize-none"
                disabled={loading}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Categoria (opcional)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg bg-background"
                  disabled={loading}
                >
                  <option value="">Selecione...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tom (opcional)
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg bg-background"
                  disabled={loading}
                >
                  <option value="">Selecione...</option>
                  {TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyber-blue to-cyber-cyan text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Gerando ideias...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Ideias
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {ideas.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-cyber-neon" />
              Ideias Geradas
            </h2>

            {ideas.map((idea, index) => (
              <div
                key={index}
                className="bg-card border rounded-lg p-6 hover:border-cyber-blue/50 transition"
              >
                <h3 className="text-xl font-bold mb-3 text-cyber-blue">
                  {idea.title}
                </h3>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {idea.description}
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Key Points */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-cyber-neon" />
                      Pontos-Chave
                    </h4>
                    <ul className="space-y-2">
                      {idea.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-cyber-neon mt-1">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Next Steps */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-cyber-cyan" />
                      Próximos Passos
                    </h4>
                    <ul className="space-y-2">
                      {idea.nextSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-cyber-cyan mt-1">
                            {i + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && ideas.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Preencha o formulário acima para gerar ideias com IA
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
