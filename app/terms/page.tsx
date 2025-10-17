import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText, AlertCircle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Termos de Uso | Cogniflow',
  description: 'Termos e condições de uso do Cogniflow',
};

export default function TermsPage() {
  const lastUpdated = '17 de outubro de 2025';

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
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Termos de Uso</h1>
              <p className="text-muted-foreground">Última atualização: {lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-padding mx-auto max-w-4xl py-12">
        {/* Introduction */}
        <Card className="p-8 mb-8">
          <p className="text-lg text-muted-foreground">
            Bem-vindo ao <strong>Cogniflow</strong>! Ao usar nossa plataforma, você concorda com estes
            termos. Por favor, leia-os com atenção.
          </p>
        </Card>

        {/* Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">1.</span>
              Aceitação dos Termos
            </h2>
            <Card className="p-6">
              <p className="text-muted-foreground">
                Ao criar uma conta e usar o Cogniflow, você declara que leu, entendeu e concordou com estes
                Termos de Uso e nossa Política de Privacidade. Se você não concorda com estes termos, não use
                nossa plataforma.
              </p>
            </Card>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">2.</span>
              Descrição do Serviço
            </h2>
            <Card className="p-6">
              <p className="text-muted-foreground mb-4">
                O Cogniflow é uma plataforma que oferece:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Geração de ideias criativas com inteligência artificial</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Organização e gestão de ideias e projetos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Assistente inteligente para desenvolvimento de conceitos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Templates e ferramentas de export</span>
                </li>
              </ul>
            </Card>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">3.</span>
              Conta de Usuário
            </h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">3.1 Criação de Conta</h3>
                  <p className="text-muted-foreground">
                    Você deve fornecer informações verdadeiras e manter seus dados atualizados. Você é
                    responsável pela segurança da sua senha.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3.2 Idade Mínima</h3>
                  <p className="text-muted-foreground">
                    Você deve ter pelo menos 18 anos para usar o Cogniflow. Se você tem entre 13 e 18 anos,
                    precisa da permissão de um responsável legal.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3.3 Responsabilidade</h3>
                  <p className="text-muted-foreground">
                    Você é responsável por todas as atividades realizadas em sua conta. Não compartilhe suas
                    credenciais.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">4.</span>
              Uso Aceitável
            </h2>
            <Card className="p-6">
              <p className="text-muted-foreground mb-4">
                <strong>Você pode:</strong>
              </p>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Usar o Cogniflow para fins legais e criativos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Criar, editar e organizar suas ideias</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Exportar seu conteúdo</span>
                </li>
              </ul>

              <p className="text-muted-foreground mb-4">
                <strong>Você NÃO pode:</strong>
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <X className="h-5 w-5 text-red-500 mt-0.5" />
                  <span>Usar a plataforma para atividades ilegais</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-5 w-5 text-red-500 mt-0.5" />
                  <span>Gerar conteúdo ofensivo, difamatório ou prejudicial</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-5 w-5 text-red-500 mt-0.5" />
                  <span>Tentar hackear, explorar vulnerabilidades ou abusar do sistema</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-5 w-5 text-red-500 mt-0.5" />
                  <span>Fazer scraping ou uso automatizado sem autorização</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="h-5 w-5 text-red-500 mt-0.5" />
                  <span>Revender ou redistribuir o serviço</span>
                </li>
              </ul>
            </Card>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">5.</span>
              Propriedade Intelectual
            </h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">5.1 Seu Conteúdo</h3>
                  <p className="text-muted-foreground">
                    Você mantém todos os direitos sobre as ideias e conteúdos que criar no Cogniflow. Nós não
                    reivindicamos propriedade sobre suas criações.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">5.2 Nossa Plataforma</h3>
                  <p className="text-muted-foreground">
                    O Cogniflow, incluindo design, código, marca e funcionalidades, é propriedade intelectual
                    protegida. Você não pode copiar, modificar ou redistribuir sem autorização.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">5.3 Conteúdo Gerado por IA</h3>
                  <p className="text-muted-foreground">
                    O conteúdo gerado pela IA é fornecido como sugestão criativa. Você é responsável por
                    revisar e validar antes de usar comercialmente.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">6.</span>
              Limitações de Responsabilidade
            </h2>
            <Card className="p-6 bg-amber-500/10 border-amber-500/20">
              <div className="flex gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <p className="text-muted-foreground">
                  O Cogniflow é fornecido "como está". Não garantimos que o serviço será ininterrupto, livre
                  de erros ou completamente seguro. Usamos medidas de segurança, mas não podemos garantir
                  proteção absoluta contra ataques.
                </p>
              </div>
              <p className="text-muted-foreground">
                Não nos responsabilizamos por danos diretos, indiretos, incidentais ou consequenciais
                resultantes do uso ou incapacidade de usar o serviço.
              </p>
            </Card>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">7.</span>
              Cancelamento e Suspensão
            </h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">7.1 Por Você</h3>
                  <p className="text-muted-foreground">
                    Você pode cancelar sua conta a qualquer momento através das configurações. Seus dados
                    serão excluídos conforme nossa Política de Privacidade.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">7.2 Por Nós</h3>
                  <p className="text-muted-foreground">
                    Podemos suspender ou cancelar sua conta se você violar estes termos, usar de forma abusiva
                    ou por requisição legal.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">8.</span>
              Alterações nos Termos
            </h2>
            <Card className="p-6">
              <p className="text-muted-foreground">
                Podemos modificar estes termos a qualquer momento. Notificaremos você sobre mudanças
                significativas por email ou através da plataforma. Seu uso continuado após as mudanças
                constitui aceitação dos novos termos.
              </p>
            </Card>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">9.</span>
              Lei Aplicável
            </h2>
            <Card className="p-6">
              <p className="text-muted-foreground">
                Estes termos são regidos pelas leis do Brasil. Quaisquer disputas serão resolvidas nos
                tribunais brasileiros.
              </p>
            </Card>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-primary">10.</span>
              Contato
            </h2>
            <Card className="p-6">
              <p className="text-muted-foreground mb-4">Dúvidas sobre estes termos? Entre em contato:</p>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>GitHub:</strong>{' '}
                  <a
                    href="https://github.com/Ryanditko/Cogniflow/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Abrir Issue
                  </a>
                </p>
                <p>
                  <strong>Email:</strong> suporte@cogniflow.app (em breve)
                </p>
              </div>
            </Card>
          </section>
        </div>

        {/* Acceptance */}
        <Card className="p-8 text-center mt-12 bg-primary/5 border-primary/20">
          <p className="text-muted-foreground mb-4">
            Ao usar o Cogniflow, você reconhece que leu e concordou com estes Termos de Uso.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth/signup">
              <Button>Criar Conta</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Voltar para Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
