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
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
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
    const count = ideas.filter(idea => {
      const ideaDate = new Date(idea.created_at);
      return ideaDate.toDateString() === date.toDateString();
    }).length;
    return { day, count };
  });

  // Ideias por categoria
  const categoryData = categories
    .filter(cat => cat !== 'all')
    .map(cat => ({
      name: cat,
      value: ideas.filter(idea => idea.category === cat).length
    }))
    .filter(item => item.value > 0);

  // Cores para o gráfico de pizza
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

  // Taxa de crescimento (comparando últimos 30 dias com 30 dias anteriores)
  const now = new Date();
  const last30Days = ideas.filter(idea => {
    const ideaDate = new Date(idea.created_at);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return ideaDate > thirtyDaysAgo;
  }).length;

  const previous30Days = ideas.filter(idea => {
    const ideaDate = new Date(idea.created_at);
    const sixtyDaysAgo = new Date(now);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return ideaDate > sixtyDaysAgo && ideaDate <= thirtyDaysAgo;
  }).length;

  const growthRate = previous30Days > 0 
    ? ((last30Days - previous30Days) / previous30Days * 100).toFixed(1)
    : '0';

  const growthPositive = parseFloat(growthRate) >= 0;

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

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
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
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold mb-1">{favoriteCount}</div>
                <div className="text-sm text-muted-foreground">Favoritas</div>
              </div>
              <Star className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>
          <div className="border rounded-lg p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold mb-1">{categories.length - 1}</div>
                <div className="text-sm text-muted-foreground">Categorias</div>
              </div>
              <Filter className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>
          <div className="border rounded-lg p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950">
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-3xl font-bold mb-1 ${growthPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {growthPositive ? '+' : ''}{growthRate}%
                </div>
                <div className="text-sm text-muted-foreground">Crescimento 30d</div>
              </div>
              <TrendingUp className={`w-10 h-10 opacity-20 ${growthPositive ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Estatísticas e Análises
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCharts(!showCharts)}
            >
              {showCharts ? 'Ocultar Gráficos' : 'Mostrar Gráficos'}
            </Button>
          </div>

          {showCharts && (
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              {/* Gráfico de Barras - Ideias por Dia */}
              <div className="border rounded-lg p-6 bg-card">
                <h3 className="text-lg font-semibold mb-4">Ideias Criadas (Últimos 7 Dias)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ideasPerDay}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }} 
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de Pizza - Ideias por Categoria */}
              <div className="border rounded-lg p-6 bg-card">
                <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.name} (${(entry.percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }} 
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de Linha - Tendência */}
              <div className="border rounded-lg p-6 bg-card md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Tendência de Criação</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={ideasPerDay}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
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
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ideias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => { setEditingIdea(null); setShowForm(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Ideia
            </Button>
          </div>

          {/* Filtros Avançados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-card">
            <div>
              <label className="text-sm font-medium mb-2 block">Categoria</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-background"
              >
                <option value="all">Todas as categorias</option>
                {categories.filter((c) => c !== 'all').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'favorite' | 'recent')}
                className="w-full px-4 py-2 border rounded-lg bg-background"
              >
                <option value="all">Todas</option>
                <option value="favorite">Apenas Favoritas</option>
                <option value="recent">Recentes (3 dias)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Período</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as 'week' | 'month' | 'all')}
                className="w-full px-4 py-2 border rounded-lg bg-background"
              >
                <option value="all">Todo o período</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mês</option>
              </select>
            </div>
          </div>

          {/* Resultado da Filtragem */}
          <div className="text-sm text-muted-foreground">
            Mostrando <span className="font-semibold text-foreground">{filteredIdeas.length}</span> de <span className="font-semibold text-foreground">{ideas.length}</span> ideias
          </div>
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
