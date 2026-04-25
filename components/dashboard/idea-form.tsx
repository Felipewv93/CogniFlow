'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Idea } from '@/lib/hooks/use-ideas';

interface IdeaFormProps {
  onSubmit: (idea: any) => Promise<void>;
  onCancel: () => void;
  initialData?: Idea;
}

const categories = ['Startup', 'Design', 'App Feature', 'Conteúdo', 'Marketing', 'Outro'];

export function IdeaForm({ onSubmit, onCancel, initialData }: IdeaFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Startup',
    content: initialData?.content || '',
    tags: initialData?.tags?.join(', ') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        is_favorite: initialData?.is_favorite || false,
      });
      onCancel();
    } catch (error) {
      console.error('Erro no formulário:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Título *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ex: App de Produtividade com IA"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Categoria *</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full rounded-lg border bg-background px-4 py-2"
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Descrição Curta</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Resumo em uma linha"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Conteúdo *</label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Descreva sua ideia em detalhes..."
          className="min-h-[150px] w-full rounded-lg border bg-background px-4 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Tags</label>
        <Input
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="react, typescript, saas (separadas por vírgula)"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar Ideia'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
