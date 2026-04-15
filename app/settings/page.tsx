'use client';

import { useState, useEffect } from 'react';
import { User, Bell, Palette, Download, CreditCard, Shield, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';

type Tab = 'perfil' | 'notificacoes' | 'aparencia' | 'dados' | 'pagamentos' | 'seguranca';

const tabs = [
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'aparencia', label: 'Aparência', icon: Palette },
  { id: 'dados', label: 'Dados', icon: Download },
  { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard },
  { id: 'seguranca', label: 'Segurança', icon: Shield },
] as const;

export default function ConfiguracoesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('perfil');
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Você precisa estar logado para acessar esta página');
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  // Aplicar tema quando o perfil carregar
  useEffect(() => {
    if (profile?.theme) {
      applyTheme(profile.theme);
    }
  }, [profile]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Buscar diretamente do Supabase ao invés da API
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        toast.error('Erro ao carregar perfil. Tente fazer logout e login novamente.');
        return;
      }

      setProfile({
        id: profileData.id,
        full_name: profileData.full_name || profileData.name || '',
        email: user.email || '',
        bio: profileData.bio || '',
        company: profileData.company || '',
        role: profileData.role || '',
        avatar_url: profileData.avatar_url || '',
        theme: profileData.theme || 'dark',
        notification_preferences: profileData.notification_preferences || {
          email: true,
          push: true,
          ideias: true,
          templates: false,
          times: true,
          marketing: false,
        },
        created_at: profileData.created_at,
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-cyber-blue" />
      </div>
    );
  }

  // Não renderizar nada se não estiver logado (será redirecionado)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="py-8">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie suas preferências, {profile?.full_name || 'usuário'}
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card hover:bg-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="rounded-lg border bg-card p-6">
            {activeTab === 'perfil' && <PerfilTab profile={profile} onUpdate={loadProfile} />}
            {activeTab === 'notificacoes' && (
              <NotificacoesTab profile={profile} onUpdate={loadProfile} />
            )}
            {activeTab === 'aparencia' && <AparenciaTab profile={profile} onUpdate={loadProfile} />}
            {activeTab === 'dados' && <DadosTab />}
            {activeTab === 'pagamentos' && <PagamentosTab />}
            {activeTab === 'seguranca' && <SegurancaTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente: Aba Perfil
function PerfilTab({ profile, onUpdate }: { profile: any; onUpdate: () => void }) {
  const supabase = createClientComponentClient();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    company: profile?.company || '',
    role: profile?.role || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return;
    }

    try {
      setSaving(true);

      // Salvar diretamente no Supabase
      const { error } = await supabase.from('profiles').update(formData).eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        toast.error('Erro ao atualizar perfil');
        return;
      }

      toast.success('Perfil atualizado com sucesso!');
      onUpdate();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-bold">Informações do Perfil</h2>
        <p className="text-sm text-muted-foreground">Atualize suas informações pessoais</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">Nome Completo</label>
          <input
            type="text"
            placeholder="Digite seu nome completo"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full rounded-lg border bg-background px-4 py-2"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Email</label>
          <input
            type="email"
            value={profile?.email || ''}
            className="w-full rounded-lg border bg-background px-4 py-2"
            disabled
          />
          <p className="mt-1 text-xs text-muted-foreground">O email não pode ser alterado</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Bio</label>
          <textarea
            placeholder="Conte um pouco sobre você..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="min-h-[100px] w-full rounded-lg border bg-background px-4 py-2"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Empresa</label>
            <input
              type="text"
              placeholder="Nome da sua empresa"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full rounded-lg border bg-background px-4 py-2"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Cargo</label>
            <input
              type="text"
              placeholder="Seu cargo atual"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full rounded-lg border bg-background px-4 py-2"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyber-blue to-cyber-cyan px-6 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? 'Salvando...' : 'Salvar Perfil'}
        </button>
      </div>
    </div>
  );
}

