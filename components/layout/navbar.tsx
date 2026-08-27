'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Menu,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  Home,
  FileText,
  Sparkles,
  MessageSquare,
  Users,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/helpers/utils';
import { ROUTES } from '@/utils/constants';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/supabase/client';
import { toast } from 'sonner';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profileName, setProfileName] = useState('');

  // Buscar nome do perfil quando logado
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
  }, [user]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado!');
      router.push('/');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-padding mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="flex items-center space-x-3">
          <div className="relative h-10 w-10">
            <Image
              src="/favicon.svg"
              alt="CogniFlow Logo"
              width={40}
              height={40}
              className="rounded-full object-cover"
              priority
            />
          </div>
          <span className="gradient-text text-xl font-bold">CogniFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          {user ? (
            // Links para usuários logados
            <>
              <Link
                href={ROUTES.DASHBOARD}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground',
                  isActive(ROUTES.DASHBOARD) ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href={ROUTES.TEMPLATES}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground',
                  isActive(ROUTES.TEMPLATES) ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <FileText className="h-4 w-4" />
                Templates
              </Link>
              <Link
                href={ROUTES.GENERATOR}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground',
                  isActive(ROUTES.GENERATOR) ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <Sparkles className="h-4 w-4" />
                Gerador
              </Link>
              <Link
                href={ROUTES.ASSISTANT}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground',
                  isActive(ROUTES.ASSISTANT) ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <MessageSquare className="h-4 w-4" />
                Assistente IA
              </Link>
              <Link
                href="/teams"
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground',
                  pathname?.startsWith('/teams') ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <Users className="h-4 w-4" />
                Times
              </Link>
            </>
          ) : (
            // Links para visitantes
            <>
              <Link
                href={ROUTES.HOME}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground',
                  isActive(ROUTES.HOME) ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <Home className="h-4 w-4" />
                Início
              </Link>
              <Link
                href={ROUTES.TEMPLATES}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground',
                  isActive(ROUTES.TEMPLATES) ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <FileText className="h-4 w-4" />
                Templates
              </Link>
              <Link
                href={ROUTES.GENERATOR}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground',
                  isActive(ROUTES.GENERATOR) ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <Sparkles className="h-4 w-4" />
                Gerador
              </Link>
              <Link
                href={ROUTES.ASSISTANT}
                className={cn(
                  'flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground',
                  isActive(ROUTES.ASSISTANT) ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <MessageSquare className="h-4 w-4" />
                Assistente IA
              </Link>
            </>
          )}
        </nav>

        {/* Right Side - Theme Toggle + Auth */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          {user ? (
            // Menu do usuário logado
            <div className="user-menu-container relative hidden md:block">
              <Button
                variant="outline"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span>{profileName}</span>
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border bg-background py-2 shadow-lg">
                  <div className="border-b px-4 py-2">
                    <p className="text-sm font-medium">{profileName}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push(ROUTES.DASHBOARD);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition hover:bg-muted"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('/settings');
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition hover:bg-muted"
                  >
                    <Settings className="h-4 w-4" />
                    Configurações
                  </button>

                  <div className="my-2 border-t"></div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 transition hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Botões de login/cadastro para visitantes
            <div className="hidden items-center space-x-2 md:flex">
              <Button variant="ghost" asChild>
                <Link href={ROUTES.AUTH.LOGIN}>Entrar</Link>
              </Button>
              <Button variant="cyber" asChild>
                <Link href={ROUTES.AUTH.SIGNUP}>Começar Grátis</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'border-t transition-all duration-300 md:hidden',
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        )}
      >
        <nav className="container-padding flex flex-col space-y-3 py-4">
          {user ? (
            // Menu mobile para usuários logados
            <>
              <div className="border-b pb-3">
                <p className="text-sm font-medium">{profileName}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>

              <Link
                href={ROUTES.DASHBOARD}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href={ROUTES.TEMPLATES}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Templates
              </Link>
              <Link
                href={ROUTES.GENERATOR}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gerador
              </Link>
              <Link
                href={ROUTES.ASSISTANT}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Assistente IA
              </Link>

              <div className="flex flex-col space-y-2 border-t pt-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/settings');
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-600"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </>
          ) : (
            // Menu mobile para visitantes
            <>
              <Link
                href={ROUTES.HOME}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link
                href={ROUTES.TEMPLATES}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Templates
              </Link>
              <Link
                href={ROUTES.GENERATOR}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Gerador
              </Link>
              <Link
                href={ROUTES.ASSISTANT}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Assistente IA
              </Link>
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="ghost" asChild className="w-full">
                  <Link href={ROUTES.AUTH.LOGIN}>Entrar</Link>
                </Button>
                <Button variant="cyber" asChild className="w-full">
                  <Link href={ROUTES.AUTH.SIGNUP}>Começar Grátis</Link>
                </Button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
