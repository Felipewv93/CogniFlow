'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { ArrowLeft, Copy, Save, Download, Sparkles, Users, Target, Zap } from 'lucide-react';
import { TEMPLATES_DATA, TemplateData } from '@/lib/templates-data';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();

  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'resume' | 'personalize' | 'content'>('resume');
  const [generatedContent, setGeneratedContent] = useState('');

  useEffect(() => {
    const templateId = params?.id as string;
    const found = TEMPLATES_DATA.find((t) => t.id === templateId);
    setTemplate(found || null);

    // Inicializar valores dos campos
    if (found) {
      const initialValues: Record<string, string> = {};
      found.fields.forEach((field) => {
        initialValues[field.id] = '';
      });
      setFieldValues(initialValues);
    }
  }, [params]);

  useEffect(() => {
    if (template) {
      generateContent();
    }
  }, [fieldValues, template]);

  const generateContent = () => {
    if (!template) return;

    let content = template.content_template;

    // Substituir variáveis
    Object.keys(fieldValues).forEach((key) => {
      const value = fieldValues[key] || `{{${key}}}`;
      content = content.replaceAll(`{{${key}}}`, value);
    });

    setGeneratedContent(content);
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent);
    toast.success('Conteúdo copiado!');
  };

  const handleSaveAsIdea = async () => {
    if (!user) {
      toast.error('Faça login para salvar');
      router.push('/auth/login');
      return;
    }

    try {
      const { error } = await supabase.from('ideas').insert({
        title: template?.title || 'Template',
        description: template?.description || '',
        content: generatedContent,
        category: template?.category || 'other',
        tags: [],
        is_favorite: false,
        user_id: user.id,
      });

      if (error) throw error;

      toast.success('Salvo como ideia!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Erro ao salvar');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template?.title || 'template'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Download iniciado!');
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Template não encontrado</p>
        </div>
      </div>
    );
  }

  const filledFields = Object.values(fieldValues).filter((v) => v.trim() !== '').length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">{template.title}</h1>
          <p className="text-lg text-muted-foreground">{template.description}</p>

          <div className="mt-4 flex items-center gap-4">
            <span className="rounded-full bg-cyber-blue/10 px-3 py-1 text-xs font-medium text-cyber-blue">
              {template.category}
            </span>
            {template.tags.map((tag) => (
              <span key={tag} className="rounded bg-muted px-2 py-1 text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('resume')}
              className={`border-b-2 px-2 pb-3 transition ${
                activeTab === 'resume'
                  ? 'border-cyber-blue text-cyber-blue'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Resumo do Template
              </div>
            </button>
            <button
              onClick={() => setActiveTab('personalize')}
              className={`border-b-2 px-2 pb-3 transition ${
                activeTab === 'personalize'
                  ? 'border-cyber-blue text-cyber-blue'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Personalize o Template
                {filledFields > 0 && (
                  <span className="rounded-full bg-cyber-blue px-2 py-0.5 text-xs text-white">
                    {filledFields} campos
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`border-b-2 px-2 pb-3 transition ${
                activeTab === 'content'
                  ? 'border-cyber-blue text-cyber-blue'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Conteúdo do Template
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid gap-6 lg:grid-cols-1">
          {/* Tab: Resumo */}
          {activeTab === 'resume' && (
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="rounded-lg bg-purple-500/10 p-3">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="mb-2 text-xl font-bold">Resumo do Template</h2>
                  <p className="text-muted-foreground">
                    Informações principais sobre este template
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold">Objetivo</h3>
                  </div>
                  <p className="text-muted-foreground">{template.objective}</p>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold">Público-Alvo</h3>
                  </div>
                  <p className="text-muted-foreground">{template.target_audience}</p>
                </div>

                <div className="md:col-span-2">
                  <div className="mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold">Campos Personalizáveis</h3>
                  </div>
                  <p className="mb-2 text-muted-foreground">
                    {template.fields.length} variáveis para personalizar
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.fields.slice(0, 6).map((field) => (
                      <span key={field.id} className="rounded-full bg-muted px-3 py-1 text-xs">
                        {field.label}
                      </span>
                    ))}
                    {template.fields.length > 6 && (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs">
                        +{template.fields.length - 6} mais
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="mb-2 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-cyan-500" />
                    <h3 className="font-semibold">Categoria</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Template focado em{' '}
                    <span className="font-medium text-cyber-blue">{template.category}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Personalizar */}
          {activeTab === 'personalize' && (
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="rounded-lg bg-orange-500/10 p-3">
                  <Zap className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="mb-2 text-xl font-bold">Personalize o Template</h2>
                  <p className="text-muted-foreground">
                    Preencha os campos abaixo para gerar seu conteúdo personalizado
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {template.fields.map((field) => (
                  <div key={field.id}>
                    <label className="mb-2 block text-sm font-medium">
                      {field.label}
                      {field.required && <span className="ml-1 text-red-500">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={fieldValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full rounded-lg border bg-background px-4 py-3 transition focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue"
                      />
                    ) : field.type === 'select' && field.options ? (
                      <select
                        value={fieldValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full rounded-lg border bg-background px-4 py-3 transition focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue"
                      >
                        <option value="">Selecione...</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={fieldValues[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full rounded-lg border bg-background px-4 py-3 transition focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Conteúdo */}
          {activeTab === 'content' && (
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="rounded-lg bg-green-500/10 p-3">
                  <Save className="h-6 w-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <h2 className="mb-2 text-xl font-bold">Conteúdo do Template</h2>
                  <p className="text-muted-foreground">
                    Preview do conteúdo gerado com suas personalizações
                  </p>
                </div>
              </div>

              <div className="whitespace-pre-wrap break-words rounded-lg bg-muted/30 p-6 font-mono text-sm">
                {generatedContent}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={handleCopy}
            className="flex min-w-[200px] flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyber-blue to-cyber-cyan px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <Copy className="h-5 w-5" />
            Copiar
          </button>

          <button
            onClick={handleSaveAsIdea}
            className="flex min-w-[200px] flex-1 items-center justify-center gap-2 rounded-lg border-2 border-current px-6 py-3 font-semibold transition hover:bg-muted"
          >
            <Save className="h-5 w-5" />
            Salvar como Ideia
          </button>

          <button
            onClick={handleDownload}
            className="flex min-w-[200px] flex-1 items-center justify-center gap-2 rounded-lg border-2 border-current px-6 py-3 font-semibold transition hover:bg-muted"
          >
            <Download className="h-5 w-5" />
            Download .md
          </button>
        </div>
      </div>
    </div>
  );
}
