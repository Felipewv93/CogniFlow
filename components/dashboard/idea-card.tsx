'use client';

import { Star, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Idea } from '@/lib/hooks/use-ideas';

interface IdeaCardProps {
  idea: Idea;
  onEdit: (idea: Idea) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
}

export function IdeaCard({ idea, onEdit, onDelete, onToggleFavorite }: IdeaCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 transition hover:-translate-y-2 hover:scale-[1.02] hover:shadow-lg">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-xl font-semibold">{idea.title}</h3>
            <button
              onClick={() => onToggleFavorite(idea.id, !idea.is_favorite)}
              className="text-muted-foreground transition hover:text-yellow-500"
            >
              <Star className="h-5 w-5" fill={idea.is_favorite ? 'currentColor' : 'none'} />
            </button>
          </div>
          {idea.description && (
            <p className="mb-3 text-sm text-muted-foreground">{idea.description}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="line-clamp-3 text-sm">{idea.content}</p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <Badge variant="secondary">{idea.category}</Badge>
        {idea.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-xs text-muted-foreground">
          {new Date(idea.created_at).toLocaleDateString('pt-BR')}
        </span>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => onEdit(idea)}>
            <Pencil className="mr-1 h-4 w-4" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(idea.id)}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Deletar
          </Button>
        </div>
      </div>
    </div>
  );
}
