'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Loader2, Lightbulb, ArrowRight, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/navbar';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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

const TONES = ['Profissional', 'Casual', 'Inspirador', 'Técnico', 'Criativo'];

export default function GeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('');
  const [tone, setTone] = useState('');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Capturar teamId da URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setTeamId(urlParams.get('team'));
    }
  }, []);

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
        body: JSON.stringify({ prompt, category, tone, teamId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar ideias');
      }

      setIdeas(data.ideas || []);
      toast.success('Ideias geradas com sucesso!');
    } catch (error: any) {
      console.error('Erro ao gerar ideias:', error);
      toast.error(error.message || 'Erro ao gerar ideias');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveIdea = async (idea: Idea, index: number) => {
    if (!user) {
      toast.error('Faça login para salvar');
      router.push('/auth/login');
      return;
    }

    setSavingIndex(index);

    try {
      const ideaData: any = {
        title: idea.title,
        description: idea.description,
        content: `# ${idea.title}\n\n${idea.description}\n\n## Pontos-Chave\n${idea.keyPoints.map((p) => `- ${p}`).join('\n')}\n\n## Próximos Passos\n${idea.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
        category: category || 'other',
        tags: [],
        is_favorite: false,
        user_id: user.id,
      };

      // Se vier de um time, salvar SOMENTE no time (não no dashboard pessoal)
      if (teamId) {
        ideaData.team_id = teamId;
      }

      const { error } = await supabase.from('ideas').insert(ideaData);

      if (error) throw error;

      if (teamId) {
        toast.success('Ideia salva no time!');
        router.push(`/teams/${teamId}?tab=ideas`);
      } else {
        toast.success('Ideia salva no dashboard!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao salvar ideia:', error);
      toast.error('Erro ao salvar ideia');
    } finally {
      setSavingIndex(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-cyber-blue" />
              <h1 className="text-4xl font-bold">Gerador de Ideias com IA</h1>
            </div>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Descreva o que você precisa e deixe nossa IA gerar ideias criativas e detalhadas para
              você
            </p>
          </div>

          {/* Form */}
          <div className="mb-8 rounded-lg border bg-card p-6">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium">O que você precisa? *</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Ideias para um aplicativo de produtividade para estudantes universitários..."
                  className="min-h-[120px] w-full resize-none rounded-lg border bg-background px-4 py-3"
                  disabled={loading}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Categoria (opcional)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border bg-background px-4 py-3"
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
                  <label className="mb-2 block text-sm font-medium">Tom (opcional)</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full rounded-lg border bg-background px-4 py-3"
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
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyber-blue to-cyber-cyan px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Gerando ideias...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Gerar Ideias
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          {ideas.length > 0 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-2xl font-bold">
                <Lightbulb className="h-6 w-6 text-cyber-neon" />
                Ideias Geradas
              </h2>

              {ideas.map((idea, index) => (
                <div
                  key={index}
                  className="rounded-lg border bg-card p-6 transition hover:border-cyber-blue/50"
                >
                  <h3 className="mb-3 text-xl font-bold text-cyber-blue">{idea.title}</h3>

                  <p className="mb-4 leading-relaxed text-muted-foreground">{idea.description}</p>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Key Points */}
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 font-semibold">
                        <Lightbulb className="h-4 w-4 text-cyber-neon" />
                        Pontos-Chave
                      </h4>
                      <ul className="space-y-2">
                        {idea.keyPoints.map((point, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="mt-1 text-cyber-neon">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Next Steps */}
                    <div>
                      <h4 className="mb-3 flex items-center gap-2 font-semibold">
                        <ArrowRight className="h-4 w-4 text-cyber-cyan" />
                        Próximos Passos
                      </h4>
                      <ul className="space-y-2">
                        {idea.nextSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="mt-1 text-cyber-cyan">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Botão Salvar */}
                  <div className="mt-6 border-t pt-6">
                    <button
                      onClick={() => handleSaveIdea(idea, index)}
                      disabled={savingIndex === index}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                    >
                      {savingIndex === index ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          {teamId ? 'Salvar no Time' : 'Salvar no Dashboard'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && ideas.length === 0 && (
            <div className="py-12 text-center">
              <Sparkles className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
              <p className="text-muted-foreground">
                Preencha o formulário acima para gerar ideias com IA
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
