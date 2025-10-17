import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'FAQ - Perguntas Frequentes | Cogniflow',
  description: 'Perguntas frequentes sobre o Cogniflow',
};

export default function FAQPage() {
  const faqs = [
    {
      category: 'Geral',
      questions: [
        {
          q: 'O que é o Cogniflow?',
          a: 'Cogniflow é uma plataforma SaaS que usa inteligência artificial para ajudar você a gerar, organizar e desenvolver suas ideias criativas.',
        },
        {
          q: 'O Cogniflow é gratuito?',
          a: 'Sim! Oferecemos um plano gratuito com funcionalidades essenciais. Planos premium com recursos avançados estarão disponíveis em breve.',
        },
        {
          q: 'Preciso de conhecimento técnico?',
          a: 'Não! O Cogniflow foi projetado para ser intuitivo e fácil de usar, mesmo para quem não tem experiência técnica.',
        },
      ],
    },
    {
      category: 'Conta e Segurança',
      questions: [
        {
          q: 'Como criar uma conta?',
          a: 'Clique em "Cadastrar" no menu superior, preencha seus dados e confirme seu email. É rápido e gratuito!',
        },
        {
          q: 'Meus dados estão seguros?',
          a: 'Sim! Usamos criptografia de ponta, autenticação segura via Supabase e seguimos as melhores práticas de segurança.',
        },
        {
          q: 'Posso deletar minha conta?',
          a: 'Sim, você pode solicitar a exclusão da sua conta a qualquer momento nas configurações.',
        },
      ],
    },
    {
      category: 'Funcionalidades',
      questions: [
        {
          q: 'Como funciona o Gerador de Ideias com IA?',
          a: 'Você fornece uma descrição inicial ou contexto, e nossa IA (OpenAI GPT) expande sua ideia com sugestões criativas, detalhes e insights.',
        },
        {
          q: 'Posso editar ideias geradas pela IA?',
          a: 'Sim! Todas as ideias podem ser editadas, organizadas com tags e categorias, e salvas no seu dashboard.',
        },
        {
          q: 'Quantas ideias posso criar?',
          a: 'No plano gratuito, não há limite de ideias. Você pode criar quantas quiser!',
        },
        {
          q: 'Posso exportar minhas ideias?',
          a: 'Sim! Você pode exportar suas ideias em formatos como Markdown, PDF, ou exportar diretamente para Notion.',
        },
      ],
    },
    {
      category: 'Inteligência Artificial',
      questions: [
        {
          q: 'Qual IA vocês usam?',
          a: 'Usamos modelos da OpenAI (GPT-4o e GPT-4o-mini) conhecidos por sua criatividade e qualidade nas respostas.',
        },
        {
          q: 'A IA tem acesso às minhas ideias privadas?',
          a: 'Não! Suas ideias são privadas e armazenadas de forma segura. A IA só processa informações quando você explicitamente pede ajuda.',
        },
        {
          q: 'As respostas da IA são sempre corretas?',
          a: 'A IA é uma ferramenta criativa e pode ter limitações. Sempre revise e valide as sugestões antes de usá-las em projetos importantes.',
        },
      ],
    },
    {
      category: 'Suporte',
      questions: [
        {
          q: 'Como posso entrar em contato?',
          a: 'Você pode abrir uma issue no nosso GitHub ou enviar um email para suporte (em breve teremos um canal direto).',
        },
        {
          q: 'Vocês têm tutorial em vídeo?',
          a: 'Estamos trabalhando em tutoriais em vídeo! Por enquanto, confira nossa documentação completa.',
        },
        {
          q: 'Posso sugerir novas funcionalidades?',
          a: 'Sim! Adoramos feedback. Abra uma issue no GitHub ou use o formulário de feedback (em breve).',
        },
      ],
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
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Perguntas Frequentes</h1>
              <p className="text-muted-foreground">Encontre respostas para as dúvidas mais comuns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-padding mx-auto max-w-4xl py-12">
        <div className="space-y-12">
          {faqs.map((category, categoryIndex) => (
            <section key={categoryIndex}>
              <h2 className="text-2xl font-bold mb-6 gradient-text">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((faq, faqIndex) => (
                  <Card key={faqIndex} className="p-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-start gap-2">
                      <ChevronDown className="h-5 w-5 text-primary mt-0.5" />
                      {faq.q}
                    </h3>
                    <p className="text-muted-foreground ml-7">{faq.a}</p>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Still have questions */}
        <Card className="p-8 text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Não encontrou sua resposta?</h2>
          <p className="text-muted-foreground mb-6">
            Entre em contato conosco ou consulte a documentação completa.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/docs">
              <Button>Ver Documentação</Button>
            </Link>
            <a
              href="https://github.com/Ryanditko/Cogniflow/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">Abrir Issue no GitHub</Button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
