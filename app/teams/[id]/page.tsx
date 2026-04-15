'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/supabase/client';
import {
  ArrowLeft,
  ArrowRight,
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
  BarChart3,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  content: string;
  tags: string[];
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
  const [isInviting, setIsInviting] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editedTeam, setEditedTeam] = useState({
    name: '',
    description: '',
    website: '',
  });

  const [showShareIdeaModal, setShowShareIdeaModal] = useState(false);
  const [userIdeas, setUserIdeas] = useState<TeamIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<TeamIdea | null>(null);
  const [showIdeaDetailModal, setShowIdeaDetailModal] = useState(false);
  const [editingIdea, setEditingIdea] = useState(false);
  const [editedIdeaData, setEditedIdeaData] = useState<Partial<TeamIdea>>({});

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

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'GET',
        headers: {
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Erro ao carregar dados do time');
      }

      const teamData = result.team;

      setTeam(teamData);
      setIsOwner(Boolean(result.isOwner));
      setEditedTeam({
        name: teamData.name,
        description: teamData.description || '',
        website: teamData.website || '',
      });

      setOwnerEmail(result.owner?.email || '');
      setOwnerName(result.owner?.name || 'Proprietário');
      setMembers(result.members || []);
      setIdeas(result.ideas || []);
      setUserIdeas(result.userIdeas || []);
      setInvites(result.invites || []);
    } catch (error: any) {
      console.error('Erro ao carregar dados do time:', error);
      toast.error('Erro ao carregar dados do time');
      router.push('/teams');
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  }

  async function getAuthHeaders() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const headers = new Headers();

    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }

    return headers;
  }

  async function handleInviteMember(e: React.FormEvent) {
    e.preventDefault();

    if (!inviteEmail.trim()) {
      toast.error('Digite um email válido');
      return;
    }

    if (!teamId) {
      toast.error('Time inválido');
      return;
    }

    try {
      setIsInviting(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch('/api/teams/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          teamId,
          email: inviteEmail,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Erro ao enviar convite');
      }

      toast.success(`Convite enviado para ${inviteEmail}`);
      setShowInviteModal(false);
      setInviteEmail('');
      loadTeamData();
    } catch (error: any) {
      console.error('Erro ao enviar convite:', error);
      toast.error(error?.message || 'Erro ao enviar convite');
    } finally {
      setIsInviting(false);
    }
  }

  async function handleRemoveMember(memberId: string) {
    if (!confirm('Remover este membro do time?')) return;

    try {
      const response = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE',
        headers: await getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Erro ao remover membro');
      }

      toast.success('Membro removido');
      loadTeamData();
    } catch (error: any) {
      console.error('Erro ao remover membro:', error);
      toast.error('Erro ao remover membro');
    }
  }

  async function handleDeleteInvite(inviteId: string, inviteEmail: string) {
    if (!confirm(`Deletar convite para ${inviteEmail}?`)) return;

    try {
      const response = await fetch(`/api/teams/${teamId}/invites/${inviteId}`, {
        method: 'DELETE',
        headers: await getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Erro ao deletar convite');
      }

      toast.success('Convite deletado');
      loadTeamData();
    } catch (error: any) {
      console.error('Erro ao deletar convite:', error);
      toast.error('Erro ao deletar convite');
    }
  }

  async function handleSaveTeam() {
    if (!editedTeam.name.trim()) {
      toast.error('O nome do time é obrigatório');
      return;
    }

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: await (async () => {
          const headers = await getAuthHeaders();
          headers.set('Content-Type', 'application/json');
          return headers;
        })(),
        body: JSON.stringify({
          name: editedTeam.name,
          description: editedTeam.description,
          website: editedTeam.website,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Erro ao atualizar time');
      }

      setTeam(result.team);

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
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: await getAuthHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Erro ao deletar time');
      }

      toast.success('Time deletado com sucesso');
      router.push('/teams');
    } catch (error: any) {
      console.error('Erro ao deletar time:', error);
      toast.error('Erro ao deletar time');
    }
  }

  async function handleShareIdea(ideaId: string) {
    try {
      const response = await fetch(`/api/teams/${teamId}/ideas/${ideaId}`, {
        method: 'PATCH',
        headers: await (async () => {
          const headers = await getAuthHeaders();
          headers.set('Content-Type', 'application/json');
          return headers;
        })(),
        body: JSON.stringify({ action: 'share' }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Erro ao compartilhar ideia');
      }

      toast.success('Ideia compartilhada com o time!');
      setShowShareIdeaModal(false);
      loadTeamData();
    } catch (error: any) {
      console.error('Erro ao compartilhar ideia:', error);
      toast.error('Erro ao compartilhar ideia');
    }
  }

  async function handleUnshareIdea(ideaId: string) {
    try {
      const response = await fetch(`/api/teams/${teamId}/ideas/${ideaId}`, {
        method: 'PATCH',
        headers: await (async () => {
          const headers = await getAuthHeaders();
          headers.set('Content-Type', 'application/json');
          return headers;
        })(),
        body: JSON.stringify({ action: 'unshare' }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Erro ao remover ideia');
      }

      toast.success('Ideia removida do time');
      loadTeamData();
    } catch (error: any) {
      console.error('Erro ao remover ideia:', error);
      toast.error('Erro ao remover ideia');
    }
  }

  async function handleSaveEditIdea() {
    if (!selectedIdea) return;

    try {
      const response = await fetch(`/api/teams/${teamId}/ideas/${selectedIdea.id}`, {
        method: 'PUT',
        headers: await (async () => {
          const headers = await getAuthHeaders();
          headers.set('Content-Type', 'application/json');
          return headers;
        })(),
        body: JSON.stringify(editedIdeaData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Erro ao atualizar ideia');
      }

      toast.success('Ideia atualizada com sucesso!');
      setEditingIdea(false);
      setEditedIdeaData({});
      loadTeamData();

      // Atualizar a ideia selecionada
      const updatedIdea = result.idea || { ...selectedIdea, ...editedIdeaData };
      setSelectedIdea(updatedIdea as TeamIdea);
    } catch (error: any) {
      console.error('Erro ao atualizar ideia:', error);
      toast.error('Erro ao atualizar ideia');
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
          <div>
            {/* Stats Cards */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-6 transition hover:-translate-y-2 hover:scale-[1.02] hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <p className="mb-1 text-3xl font-bold">{members.length + 1}</p>
                <p className="text-sm text-muted-foreground">Membros</p>
              </div>

              <div className="rounded-lg border bg-card p-6 transition hover:-translate-y-2 hover:scale-[1.02] hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                    <FileText className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
                <p className="mb-1 text-3xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Templates</p>
              </div>

              <div className="rounded-lg border bg-card p-6 transition hover:-translate-y-2 hover:scale-[1.02] hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                    <Lightbulb className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
                <p className="mb-1 text-3xl font-bold">{ideas.length}</p>
                <p className="text-sm text-muted-foreground">Ideias</p>
              </div>

              <div className="rounded-lg border bg-card p-6 transition hover:-translate-y-2 hover:scale-[1.02] hover:shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
                    <Activity className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <p className="mb-1 text-3xl font-bold">{ideas.length + members.length}</p>
                <p className="text-sm text-muted-foreground">Atividade</p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Estatísticas e Análises</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Gráfico de Barras - Ideias por Dia */}
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-4 text-lg font-semibold">Ideias Criadas (Últimos 7 Dias)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={(() => {
                        const last7Days = Array.from({ length: 7 }, (_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() - (6 - i));
                          return format(date, 'EEE', { locale: ptBR });
                        });
                        return last7Days.map((day, index) => {
                          const date = new Date();
                          date.setDate(date.getDate() - (6 - index));
                          const count = ideas.filter((idea) => {
                            const ideaDate = new Date(idea.created_at);
                            return ideaDate.toDateString() === date.toDateString();
                          }).length;
                          return { day, count };
                        });
                      })()}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                          padding: '12px',
                          boxShadow:
                            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        }}
                        itemStyle={{
                          color: 'hsl(var(--popover-foreground))',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                        cursor={false}
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico de Pizza - Ideias por Categoria */}
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-4 text-lg font-semibold">Distribuição por Categoria</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPie>
                      <Pie
                        data={(() => {
                          const categories = [...new Set(ideas.map((i) => i.category))];
                          const categoryData = categories
                            .map((cat) => ({
                              name: cat,
                              value: ideas.filter((idea) => idea.category === cat).length,
                              percent:
                                ideas.filter((idea) => idea.category === cat).length / ideas.length,
                            }))
                            .filter((item) => item.value > 0);
                          return categoryData;
                        })()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => {
                          const name = entry.name || '';
                          const percent = (entry.percent * 100).toFixed(0);
                          return `${name} (${percent}%)`;
                        }}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        minAngle={5}
                        isAnimationActive={false}
                      >
                        {(() => {
                          const COLORS = [
                            '#3b82f6',
                            '#8b5cf6',
                            '#ec4899',
                            '#f59e0b',
                            '#10b981',
                            '#ef4444',
                          ];
                          const categories = [...new Set(ideas.map((i) => i.category))];
                          return categories.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ));
                        })()}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                          padding: '12px',
                          boxShadow:
                            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        }}
                        itemStyle={{
                          color: 'hsl(var(--popover-foreground))',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                {/* Gráfico de Linha - Tendência */}
                <div className="rounded-lg border bg-card p-6 md:col-span-2">
                  <h3 className="mb-4 text-lg font-semibold">Tendência de Criação</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={(() => {
                        const last7Days = Array.from({ length: 7 }, (_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() - (6 - i));
                          return format(date, 'EEE', { locale: ptBR });
                        });
                        return last7Days.map((day, index) => {
                          const date = new Date();
                          date.setDate(date.getDate() - (6 - index));
                          const count = ideas.filter((idea) => {
                            const ideaDate = new Date(idea.created_at);
                            return ideaDate.toDateString() === date.toDateString();
                          }).length;
                          return { day, count };
                        });
                      })()}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px',
                          padding: '12px',
                          boxShadow:
                            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        }}
                        itemStyle={{
                          color: 'hsl(var(--popover-foreground))',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', r: 6 }}
                        activeDot={{ r: 8 }}
                        name="Ideias"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="mb-8 grid gap-6 lg:grid-cols-3">
              {/* Left Column - Activity */}
              <div className="lg:col-span-2">
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-6 text-xl font-bold">Atividade Recente</h3>
                  <div className="space-y-4">
                    {ideas.slice(0, 3).map((idea) => (
                      <div
                        key={idea.id}
                        className="flex items-start gap-4 rounded-lg bg-muted/50 p-4 transition hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
                          <Lightbulb className="h-6 w-6 text-amber-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-1 font-semibold">{idea.title}</h4>
                          <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                            {idea.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="rounded bg-background px-2 py-0.5">
                              {idea.category}
                            </span>
                            <span>{new Date(idea.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {ideas.length === 0 && (
                      <div className="py-12 text-center">
                        <Lightbulb className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">Nenhuma atividade recente</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Category Distribution */}
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-6 text-xl font-bold">Por Categoria</h3>
                  <div className="space-y-4">
                    {(() => {
                      const categories = [...new Set(ideas.map((i) => i.category))];
                      return categories.map((cat) => {
                        const count = ideas.filter((idea) => idea.category === cat).length;
                        const percent = ideas.length > 0 ? (count / ideas.length) * 100 : 0;
                        const colors: { [key: string]: string } = {
                          design: 'bg-purple-500',
                          startup: 'bg-blue-500',
                          feature: 'bg-pink-500',
                          marketing: 'bg-orange-500',
                          content: 'bg-green-500',
                          business: 'bg-red-500',
                        };
                        return (
                          <div key={cat}>
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span className="font-medium capitalize">{cat}</span>
                              <span className="font-bold">{count}</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full ${colors[cat] || 'bg-purple-500'}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      });
                    })()}
                    {ideas.length === 0 && (
                      <div className="py-8 text-center">
                        <Filter className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">Nenhuma categoria ainda</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-6 text-xl font-bold">Ações Rápidas</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push(`/templates?team=${teamId}`)}
                      className="flex w-full items-center justify-between rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-left text-white transition hover:opacity-90"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        <span className="font-semibold">Criar Template</span>
                      </div>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => router.push(`/generator?team=${teamId}`)}
                      className="flex w-full items-center justify-between rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-left text-white transition hover:opacity-90"
                    >
                      <div className="flex items-center gap-3">
                        <Lightbulb className="h-5 w-5" />
                        <span className="font-semibold">Criar Ideia</span>
                      </div>
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Team Information */}
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="mb-6 text-xl font-bold">Informações do Time</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Descrição</p>
                      <p className="font-medium">{team.description || 'Sem descrição'}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Administrador</p>
                      <p className="font-medium">{ownerEmail || ownerName}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Criado em</p>
                      <p className="font-medium">
                        {new Date(team.created_at).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="rounded-lg border bg-card p-8">
            <div className="mx-auto max-w-2xl text-center">
              <FileText className="mx-auto mb-4 h-16 w-16 text-purple-500" />
              <h3 className="mb-3 text-2xl font-bold">Templates para o Time</h3>
              <p className="mb-6 text-muted-foreground">
                Use templates prontos para acelerar o trabalho do seu time. Escolha na biblioteca e
                compartilhe com todos os membros.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => router.push(`/templates?team=${teamId}`)}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white transition hover:opacity-90"
                >
                  Explorar Templates
                </button>
                <button
                  onClick={() => router.push(`/generator?team=${teamId}`)}
                  className="rounded-lg border border-purple-500 px-6 py-3 text-purple-600 transition hover:bg-purple-50 dark:hover:bg-purple-950"
                >
                  Criar Ideia com IA
                </button>
              </div>
              <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h4 className="mb-2 font-semibold">📋 22 Templates</h4>
                  <p className="text-sm text-muted-foreground">
                    Acesse templates de Startup, Design, Marketing e mais
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <h4 className="mb-2 font-semibold">⚡ Uso Rápido</h4>
                  <p className="text-sm text-muted-foreground">
                    Preencha campos e gere ideias em segundos
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ideas' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Ideias do Time</h2>
              <button
                onClick={async () => {
                  await loadTeamData();
                  setShowShareIdeaModal(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition hover:opacity-90"
              >
                <Lightbulb className="h-4 w-4" />
                Compartilhar Ideia
              </button>
            </div>

            {ideas.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed py-12 text-center">
                <Lightbulb className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <p className="mb-4 text-muted-foreground">Nenhuma ideia compartilhada ainda</p>
                <button
                  onClick={async () => {
                    await loadTeamData();
                    setShowShareIdeaModal(true);
                  }}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white transition hover:opacity-90"
                >
                  Compartilhar primeira ideia
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ideas.map((idea) => (
                  <div
                    key={idea.id}
                    className="rounded-lg border bg-card p-4 transition hover:-translate-y-2 hover:scale-[1.02] hover:border-purple-500 hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="flex-1 font-bold">{idea.title}</h3>
                      {(isOwner || idea.user_id === user?.id) && (
                        <button
                          onClick={() => handleUnshareIdea(idea.id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                          title="Remover do time"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                      {idea.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="rounded bg-muted px-2 py-1">{idea.category}</span>
                      <span>{new Date(idea.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedIdea(idea);
                        setShowIdeaDetailModal(true);
                      }}
                      className="mt-3 w-full rounded-lg border border-purple-500 px-3 py-2 text-sm text-purple-600 transition hover:bg-purple-50 dark:hover:bg-purple-950"
                    >
                      Ver detalhes
                    </button>
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
              <div className="flex items-center justify-between rounded-lg border bg-card p-4 transition hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md">
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
                  className="flex items-center justify-between rounded-lg border bg-card p-4 transition hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md"
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
                      className="flex items-center justify-between rounded-lg border bg-card p-4 transition hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md"
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
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-amber-500/10 px-3 py-1 text-sm text-amber-600">
                          Pendente
                        </span>
                        <button
                          onClick={() => handleDeleteInvite(invite.id, invite.email)}
                          className="rounded-lg p-2 text-red-500 transition hover:bg-muted"
                          title="Deletar convite"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
                    className="flex items-center gap-4 rounded-lg border bg-card p-4 transition hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md"
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
                    className="flex items-center gap-4 rounded-lg border bg-card p-4 transition hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md"
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

      {/* Modal de Convidar Membro */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Convidar Membro</h3>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteEmail('');
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

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
                  disabled={isInviting}
                  className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition hover:opacity-90"
                >
                  {isInviting ? 'Enviando...' : 'Enviar Convite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Compartilhar Ideia */}
      {showShareIdeaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-background p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Compartilhar Ideia com o Time</h3>
              <button
                onClick={() => setShowShareIdeaModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              Selecione uma ideia do seu dashboard para compartilhar com o time
            </p>

            {userIdeas.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed py-12 text-center">
                <Lightbulb className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="mb-4 text-muted-foreground">Você não tem ideias para compartilhar</p>
                <button
                  onClick={() => router.push('/generator')}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white transition hover:opacity-90"
                >
                  Criar Nova Ideia
                </button>
              </div>
            ) : (
              <div className="max-h-96 space-y-3 overflow-y-auto">
                {userIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="flex items-start gap-4 rounded-lg border bg-card p-4 transition hover:-translate-y-1 hover:scale-[1.01] hover:shadow-md"
                  >
                    <div className="flex-1">
                      <h4 className="mb-1 font-semibold">{idea.title}</h4>
                      <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                        {idea.description}
                      </p>
                      <span className="inline-block rounded bg-muted px-2 py-1 text-xs">
                        {idea.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleShareIdea(idea.id)}
                      className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm text-white transition hover:opacity-90"
                    >
                      Compartilhar
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <button
                onClick={() => setShowShareIdeaModal(false)}
                className="w-full rounded-lg border px-4 py-2 transition hover:bg-muted"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Ideia */}
      {showIdeaDetailModal && selectedIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-background p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold">
                {editingIdea ? (
                  <input
                    type="text"
                    value={editedIdeaData.title ?? selectedIdea.title}
                    onChange={(e) =>
                      setEditedIdeaData({ ...editedIdeaData, title: e.target.value })
                    }
                    className="w-full rounded-lg border bg-background px-3 py-2"
                  />
                ) : (
                  selectedIdea.title
                )}
              </h3>
              <button
                onClick={() => {
                  setShowIdeaDetailModal(false);
                  setSelectedIdea(null);
                  setEditingIdea(false);
                  setEditedIdeaData({});
                }}
                className="rounded-lg p-2 transition hover:bg-muted"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Descrição */}
              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Descrição
                </h4>
                {editingIdea ? (
                  <textarea
                    value={editedIdeaData.description ?? selectedIdea.description ?? ''}
                    onChange={(e) =>
                      setEditedIdeaData({ ...editedIdeaData, description: e.target.value })
                    }
                    className="h-24 w-full resize-none rounded-lg border bg-background p-4"
                  />
                ) : (
                  <p className="rounded-lg bg-muted/50 p-4 text-foreground">
                    {selectedIdea.description || 'Sem descrição'}
                  </p>
                )}
              </div>

              {/* Conteúdo Completo */}
              <div>
                <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Conteúdo Completo
                </h4>
                {editingIdea ? (
                  <textarea
                    value={editedIdeaData.content ?? selectedIdea.content}
                    onChange={(e) =>
                      setEditedIdeaData({ ...editedIdeaData, content: e.target.value })
                    }
                    className="max-h-96 min-h-48 w-full resize-none rounded-lg border bg-background p-4 font-sans text-sm"
                  />
                ) : (
                  <div className="max-h-96 overflow-y-auto rounded-lg border bg-muted/50 p-4">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
                      {selectedIdea.content}
                    </pre>
                  </div>
                )}
              </div>

              {/* Tags */}
              {selectedIdea.tags && selectedIdea.tags.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedIdea.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-purple-500/10 px-3 py-1 text-sm text-purple-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadados */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Categoria
                  </h4>
                  {editingIdea ? (
                    <select
                      value={editedIdeaData.category ?? selectedIdea.category}
                      onChange={(e) =>
                        setEditedIdeaData({ ...editedIdeaData, category: e.target.value })
                      }
                      className="w-full rounded-lg border bg-background px-4 py-2"
                    >
                      <option value="design">Design</option>
                      <option value="startup">Startup</option>
                      <option value="feature">Feature</option>
                      <option value="marketing">Marketing</option>
                      <option value="content">Content</option>
                      <option value="business">Business</option>
                    </select>
                  ) : (
                    <span className="inline-block rounded-lg bg-purple-500/10 px-4 py-2 font-medium capitalize text-purple-600">
                      {selectedIdea.category}
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Data de Criação
                  </h4>
                  <p className="font-medium">
                    {new Date(selectedIdea.created_at).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Hora
                  </h4>
                  <p className="font-medium">
                    {new Date(selectedIdea.created_at).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 border-t pt-6">
                {editingIdea ? (
                  <>
                    <button
                      onClick={() => {
                        setEditingIdea(false);
                        setEditedIdeaData({});
                      }}
                      className="flex-1 rounded-lg border px-4 py-3 transition hover:bg-muted"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveEditIdea}
                      className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-white transition hover:opacity-90"
                    >
                      Salvar Alterações
                    </button>
                  </>
                ) : (
                  <>
                    {(isOwner || selectedIdea.user_id === user?.id) && (
                      <>
                        <button
                          onClick={() => {
                            setEditingIdea(true);
                            setEditedIdeaData({
                              title: selectedIdea.title,
                              description: selectedIdea.description,
                              content: selectedIdea.content,
                              category: selectedIdea.category,
                            });
                          }}
                          className="flex-1 rounded-lg border border-purple-500 px-4 py-3 text-purple-600 transition hover:bg-purple-50 dark:hover:bg-purple-950"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            handleUnshareIdea(selectedIdea.id);
                            setShowIdeaDetailModal(false);
                            setSelectedIdea(null);
                          }}
                          className="flex-1 rounded-lg border border-red-500 px-4 py-3 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          Remover do Time
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setShowIdeaDetailModal(false);
                        setSelectedIdea(null);
                      }}
                      className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-white transition hover:opacity-90"
                    >
                      Fechar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
