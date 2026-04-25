'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sparkles, Menu } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/helpers/utils';
import { ROUTES } from '@/utils/constants';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-padding mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link href={ROUTES.HOME} className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyber-blue to-cyber-cyan">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="gradient-text text-xl font-bold">Cogniflow</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href={ROUTES.TEMPLATES}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Templates
          </Link>
          <Link
            href={ROUTES.GENERATOR}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Gerador
          </Link>
          <Link
            href={ROUTES.ASSISTANT}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Assistente IA
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <div className="hidden items-center space-x-2 md:flex">
            <Button variant="ghost" asChild>
              <Link href={ROUTES.AUTH.LOGIN}>Entrar</Link>
            </Button>
            <Button variant="cyber" asChild>
              <Link href={ROUTES.AUTH.SIGNUP}>Começar Grátis</Link>
            </Button>
          </div>

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
          <Link
            href={ROUTES.TEMPLATES}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Templates
          </Link>
          <Link
            href={ROUTES.GENERATOR}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Gerador
          </Link>
          <Link
            href={ROUTES.ASSISTANT}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
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
        </nav>
      </div>
    </header>
  );
}
