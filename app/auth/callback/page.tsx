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
        // Verificar se há um hash na URL (confirmação de email)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        
        if (accessToken) {
          // Aguardar um pouco para garantir que a sessão foi atualizada
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            toast.success('Email confirmado! Bem-vindo ao Cogniflow! 🎉');
            router.push('/dashboard');
          } else {
            toast.info('Redirecionando para login...');
            router.push('/auth/login');
          }
        } else {
          // Se não houver token, redirecionar para login
          router.push('/auth/login');
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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <h2 className="text-xl font-semibold">Verificando autenticação...</h2>
        <p className="text-muted-foreground mt-2">Aguarde um momento</p>
      </div>
    </div>
  );
}
