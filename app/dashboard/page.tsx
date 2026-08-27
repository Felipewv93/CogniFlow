'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Lightbulb, TrendingUp, Star, Filter, BarChart3 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useIdeas } from '@/lib/hooks/use-ideas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IdeaCard } from '@/components/dashboard/idea-card';
import { IdeaForm } from '@/components/dashboard/idea-form';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Navbar } from '@/components/layout/navbar';
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
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Idea } from '@/lib/hooks/use-ideas';

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const { user } = useAuth();
  const { ideas, loading, createIdea, updateIdea, deleteIdea, toggleFavorite } = useIdeas();
  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'favorite' | 'recent'>('all');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'all'>('all');
  const [profileName, setProfileName] = useState('');
  const [showCharts, setShowCharts] = useState(true);

  // Buscar nome do perfil
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

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

  // Filtros avançados
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || idea.category === filterCategory;

    // Filtro por status
    let matchesStatus = true;
    if (filterStatus === 'favorite') {
      matchesStatus = idea.is_favorite;
    } else if (filterStatus === 'recent') {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      matchesStatus = new Date(idea.created_at) > threeDaysAgo;
    }

    // Filtro por data
    let matchesDate = true;
    if (dateRange !== 'all') {
      const now = new Date();
      const ideaDate = new Date(idea.created_at);

      if (dateRange === 'week') {
        const weekStart = startOfWeek(now, { locale: ptBR });
        const weekEnd = endOfWeek(now, { locale: ptBR });
        matchesDate = isWithinInterval(ideaDate, { start: weekStart, end: weekEnd });
      } else if (dateRange === 'month') {
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        matchesDate = isWithinInterval(ideaDate, { start: monthStart, end: monthEnd });
      }
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  // Estatísticas e dados para gráficos
  const categories = ['all', ...new Set(ideas.map((idea) => idea.category))];
  const favoriteCount = ideas.filter((idea) => idea.is_favorite).length;

  // Ideias criadas nos últimos 7 dias
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return format(date, 'EEE', { locale: ptBR });
  });

  const ideasPerDay = last7Days.map((day, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const count = ideas.filter((idea) => {
      const ideaDate = new Date(idea.created_at);
      return ideaDate.toDateString() === date.toDateString();
    }).length;
    return { day, count };
  });

  // Ideias por categoria
  const categoryData = categories
    .filter((cat) => cat !== 'all')
    .map((cat) => ({
      name: cat,
      value: ideas.filter((idea) => idea.category === cat).length,
    }))
    .filter((item) => item.value > 0);

  // Cores para o gráfico de pizza
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

  // Taxa de crescimento (comparando últimos 30 dias com 30 dias anteriores)
  const now = new Date();
  const last30Days = ideas.filter((idea) => {
    const ideaDate = new Date(idea.created_at);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return ideaDate > thirtyDaysAgo;
  }).length;

  const previous30Days = ideas.filter((idea) => {
    const ideaDate = new Date(idea.created_at);
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return ideaDate > sixtyDaysAgo && ideaDate <= thirtyDaysAgo;
  }).length;

  const growthRate =
    previous30Days > 0 ? (((last30Days - previous30Days) / previous30Days) * 100).toFixed(1) : '0';

  const growthPositive = parseFloat(growthRate) >= 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container-padding mx-auto max-w-7xl py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bem-vindo, {profileName}! 👋</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:from-blue-950 dark:to-cyan-950">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-3xl font-bold">{ideas.length}</div>
                <div className="text-sm text-muted-foreground">Ideias Salvas</div>
              </div>
              <Lightbulb className="h-10 w-10 text-primary opacity-20" />
            </div>
          </div>
          <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:from-purple-950 dark:to-pink-950">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-3xl font-bold">{favoriteCount}</div>
                <div className="text-sm text-muted-foreground">Favoritas</div>
              </div>
              <Star className="h-10 w-10 text-primary opacity-20" />
            </div>
          </div>
          <div className="rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:from-green-950 dark:to-emerald-950">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1 text-3xl font-bold">{categories.length - 1}</div>
                <div className="text-sm text-muted-foreground">Categorias</div>
              </div>
              <Filter className="h-10 w-10 text-primary opacity-20" />
            </div>
          </div>
          <div className="rounded-lg border bg-gradient-to-br from-orange-50 to-amber-50 p-6 dark:from-orange-950 dark:to-amber-950">
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`mb-1 text-3xl font-bold ${growthPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                  {growthPositive ? '+' : ''}
                  {growthRate}%
                </div>
                <div className="text-sm text-muted-foreground">Crescimento 30d</div>
              </div>
              <TrendingUp
                className={`h-10 w-10 opacity-20 ${growthPositive ? 'text-green-600' : 'text-red-600'}`}
              />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <BarChart3 className="h-6 w-6" />
              Estatísticas e Análises
            </h2>
            <Button variant="outline" size="sm" onClick={() => setShowCharts(!showCharts)}>
              {showCharts ? 'Ocultar Gráficos' : 'Mostrar Gráficos'}
            </Button>
          </div>

          {showCharts && (
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {/* Gráfico de Barras - Ideias por Dia */}
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold">Ideias Criadas (Últimos 7 Dias)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ideasPerDay}>
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
                      data={categoryData}
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
                      {categoryData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
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
                  <LineChart data={ideasPerDay}>
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
                      name="Ideias criadas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="Buscar ideias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => {
                setEditingIdea(null);
                setShowForm(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Ideia
            </Button>
          </div>

          {/* Filtros Avançados */}
          <div className="grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 transition hover:shadow-lg md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">Categoria</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-2"
              >
                <option value="all">Todas as categorias</option>
                {categories
                  .filter((c) => c !== 'all')
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'favorite' | 'recent')}
                className="w-full rounded-lg border bg-background px-4 py-2"
              >
                <option value="all">Todas</option>
                <option value="favorite">Apenas Favoritas</option>
                <option value="recent">Recentes (3 dias)</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Período</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as 'week' | 'month' | 'all')}
                className="w-full rounded-lg border bg-background px-4 py-2"
              >
                <option value="all">Todo o período</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mês</option>
              </select>
            </div>
          </div>

          {/* Resultado da Filtragem */}
          <div className="text-sm text-muted-foreground">
            Mostrando <span className="font-semibold text-foreground">{filteredIdeas.length}</span>{' '}
            de <span className="font-semibold text-foreground">{ideas.length}</span> ideias
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-background p-6">
              <h2 className="mb-4 text-2xl font-bold">
                {editingIdea ? 'Editar Ideia' : 'Nova Ideia'}
              </h2>
              <IdeaForm
                onSubmit={editingIdea ? handleUpdateIdea : handleCreateIdea}
                onCancel={() => {
                  setShowForm(false);
                  setEditingIdea(null);
                }}
                initialData={editingIdea || undefined}
              />
            </div>
          </div>
        )}

        {/* Ideas List */}
        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Carregando ideias...</p>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed py-12 text-center">
            <Lightbulb className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">
              {searchTerm || filterCategory !== 'all'
                ? 'Nenhuma ideia encontrada'
                : 'Nenhuma ideia ainda'}
            </h3>
            <p className="mb-4 text-muted-foreground">
              {searchTerm || filterCategory !== 'all'
                ? 'Tente outro termo de busca ou filtro'
                : 'Comece criando sua primeira ideia!'}
            </p>
            {!searchTerm && filterCategory === 'all' && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
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
