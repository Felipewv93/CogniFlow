import Link from 'next/link';
import Image from 'next/image';
import { ROUTES, SITE_CONFIG } from '@/utils/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="grid gap-8 py-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href={ROUTES.HOME} className="flex items-center space-x-2">
              <div className="relative h-8 w-8">
                <Image
                  src="/favicon.svg"
                  alt="CogniFlow Logo"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              </div>
              <span className="gradient-text text-lg font-bold">CogniFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Desbloqueie sua criatividade oculta com inteligência artificial.
            </p>
          </div>

          {/* Produto */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Produto</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={ROUTES.TEMPLATES}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.GENERATOR}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Gerador de Ideias
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.ASSISTANT}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Assistente IA
                </Link>
              </li>
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Recursos</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground">
                  Documentação
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.DASHBOARD}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                  Termos de Uso
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 border-t py-6">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {SITE_CONFIG.name}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
