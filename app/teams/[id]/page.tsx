'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/supabase/client';
import {
  ArrowLeft,
  Users,
  UserPlus,
  Mail,
  Trash2,
  Crown,
  TrendingUp,
  Lightbulb,
  FileText,
  Activity,
  Settings,
  MoreVertical,
  Copy,
  Download,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  email?: string;
  name?: string;
}

interface TeamIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
  user_id: string;
  is_favorite: boolean;
}

interface TeamInvite {
  id: string;
  email: string;
  status: string;
  created_at: string;
}

export default function TeamDetailPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const teamId = params.id as string;

  const [team, setTeam] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'templates' | 'ideas' | 'members' | 'activity' | 'config'
  >('dashboard');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [ideas, setIdeas] = useState<TeamIdea[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [editedTeam, setEditedTeam] = useState({
    name: '',
    description: '',
    website: '',
  });

  useEffect(() => {
    if (authLoading) return; // Aguardar carregar o user

    if (user && teamId && !hasLoaded) {
      loadTeamData();
    } else if (!user) {
      router.push('/auth/login');
    }
  }, [user, teamId, hasLoaded, authLoading]);

  async function loadTeamData() {
    try {
      setLoading(true);

      // Buscar dados do time
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (teamError) throw teamError;

      setTeam(teamData);
      setIsOwner(teamData.owner_id === user!.id);
      setEditedTeam({
        name: teamData.name,
        description: teamData.description || '',
        website: teamData.website || '',
      });

      // Buscar dados do owner
      const { data: ownerData } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', teamData.owner_id)
        .single();

      if (ownerData) {
        setOwnerEmail(ownerData.email || '');
        setOwnerName(ownerData.full_name || ownerData.email?.split('@')[0] || 'Proprietário');
      } else {
        // Fallback: buscar do auth.users
        setOwnerEmail(user!.email || '');
        setOwnerName(user!.email?.split('@')[0] || 'Proprietário');
      }

      // Buscar membros
      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId);

      if (membersError) throw membersError;

      // Buscar emails dos membros
      const memberIds = membersData?.map((m) => m.user_id) || [];
      if (memberIds.length > 0) {
        const { data: usersData } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', memberIds);

        const membersWithEmails = membersData?.map((member) => ({
          ...member,
          email: usersData?.find((u) => u.id === member.user_id)?.email || '',
          name: usersData?.find((u) => u.id === member.user_id)?.full_name || '',
        }));

        setMembers(membersWithEmails || []);
      }

      // Buscar ideias do time
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (ideasError) throw ideasError;
      setIdeas(ideasData || []);

      // Buscar convites pendentes (se for owner)
      if (teamData.owner_id === user!.id) {
        const { data: invitesData, error: invitesError } = await supabase
          .from('team_invites')
          .select('*')
          .eq('team_id', teamId)
          .eq('status', 'pending');

        if (invitesError) throw invitesError;
        setInvites(invitesData || []);
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados do time:', error);
      toast.error('Erro ao carregar dados do time');
      router.push('/teams');
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }

  async function handleInviteMember(e: React.FormEvent) {
    e.preventDefault();

    if (!inviteEmail.trim()) {
      toast.error('Digite um email válido');
      return;
    }

    try {
      // Verificar se o usuário já é membro
      const { data: existingMember } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .eq('user_id', inviteEmail);

      if (existingMember && existingMember.length > 0) {
        toast.error('Este usuário já é membro do time');
        return;
      }

      // Criar convite
      const { error } = await supabase.from('team_invites').insert({
        team_id: teamId,
        email: inviteEmail,
        invited_by: user!.id,
      });

      if (error) throw error;

      toast.success(`Convite enviado para ${inviteEmail}`);
      setShowInviteModal(false);
      setInviteEmail('');
      loadTeamData();
    } catch (error: any) {
      console.error('Erro ao enviar convite:', error);
      toast.error('Erro ao enviar convite');
    }
  }

  async function handleRemoveMember(memberId: string) {
    if (!confirm('Remover este membro do time?')) return;

    try {
      const { error } = await supabase.from('team_members').delete().eq('id', memberId);

      if (error) throw error;

      toast.success('Membro removido');
      loadTeamData();
    } catch (error: any) {
      console.error('Erro ao remover membro:', error);
      toast.error('Erro ao remover membro');
    }
  }

  async function handleSaveTeam() {
    if (!editedTeam.name.trim()) {
      toast.error('O nome do time é obrigatório');
      return;
    }

    try {
      const { error } = await supabase
        .from('teams')
        .update({
          name: editedTeam.name,
          description: editedTeam.description,
          website: editedTeam.website,
        })
        .eq('id', teamId);

      if (error) throw error;

      setTeam({
        ...team,
        name: editedTeam.name,
        description: editedTeam.description,
        website: editedTeam.website,
      });

      setEditMode(false);
      toast.success('Time atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar time:', error);
      toast.error('Erro ao atualizar time');
    }
  }

  async function handleDeleteTeam() {
    const confirmation = prompt('Digite o nome do time para confirmar a exclusão:');

    if (confirmation !== team.name) {
      toast.error('Nome incorreto. Exclusão cancelada.');
      return;
    }

    try {
      const { error } = await supabase.from('teams').delete().eq('id', teamId);

      if (error) throw error;

      toast.success('Time deletado com sucesso');
      router.push('/teams');
    } catch (error: any) {
      console.error('Erro ao deletar time:', error);
      toast.error('Erro ao deletar time');
    }
  }

  if (loading || !team) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/teams')}
            className="mb-4 flex items-center gap-2 text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-2xl font-bold text-white">
                {team.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold">{team.name}</h1>
                {team.website && <p className="text-muted-foreground">{team.website}</p>}
              </div>
            </div>

            {isOwner && (
              <button className="rounded-lg p-2 transition hover:bg-muted">
                <Settings className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex gap-6">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'templates', label: 'Templates', icon: FileText },
              { id: 'ideas', label: 'Ideias', icon: Lightbulb },
              { id: 'members', label: 'Membros', icon: Users },
              { id: 'activity', label: 'Atividade', icon: Activity },
              ...(isOwner ? [{ id: 'config', label: 'Config', icon: Settings }] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 transition ${
                  activeTab === tab.id
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <p className="mb-1 text-3xl font-bold">{members.length + 1}</p>
              <p className="text-sm text-muted-foreground">Membros</p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
              <p className="mb-1 text-3xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Templates</p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <Lightbulb className="h-8 w-8 text-amber-500" />
              </div>
              <p className="mb-1 text-3xl font-bold">{ideas.length}</p>
              <p className="text-sm text-muted-foreground">Ideias</p>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <p className="mb-1 text-3xl font-bold">{ideas.length + members.length}</p>
              <p className="text-sm text-muted-foreground">Atividades</p>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="rounded-lg border-2 border-dashed py-12 text-center">
            <FileText className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">Templates compartilhados</h3>
            <p className="mb-6 text-muted-foreground">
              Crie templates personalizados para seu time usar
            </p>
            <button className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white transition hover:opacity-90">
              Em breve
            </button>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Ideias do Time</h2>
            </div>

            {ideas.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed py-12 text-center">
                <Lightbulb className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Nenhuma ideia compartilhada ainda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ideas.map((idea) => (
                  <div
                    key={idea.id}
                    className="cursor-pointer rounded-lg border bg-card p-4 transition hover:border-purple-500"
                    onClick={() => router.push(`/dashboard?idea=${idea.id}`)}
                  >
                    <h3 className="mb-2 font-bold">{idea.title}</h3>
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                      {idea.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="rounded bg-muted px-2 py-1">{idea.category}</span>
                      <span>{new Date(idea.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Membros do Time</h2>
              {isOwner && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition hover:opacity-90"
                >
                  <UserPlus className="h-4 w-4" />
                  Convidar
                </button>
              )}
            </div>

            {/* Lista de Membros */}
            <div className="mb-8 space-y-3">
              {/* Owner */}
              <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 font-bold text-white">
                    {ownerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{ownerName}</p>
                    <p className="text-sm text-muted-foreground">{ownerEmail || 'Proprietário'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                </div>
              </div>

              {/* Membros */}
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold text-foreground">
                      {member.email?.charAt(0).toUpperCase() || 'M'}
                    </div>
                    <div>
                      <p className="font-semibold">{member.name || member.email}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  {isOwner && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="rounded-lg p-2 text-red-500 transition hover:bg-muted"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Convites Pendentes */}
            {isOwner && invites.length > 0 && (
              <div>
                <h3 className="mb-4 text-xl font-bold">Convites Pendentes</h3>
                <div className="space-y-3">
                  {invites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between rounded-lg border bg-card p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">{invite.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Enviado em {new Date(invite.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <span className="rounded bg-amber-500/10 px-3 py-1 text-sm text-amber-600">
                        Pendente
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            <h2 className="mb-6 text-2xl font-bold">Atividade Recente</h2>

            {ideas.length === 0 && members.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed py-12 text-center">
                <Activity className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Nenhuma atividade ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ideas.slice(0, 5).map((idea) => (
                  <div
                    key={idea.id}
                    className="flex items-center gap-4 rounded-lg border bg-card p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{idea.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Ideia criada • {new Date(idea.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}

                {members.slice(0, 3).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 rounded-lg border bg-card p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{member.name || member.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Entrou no time • {new Date(member.joined_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'config' && isOwner && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Configurações do Time</h2>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition hover:opacity-90"
                >
                  Editar
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setEditedTeam({
                        name: team.name,
                        description: team.description || '',
                        website: team.website || '',
                      });
                    }}
                    className="rounded-lg border px-4 py-2 transition hover:bg-muted"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveTeam}
                    className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition hover:opacity-90"
                  >
                    Salvar
                  </button>
                </div>
              )}
            </div>

            <div className="mb-6 rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Informações Básicas</h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Nome do Time</label>
                  <input
                    type="text"
                    value={editMode ? editedTeam.name : team.name}
                    onChange={(e) => setEditedTeam({ ...editedTeam, name: e.target.value })}
                    readOnly={!editMode}
                    className={`w-full rounded-lg border px-4 py-2 ${editMode ? 'bg-background' : 'bg-muted'}`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Descrição</label>
                  <textarea
                    value={editMode ? editedTeam.description : team.description || ''}
                    onChange={(e) => setEditedTeam({ ...editedTeam, description: e.target.value })}
                    readOnly={!editMode}
                    className={`h-24 w-full resize-none rounded-lg border px-4 py-2 ${editMode ? 'bg-background' : 'bg-muted'}`}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Website</label>
                  <input
                    type="text"
                    value={editMode ? editedTeam.website : team.website || ''}
                    onChange={(e) => setEditedTeam({ ...editedTeam, website: e.target.value })}
                    readOnly={!editMode}
                    className={`w-full rounded-lg border px-4 py-2 ${editMode ? 'bg-background' : 'bg-muted'}`}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-red-500/20 bg-card p-6">
              <h3 className="mb-2 text-lg font-semibold text-red-500">Zona de Perigo</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Deletar este time é permanente e não pode ser desfeito. Todos os membros, ideias e
                templates serão removidos.
              </p>
              <button
                onClick={handleDeleteTeam}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
              >
                Deletar Time
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Convidar Membro */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg border bg-background p-6">
            <h2 className="mb-4 text-2xl font-bold">Convidar Membro</h2>

            <form onSubmit={handleInviteMember}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium">Email do usuário</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full rounded-lg border bg-background px-4 py-2"
                  required
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  O usuário precisa ter cadastro no CogniFlow
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                  }}
                  className="flex-1 rounded-lg border px-4 py-2 transition hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition hover:opacity-90"
                >
                  Enviar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
