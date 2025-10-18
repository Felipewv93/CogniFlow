'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Lightbulb } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useIdeas } from '@/lib/hooks/use-ideas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IdeaCard } from '@/components/dashboard/idea-card';
import { IdeaForm } from '@/components/dashboard/idea-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Navbar } from '@/components/layout/navbar';
import type { Idea } from '@/lib/hooks/use-ideas';

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const { user } = useAuth();
  const { ideas, loading, createIdea, updateIdea, deleteIdea, toggleFavorite } = useIdeas();
  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [profileName, setProfileName] = useState('');

  // Buscar nome do perfil
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      if (profile?.full_name) {
        setProfileName(profile.full_name);
      } else {
        setProfileName(user.email?.split('@')[0] || 'Usuário');
      }
    };
    loadProfile();
  }, [user, supabase]);

  const handleCreateIdea = async (ideaData: any) => {
    await createIdea(ideaData);
    setShowForm(false);
  };

  const handleUpdateIdea = async (ideaData: any) => {
    if (editingIdea) {
      await updateIdea(editingIdea.id, ideaData);
      setEditingIdea(null);
      setShowForm(false);
    }
  };

  const handleEdit = (idea: Idea) => {
    setEditingIdea(idea);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta ideia?')) {
      await deleteIdea(id);
    }
  };

  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || idea.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(ideas.map((idea) => idea.category))];
  const favoriteCount = ideas.filter((idea) => idea.is_favorite).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container-padding mx-auto max-w-7xl py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo, {profileName}! 👋
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold mb-1">{ideas.length}</div>
                <div className="text-sm text-muted-foreground">Ideias Salvas</div>
              </div>
              <Lightbulb className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>
          <div className="border rounded-lg p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <div className="text-3xl font-bold mb-1">{favoriteCount}</div>
            <div className="text-sm text-muted-foreground">Favoritas</div>
          </div>
          <div className="border rounded-lg p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <div className="text-3xl font-bold mb-1">{categories.length - 1}</div>
            <div className="text-sm text-muted-foreground">Categorias</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ideias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-background"
          >
            <option value="all">Todas as categorias</option>
            {categories.filter((c) => c !== 'all').map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <Button onClick={() => { setEditingIdea(null); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Ideia
          </Button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingIdea ? 'Editar Ideia' : 'Nova Ideia'}
              </h2>
              <IdeaForm
                onSubmit={editingIdea ? handleUpdateIdea : handleCreateIdea}
                onCancel={() => { setShowForm(false); setEditingIdea(null); }}
                initialData={editingIdea || undefined}
              />
            </div>
          </div>
        )}

        {/* Ideas List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Carregando ideias...</p>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Lightbulb className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm || filterCategory !== 'all'
                ? 'Nenhuma ideia encontrada'
                : 'Nenhuma ideia ainda'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterCategory !== 'all'
                ? 'Tente outro termo de busca ou filtro'
                : 'Comece criando sua primeira ideia!'}
            </p>
            {!searchTerm && filterCategory === 'all' && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Ideia
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredIdeas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
