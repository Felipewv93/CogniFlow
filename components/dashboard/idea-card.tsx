'use client';

import { useState } from 'react';
import { Star, Pencil, Trash2, X } from 'lucide-react';
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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openDetails = () => setIsDetailsOpen(true);

  return (
    <>
      <article
        className="cursor-pointer rounded-lg border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lg"
        onClick={openDetails}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openDetails();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Abrir detalhes de ${idea.title}`}
      >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="line-clamp-2 text-lg font-semibold">{idea.title}</h3>
            <button
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite(idea.id, !idea.is_favorite);
              }}
              aria-label={idea.is_favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
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

      <p className="mb-4 line-clamp-3 min-h-[4.5rem] text-sm text-muted-foreground">
        {idea.description || 'Clique para visualizar os detalhes desta ideia.'}
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{idea.category}</Badge>
        {idea.tags.slice(0, 2).map((tag) => (
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
          <Button
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(idea);
            }}
          >
            <Pencil className="mr-1 h-4 w-4" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(idea.id);
            }}
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Deletar
          </Button>
        </div>
      </div>
      </article>

      {isDetailsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="presentation"
          onClick={() => setIsDetailsOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border bg-background p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`idea-title-${idea.id}`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 id={`idea-title-${idea.id}`} className="text-2xl font-bold">
                {idea.title}
              </h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsDetailsOpen(false)}
                aria-label="Fechar detalhes"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {idea.description && (
              <p className="mb-5 whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {idea.description}
              </p>
            )}
            <div className="mb-5 whitespace-pre-wrap leading-relaxed">{idea.content}</div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{idea.category}</Badge>
              {idea.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
