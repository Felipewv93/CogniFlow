'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const url = new URL(window.location.href);
        const nextPath = url.searchParams.get('next') || '/dashboard';

        // Verificar se há um hash na URL (confirmação de email)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');

        if (accessToken) {
          // Aguardar um pouco para garantir que a sessão foi atualizada
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            toast.success('Email confirmado! Bem-vindo ao Cogniflow! 🎉');
            router.push(nextPath);
          } else {
            toast.info('Redirecionando para login...');
            router.push(`/auth/login?next=${encodeURIComponent(nextPath)}`);
          }
        } else {
          // Se não houver token, redirecionar para login
          router.push(`/auth/login?next=${encodeURIComponent(nextPath)}`);
        }
      } catch (error) {
        console.error('Erro no callback:', error);
        toast.error('Erro ao processar autenticação');
        router.push('/auth/login');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
        <h2 className="text-xl font-semibold">Verificando autenticação...</h2>
        <p className="mt-2 text-muted-foreground">Aguarde um momento</p>
      </div>
    </div>
  );
}
