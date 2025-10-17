import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Code, Zap, Shield, Rocket, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Documentação | Cogniflow',
  description: 'Aprenda a usar o Cogniflow para gerar e organizar suas ideias com IA',
};

export default function DocsPage() {
  const sections = [
    {
      icon: Rocket,
      title: 'Primeiros Passos',
      description: 'Aprenda o básico e comece a usar',
      links: [
        { title: 'Criar sua conta', href: '/auth/signup' },
        { title: 'Fazer login', href: '/auth/login' },
        { title: 'Seu primeiro projeto', href: '/dashboard' },
      ],
    },
    {
      icon: Zap,
      title: 'Funcionalidades',
      description: 'Explore todos os recursos',
      links: [
        { title: 'Dashboard de Ideias', href: '/dashboard' },
        { title: 'Gerador de Ideias com IA', href: '/generator' },
        { title: 'Assistente Inteligente', href: '/assistant' },
        { title: 'Templates Prontos', href: '/templates' },
      ],
    },
    {
      icon: Code,
      title: 'API & Integrações',
      description: 'Conecte com outras ferramentas',
      links: [
        { title: 'Exportar para Notion', href: '#notion' },
        { title: 'Exportar para Markdown', href: '#markdown' },
        { title: 'Webhook Customizado', href: '#webhook' },
      ],
    },
    {
      icon: Shield,
      title: 'Segurança',
      description: 'Proteção e privacidade',
      links: [
        { title: 'Autenticação', href: '#auth' },
        { title: 'Política de Privacidade', href: '/privacy' },
        { title: 'Termos de Uso', href: '/terms' },
      ],
    },
  ];

  const guides = [
    {
      title: 'Como criar uma ideia?',
      description: 'Acesse o Dashboard, clique em "Nova Ideia", preencha os campos e salve.',
    },
    {
      title: 'Como usar o Gerador de IA?',
      description: 'Vá em "Gerador", descreva sua ideia inicial e deixe a IA expandir para você.',
    },
    {
      title: 'Como organizar ideias?',
      description: 'Use categorias, tags e favoritos para manter tudo organizado.',
    },
    {
      title: 'Como exportar ideias?',
      description: 'No Dashboard, clique em uma ideia e escolha o formato de export desejado.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container-padding mx-auto max-w-7xl py-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-cyan">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Documentação</h1>
              <p className="text-muted-foreground">Aprenda tudo sobre o Cogniflow</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-padding mx-auto max-w-7xl py-12">
        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Guias Rápidos</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {guides.map((guide, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
                <p className="text-muted-foreground">{guide.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Documentation Sections */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Documentação Completa</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{section.title}</h3>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="text-sm text-primary hover:underline flex items-center gap-2"
                        >
                          <FileText className="h-4 w-4" />
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </section>

        {/* FAQ Quick Links */}
        <section className="mt-16">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ainda tem dúvidas?</h2>
            <p className="text-muted-foreground mb-6">
              Confira nossa seção de perguntas frequentes ou entre em contato.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/faq">
                <Button>
                  Ver FAQ
                </Button>
              </Link>
              <a href="https://github.com/Ryanditko/Cogniflow/issues" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  Reportar Issue
                </Button>
              </a>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