// Componente: Aba Notificações
function NotificacoesTab({ profile, onUpdate }: { profile: any; onUpdate: () => void }) {
  const supabase = createClientComponentClient();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(
    profile?.notification_preferences || {
      email: true,
      push: true,
      ideias: true,
      templates: false,
      times: true,
      marketing: false,
    }
  );
  const [_saving, setSaving] = useState(false);

  const toggle = async (key: keyof typeof notifications) => {
    if (!user) return;

    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);

    try {
      setSaving(true);

      // Salvar diretamente no Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ notification_preferences: newNotifications })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar notificações:', error);
        toast.error('Erro ao atualizar preferências');
        setNotifications(notifications);
        return;
      }

      toast.success('Preferências atualizadas!');
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar notificações:', error);
      toast.error('Erro ao atualizar preferências');
      setNotifications(notifications);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-bold">Notificações</h2>
        <p className="text-sm text-muted-foreground">Gerencie como você recebe atualizações</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b py-3">
          <div>
            <p className="font-medium">Notificações por Email</p>
            <p className="text-sm text-muted-foreground">
              Receba atualizações importantes por email
            </p>
          </div>
          <button
            onClick={() => toggle('email')}
            className={`h-6 w-12 rounded-full transition ${
              notifications.email ? 'bg-cyber-blue' : 'bg-muted'
            }`}
          >
            <div
              className={`h-5 w-5 transform rounded-full bg-white transition ${
                notifications.email ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between border-b py-3">
          <div>
            <p className="font-medium">Notificações Push</p>
            <p className="text-sm text-muted-foreground">Receba alertas no navegador</p>
          </div>
          <button
            onClick={() => toggle('push')}
            className={`h-6 w-12 rounded-full transition ${
              notifications.push ? 'bg-cyber-blue' : 'bg-muted'
            }`}
          >
            <div
              className={`h-5 w-5 transform rounded-full bg-white transition ${
                notifications.push ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between border-b py-3">
          <div>
            <p className="font-medium">Novas Ideias</p>
            <p className="text-sm text-muted-foreground">
              Quando alguém criar uma ideia no seu time
            </p>
          </div>
          <button
            onClick={() => toggle('ideias')}
            className={`h-6 w-12 rounded-full transition ${
              notifications.ideias ? 'bg-cyber-blue' : 'bg-muted'
            }`}
          >
            <div
              className={`h-5 w-5 transform rounded-full bg-white transition ${
                notifications.ideias ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between border-b py-3">
          <div>
            <p className="font-medium">Novos Templates</p>
            <p className="text-sm text-muted-foreground">
              Quando novos templates forem adicionados
            </p>
          </div>
          <button
            onClick={() => toggle('templates')}
            className={`h-6 w-12 rounded-full transition ${
              notifications.templates ? 'bg-cyber-blue' : 'bg-muted'
            }`}
          >
            <div
              className={`h-5 w-5 transform rounded-full bg-white transition ${
                notifications.templates ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between border-b py-3">
          <div>
            <p className="font-medium">Atividade de Times</p>
            <p className="text-sm text-muted-foreground">Atualizações dos seus times</p>
          </div>
          <button
            onClick={() => toggle('times')}
            className={`h-6 w-12 rounded-full transition ${
              notifications.times ? 'bg-cyber-blue' : 'bg-muted'
            }`}
          >
            <div
              className={`h-5 w-5 transform rounded-full bg-white transition ${
                notifications.times ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium">Marketing e Novidades</p>
            <p className="text-sm text-muted-foreground">Receba dicas e novidades do Cogniflow</p>
          </div>
          <button
            onClick={() => toggle('marketing')}
            className={`h-6 w-12 rounded-full transition ${
              notifications.marketing ? 'bg-cyber-blue' : 'bg-muted'
            }`}
          >
            <div
              className={`h-5 w-5 transform rounded-full bg-white transition ${
                notifications.marketing ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// Função para aplicar o tema no document
const applyTheme = (selectedTheme: 'light' | 'dark' | 'system') => {
  const root = document.documentElement;

  if (selectedTheme === 'system') {
    // Detectar preferência do sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
    root.classList.toggle('light', !prefersDark);
  } else {
    root.classList.remove('light', 'dark');
    root.classList.add(selectedTheme);
  }
};

// Componente: Aba Aparência
function AparenciaTab({ profile, onUpdate }: { profile: any; onUpdate: () => void }) {
  const supabase = createClientComponentClient();
  const { user } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(profile?.theme || 'dark');
  const [saving, setSaving] = useState(false);

  // Aplicar tema ao carregar
  useEffect(() => {
    if (profile?.theme) {
      applyTheme(profile.theme);
    }
  }, [profile]);

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    if (!user) return;

    setTheme(newTheme);

    try {
      setSaving(true);

      // Aplicar tema imediatamente na página
      applyTheme(newTheme);

      // Salvar diretamente no Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ theme: newTheme })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar tema:', error);
        toast.error('Erro ao atualizar tema');
        setTheme(profile?.theme || 'dark');
        return;
      }

      toast.success('Tema atualizado!');
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar tema:', error);
      toast.error('Erro ao atualizar tema');
      setTheme(profile?.theme || 'dark');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-bold">Aparência</h2>
        <p className="text-sm text-muted-foreground">Personalize a aparência da interface</p>
      </div>

      <div>
        <label className="mb-4 block text-sm font-medium">Tema</label>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleThemeChange('light')}
            disabled={saving}
            className={`rounded-lg border-2 p-4 transition ${
              theme === 'light'
                ? 'border-cyber-blue bg-cyber-blue/10'
                : 'border-border hover:border-cyber-blue/50'
            }`}
          >
            <div className="mb-2 h-20 w-full rounded bg-white"></div>
            <p className="text-sm font-medium">Claro</p>
          </button>

          <button
            onClick={() => handleThemeChange('dark')}
            disabled={saving}
            className={`rounded-lg border-2 p-4 transition ${
              theme === 'dark'
                ? 'border-cyber-blue bg-cyber-blue/10'
                : 'border-border hover:border-cyber-blue/50'
            }`}
          >
            <div className="mb-2 h-20 w-full rounded bg-gray-900"></div>
            <p className="text-sm font-medium">Escuro</p>
          </button>

          <button
            onClick={() => handleThemeChange('system')}
            disabled={saving}
            className={`rounded-lg border-2 p-4 transition ${
              theme === 'system'
                ? 'border-cyber-blue bg-cyber-blue/10'
                : 'border-border hover:border-cyber-blue/50'
            }`}
          >
            <div className="mb-2 h-20 w-full rounded bg-gradient-to-r from-white to-gray-900"></div>
            <p className="text-sm font-medium">Sistema</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente: Aba Dados
function DadosTab() {
  const supabase = createClientComponentClient();
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExport = async () => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return;
    }

    try {
      setExporting(true);

      // Buscar perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Buscar ideias
      const { data: ideas } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Buscar templates
      const { data: templates } = await supabase
        .from('templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Buscar conversas de IA
      const { data: conversations } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Montar objeto de exportação
      const exportData = {
        export_date: new Date().toISOString(),
        user: {
          id: user.id,
          email: user.email,
        },
        profile: profile || null,
        ideas: ideas || [],
        templates: templates || [],
        conversations: conversations || [],
        stats: {
          total_ideas: ideas?.length || 0,
          total_templates: templates?.length || 0,
          total_conversations: conversations?.length || 0,
        },
      };

      // Criar blob e fazer download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cogniflow-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast.error('Erro ao exportar dados');
    } finally {
      setExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.ideas && !data.templates) {
        toast.error('Arquivo JSON inválido');
        return;
      }

      // Importar ideias
      if (data.ideas && data.ideas.length > 0 && user) {
        const ideasToImport = data.ideas.map((idea: any) => ({
          ...idea,
          user_id: user.id,
          id: undefined, // Gerar novos IDs
        }));

        const { error: ideasError } = await supabase.from('ideas').insert(ideasToImport);

        if (ideasError) {
          console.error('Erro ao importar ideias:', ideasError);
        }
      }

      // Importar templates
      if (data.templates && data.templates.length > 0 && user) {
        const templatesToImport = data.templates.map((template: any) => ({
          ...template,
          user_id: user.id,
          id: undefined, // Gerar novos IDs
        }));

        const { error: templatesError } = await supabase
          .from('templates')
          .insert(templatesToImport);

        if (templatesError) {
          console.error('Erro ao importar templates:', templatesError);
        }
      }

      toast.success('Dados importados com sucesso!');
      event.target.value = ''; // Limpar input
    } catch (error) {
      console.error('Erro ao importar:', error);
      toast.error('Erro ao importar dados. Verifique o arquivo JSON.');
    } finally {
      setImporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      setDeleting(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Erro ao deletar conta');
      }

      toast.success('Conta deletada com sucesso. Redirecionando...');

      // Fazer logout e redirecionar
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      toast.error('Erro ao deletar conta');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-bold">Gerenciar Dados</h2>
        <p className="text-sm text-muted-foreground">Exporte ou importe seus dados</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Exportar Dados</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Baixe todas as suas ideias e templates em formato JSON
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-2 rounded-lg bg-cyber-blue px-4 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Exportar para JSON
              </>
            )}
          </button>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Importar Dados</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Importe ideias e templates de um arquivo JSON
          </p>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={importing}
              className="w-full rounded-lg border bg-background px-4 py-2 file:mr-4 file:rounded file:border-0 file:bg-cyber-blue file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:opacity-90 disabled:opacity-50"
            />
            {importing && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-cyber-blue" />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-red-500/50 bg-red-500/5 p-4">
          <h3 className="mb-2 font-semibold text-red-500">Zona de Perigo</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Esta ação é irreversível. Todos os seus dados serão permanentemente deletados.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
            >
              Deletar Conta
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-red-500">
                ⚠️ Tem certeza? Esta ação não pode ser desfeita!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {deleting ? 'Deletando...' : 'Sim, deletar permanentemente'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="rounded-lg border px-4 py-2 transition hover:bg-muted disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente: Aba Pagamentos
function PagamentosTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-bold">Plano e Pagamentos</h2>
        <p className="text-sm text-muted-foreground">Gerencie sua assinatura e pagamentos</p>
      </div>

      <div className="rounded-lg border bg-gradient-to-r from-cyber-blue/10 to-cyber-cyan/10 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Plano Gratuito</h3>
            <p className="text-sm text-muted-foreground">Recursos básicos ilimitados</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">R$ 0</p>
            <p className="text-sm text-muted-foreground">/mês</p>
          </div>
        </div>

        <div className="mb-6 space-y-2">
          <p className="flex items-center gap-2 text-sm">
            <span className="text-cyber-neon">✓</span> Ideias ilimitadas
          </p>
          <p className="flex items-center gap-2 text-sm">
            <span className="text-cyber-neon">✓</span> 32 templates prontos
          </p>
          <p className="flex items-center gap-2 text-sm">
            <span className="text-cyber-neon">✓</span> IA no modo demo
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>✗</span> Times colaborativos
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>✗</span> IA com créditos próprios
          </p>
        </div>

        <button className="w-full rounded-lg bg-gradient-to-r from-cyber-blue to-cyber-cyan px-6 py-3 font-semibold text-white transition hover:opacity-90">
          Fazer Upgrade para Pro
        </button>
      </div>
    </div>
  );
}

// Componente: Aba Segurança
function SegurancaTab() {
  const supabase = createClientComponentClient();
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [changing, setChanging] = useState(false);
  const [endingSessions, setEndingSessions] = useState(false);
  const [enabling2FA, setEnabling2FA] = useState(false);

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (passwords.new !== passwords.confirm) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (passwords.new.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setChanging(true);
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Senha alterada com sucesso!');
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        toast.error(data.error || 'Erro ao alterar senha');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error('Erro ao alterar senha');
    } finally {
      setChanging(false);
    }
  };

  const handleEndOtherSessions = async () => {
    try {
      setEndingSessions(true);

      // Fazer logout de todas as outras sessões (mantém apenas a atual)
      const { error } = await supabase.auth.refreshSession();

      if (error) {
        toast.error('Erro ao encerrar sessões');
        return;
      }

      toast.success('Todas as outras sessões foram encerradas!');
    } catch (error) {
      console.error('Erro ao encerrar sessões:', error);
      toast.error('Erro ao encerrar sessões');
    } finally {
      setEndingSessions(false);
    }
  };

  const handleEnable2FA = () => {
    setEnabling2FA(true);
    // Simulação - em produção, implementar MFA do Supabase
    setTimeout(() => {
      toast.info('Autenticação de dois fatores estará disponível em breve!');
      setEnabling2FA(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-bold">Segurança</h2>
        <p className="text-sm text-muted-foreground">Mantenha sua conta segura</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">Alterar Senha</h3>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Senha atual"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              className="w-full rounded-lg border bg-background px-4 py-2"
            />
            <input
              type="password"
              placeholder="Nova senha"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full rounded-lg border bg-background px-4 py-2"
            />
            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full rounded-lg border bg-background px-4 py-2"
            />
            <button
              onClick={handleChangePassword}
              disabled={changing}
              className="flex items-center gap-2 rounded-lg bg-cyber-blue px-4 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {changing && <Loader2 className="h-4 w-4 animate-spin" />}
              {changing ? 'Atualizando...' : 'Atualizar Senha'}
            </button>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 font-semibold">Autenticação de Dois Fatores (2FA)</h3>
              <p className="text-sm text-muted-foreground">
                Adicione uma camada extra de segurança
              </p>
            </div>
            <button
              onClick={handleEnable2FA}
              disabled={enabling2FA}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 transition hover:bg-muted disabled:opacity-50"
            >
              {enabling2FA && <Loader2 className="h-4 w-4 animate-spin" />}
              Ativar 2FA
            </button>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-3 font-semibold">Sessões Ativas</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded bg-muted/50 p-3">
              <div>
                <p className="text-sm font-medium">Windows • Chrome</p>
                <p className="text-xs text-muted-foreground">São Paulo, Brasil • Agora</p>
              </div>
              <span className="rounded bg-cyber-neon/20 px-2 py-1 text-xs text-cyber-neon">
                Atual
              </span>
            </div>
          </div>
          <button
            onClick={handleEndOtherSessions}
            disabled={endingSessions}
            className="mt-3 flex items-center gap-2 text-sm text-red-500 hover:underline disabled:opacity-50"
          >
            {endingSessions && <Loader2 className="h-3 w-3 animate-spin" />}
            {endingSessions ? 'Encerrando...' : 'Encerrar todas as outras sessões'}
          </button>
        </div>
      </div>
    </div>
  );
}
