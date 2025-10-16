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
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold">{idea.title}</h3>
            <button
              onClick={() => onToggleFavorite(idea.id, !idea.is_favorite)}
              className="text-muted-foreground hover:text-yellow-500 transition"
            >
              <Star
                className="w-5 h-5"
                fill={idea.is_favorite ? 'currentColor' : 'none'}
              />
            </button>
          </div>
          {idea.description && (
            <p className="text-sm text-muted-foreground mb-3">{idea.description}</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm line-clamp-3">{idea.content}</p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary">{idea.category}</Badge>
        {idea.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-xs text-muted-foreground">
          {new Date(idea.created_at).toLocaleDateString('pt-BR')}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(idea)}
          >
            <Pencil className="w-4 h-4 mr-1" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(idea.id)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Deletar
          </Button>
        </div>
      </div>
    </div>
  );
}
