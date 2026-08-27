'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  tags: string[];
  content: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', user?.id)
        .is('team_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar ideias:', error);
      toast.error('Erro ao carregar ideias');
    } finally {
      setLoading(false);
    }
  };

  const createIdea = async (idea: Omit<Idea, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('ideas')
        .insert([{ ...idea, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setIdeas([data, ...ideas]);
      toast.success('Ideia criada com sucesso!');
      return data;
    } catch (error: any) {
      console.error('Erro ao criar ideia:', error);
      toast.error(error.message || 'Erro ao criar ideia');
      throw error;
    }
  };

  const updateIdea = async (id: string, updates: Partial<Idea>) => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setIdeas(ideas.map((idea) => (idea.id === id ? data : idea)));
      toast.success('Ideia atualizada!');
      return data;
    } catch (error: any) {
      console.error('Erro ao atualizar ideia:', error);
      toast.error('Erro ao atualizar ideia');
      throw error;
    }
  };

  const deleteIdea = async (id: string) => {
    try {
      const { error } = await supabase.from('ideas').delete().eq('id', id);

      if (error) throw error;

      setIdeas(ideas.filter((idea) => idea.id !== id));
      toast.success('Ideia deletada!');
    } catch (error: any) {
      console.error('Erro ao deletar ideia:', error);
      toast.error('Erro ao deletar ideia');
      throw error;
    }
  };

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      await updateIdea(id, { is_favorite: isFavorite });
    } catch (error) {
      console.error('Erro ao favoritar:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchIdeas();
    } else {
      setIdeas([]);
      setLoading(false);
    }
  }, [user]);

  return {
    ideas,
    loading,
    createIdea,
    updateIdea,
    deleteIdea,
    toggleFavorite,
    refetch: fetchIdeas,
  };
}
