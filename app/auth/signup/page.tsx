'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [nextPath, setNextPath] = useState('/dashboard');
  const { signUp, signInWithProvider } = useAuth();
  const router = useRouter();

  // Lê parâmetros de query somente no cliente para evitar erro de prerender no build.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    const emailParam = params.get('email');

    if (next) {
      setNextPath(next);
    }

    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(email, password);
      toast.success('Conta criada! Verifique seu email para confirmar.');
      router.push(`/auth/login?next=${encodeURIComponent(nextPath)}`);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      await signInWithProvider(provider, nextPath);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold">Criar conta</h1>
          <p className="text-muted-foreground">Comece gratuitamente no Cogniflow</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Nome</label>
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border bg-background px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border bg-background px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border bg-background px-4 py-2"
              required
              minLength={6}
            />
            <p className="mt-1 text-xs text-muted-foreground">Mínimo 6 caracteres</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-cyber-blue to-cyber-cyan px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Criando conta...' : 'Criar Conta Grátis'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOAuth('google')}
            className="rounded-lg border px-4 py-2 transition hover:bg-muted/50"
          >
            Google
          </button>
          <button
            onClick={() => handleOAuth('github')}
            className="rounded-lg border px-4 py-2 transition hover:bg-muted/50"
          >
            GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <a
            href={`/auth/login?next=${encodeURIComponent(nextPath)}`}
            className="text-primary hover:underline"
          >
            Entrar
          </a>
        </p>

        <div className="mt-8 rounded-lg bg-muted/50 p-4">
          <p className="text-center text-xs text-muted-foreground">
            ✨ Sem necessidade de cartão de crédito • Templates ilimitados
          </p>
        </div>
      </div>
    </div>
  );
}
