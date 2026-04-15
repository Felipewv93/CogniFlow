'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/supabase/client';
import { Users, Plus, FileText, Lightbulb, Crown } from 'lucide-react';
import { toast } from 'sonner';

interface Team {
  id: string;
  name: string;
  description: string;
  website: string;
  owner_id: string;
  created_at: string;
  member_count?: number;
  idea_count?: number;
  template_count?: number;
}

export default function TeamsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    description: '',
    website: '',
  });

  useEffect(() => {
    if (authLoading) return; // Aguardar carregar o user

    if (user && !hasLoaded) {
      loadTeams();
    } else if (!user) {
      router.push('/auth/login');
    }
  }, [user, hasLoaded, authLoading]);

  async function loadTeams() {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch('/api/teams', {
        method: 'GET',
        headers: {
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Erro ao carregar times');
      }

      setTeams(result.teams || []);
    } catch (error: any) {
      console.error('Erro ao carregar times:', error);
      console.error('Detalhes:', error.message, error.code);
      toast.error(`Erro ao carregar times: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }

  async function handleCreateTeam(e: React.FormEvent) {
    e.preventDefault();

    if (!newTeam.name.trim()) {
      toast.error('Digite um nome para o time');
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          name: newTeam.name,
          description: newTeam.description,
          website: newTeam.website,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Erro ao criar time');
      }

      toast.success('Time criado com sucesso!');
      setShowCreateModal(false);
      setNewTeam({ name: '', description: '', website: '' });
      loadTeams();
    } catch (error: any) {
      console.error('Erro completo ao criar time:', error);
      toast.error(`Erro ao criar time: ${error.message || 'Erro desconhecido'}`);
    }
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold">Times e Equipes</h1>
            <p className="text-muted-foreground">Colabore e compartilhe recursos com seu time</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white transition hover:opacity-90"
          >
            <Plus className="h-5 w-5" />
            Criar Time
          </button>
        </div>

        {/* Lista de Times */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
          </div>
        ) : teams.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed py-12 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">Nenhum time ainda</h3>
            <p className="mb-6 text-muted-foreground">
              Crie seu primeiro time e comece a colaborar
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white transition hover:opacity-90"
            >
              Criar Primeiro Time
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <div
                key={team.id}
                onClick={() => router.push(`/teams/${team.id}`)}
                className="cursor-pointer rounded-lg border bg-card p-6 transition hover:border-purple-500"
              >
                {/* Avatar do Time */}
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-2xl font-bold text-white">
                  {team.name.charAt(0).toUpperCase()}
                </div>

                {/* Info do Time */}
                <div className="mb-4">
                  <h3 className="mb-1 text-xl font-bold">{team.name}</h3>
                  {team.website && <p className="text-sm text-muted-foreground">{team.website}</p>}
                </div>

                {/* Estatísticas */}
                <div className="mb-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="mb-1 flex items-center justify-center">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold">{team.member_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Membros</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold">{team.template_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Templates</p>
                  </div>
                  <div className="text-center">
                    <div className="mb-1 flex items-center justify-center">
                      <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold">{team.idea_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Ideias</p>
                  </div>
                </div>

                {/* Badge de Owner */}
                {team.owner_id === user.id && (
                  <div className="inline-flex items-center gap-1 rounded bg-purple-500/10 px-2 py-1 text-xs text-purple-600">
                    <Crown className="h-3 w-3" />
                    Proprietário
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Criar Time */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border bg-background p-6">
            <h2 className="mb-4 text-2xl font-bold">Criar Novo Time</h2>

            <form onSubmit={handleCreateTeam}>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Nome do Time *</label>
                  <input
                    type="text"
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    placeholder="Ex: Ditko"
                    className="w-full rounded-lg border bg-background px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Descrição</label>
                  <textarea
                    value={newTeam.description}
                    onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                    placeholder="O que seu time faz?"
                    className="h-24 w-full resize-none rounded-lg border bg-background px-4 py-2"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Website</label>
                  <input
                    type="text"
                    value={newTeam.website}
                    onChange={(e) => setNewTeam({ ...newTeam, website: e.target.value })}
                    placeholder="Ditko.br"
                    className="w-full rounded-lg border bg-background px-4 py-2"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewTeam({ name: '', description: '', website: '' });
                  }}
                  className="flex-1 rounded-lg border px-4 py-2 transition hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition hover:opacity-90"
                >
                  Criar Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
