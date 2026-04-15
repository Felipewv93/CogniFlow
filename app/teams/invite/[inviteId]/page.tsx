'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/supabase/client';

type InviteInfo = {
  id: string;
  email: string;
  teamId: string;
  teamName: string;
};

type Status = 'loading' | 'show-options' | 'accepting' | 'success' | 'error';

export default function AcceptInvitePage() {
  const router = useRouter();
  const params = useParams();
  const inviteId = params.inviteId as string;
  const { user, loading: authLoading } = useAuth();

  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);

  // Carregar dados do convite
  useEffect(() => {
    if (!inviteId) {
      setStatus('error');
      setErrorMessage('Convite inválido.');
      return;
    }

    const loadInvite = async () => {
      try {
        const response = await fetch(`/api/teams/invite/accept?inviteId=${inviteId}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.error || 'Não foi possível carregar o convite');
        }

        setInviteInfo(result.invite);
      } catch (error: any) {
        setStatus('error');
        setErrorMessage(error?.message || 'Não foi possível carregar o convite.');
      }
    };

    loadInvite();
  }, [inviteId]);

  // Determinar ação baseado em status de autenticação
  useEffect(() => {
    if (authLoading || !inviteInfo) return;

    if (!user) {
      // Não autenticado - mostrar opções
      setStatus('show-options');
      return;
    }

    // Autenticado - tentar aceitar convite direto
    acceptInviteIfMatches();
  }, [authLoading, user, inviteInfo]);

  const acceptInviteIfMatches = async () => {
    if (!user || !inviteInfo) return;

    const userEmail = (user.email || '').toLowerCase();
    const inviteEmail = (inviteInfo.email || '').toLowerCase();

    if (userEmail !== inviteEmail) {
      setStatus('error');
      setErrorMessage(
        `Este convite foi enviado para ${inviteInfo.email}. Você está autenticado como ${user.email}. Faça logout e tente novamente com a conta correta.`
      );
      return;
    }

    setStatus('accepting');
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const response = await fetch('/api/teams/invite/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ inviteId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || 'Não foi possível aceitar o convite');
      }

      toast.success('Convite aceito com sucesso!');
      setStatus('success');
      router.replace(`/teams/${result.teamId}`);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error?.message || 'Não foi possível aceitar o convite.');
    }
  };

  const handleLogin = () => {
    const nextPath = `/teams/invite/${inviteId}`;
    router.push(`/auth/login?next=${encodeURIComponent(nextPath)}`);
  };

  const handleSignup = () => {
    const nextPath = `/teams/invite/${inviteId}`;
    router.push(
      `/auth/signup?email=${encodeURIComponent(inviteInfo?.email || '')}&next=${encodeURIComponent(nextPath)}`
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace(`/teams/invite/${inviteId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4 py-12">
        <div className="w-full rounded-xl border bg-card p-8 text-center">
          {status === 'loading' ? (
            <>
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-purple-600" />
              <h1 className="mb-2 text-2xl font-bold">Carregando convite...</h1>
              <p className="text-muted-foreground">Um momento por favor.</p>
            </>
          ) : status === 'accepting' ? (
            <>
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-purple-600" />
              <h1 className="mb-2 text-2xl font-bold">Aceitando convite...</h1>
              <p className="text-muted-foreground">Aguarde enquanto adicionamos você ao time.</p>
            </>
          ) : status === 'show-options' ? (
            <>
              <h1 className="mb-2 text-2xl font-bold">Você foi convidado!</h1>
              <p className="mb-2 text-lg font-semibold text-purple-600">{inviteInfo?.teamName}</p>
              <p className="mb-6 text-muted-foreground">
                Convite para: <span className="font-medium">{inviteInfo?.email}</span>
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSignup}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white transition hover:opacity-90"
                >
                  Criar conta e aceitar convite
                </button>
                <button
                  onClick={handleLogin}
                  className="rounded-lg border border-muted-foreground bg-transparent px-6 py-3 text-foreground transition hover:bg-muted"
                >
                  Ou faça login se já tem conta
                </button>
              </div>
            </>
          ) : status === 'success' ? (
            <>
              <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                <span className="text-2xl text-green-600">✓</span>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-green-600">Convite aceito!</h1>
              <p className="text-muted-foreground">Redirecionando você para o time...</p>
            </>
          ) : (
            <>
              <h1 className="mb-2 text-2xl font-bold text-red-500">
                Não foi possível aceitar o convite
              </h1>
              <p className="mb-6 text-muted-foreground">{errorMessage}</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogout}
                  className="rounded-lg border border-muted-foreground bg-transparent px-6 py-2 text-foreground transition hover:bg-muted"
                >
                  Fazer logout
                </button>
                <button
                  onClick={() => router.push('/teams')}
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-2 text-white transition hover:opacity-90"
                >
                  Ir para Times
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
