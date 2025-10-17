import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Cogniflow',
  description: 'Como tratamos e protegemos seus dados no Cogniflow',
};

export default function PrivacyPage() {
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
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Política de Privacidade</h1>
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
            No <strong>Cogniflow</strong>, levamos sua privacidade a sério. Esta política explica como
            coletamos, usamos, armazenamos e protegemos suas informações pessoais.
          </p>
        </Card>

        {/* Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">1. Informações que Coletamos</h2>
            </div>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1.1 Informações de Conta</h3>
                  <p className="text-muted-foreground">
                    Quando você cria uma conta, coletamos: nome, email, e informações de autenticação
                    (senha criptografada).
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">1.2 Conteúdo Gerado</h3>
                  <p className="text-muted-foreground">
                    Armazenamos as ideias, textos e conteúdos que você cria na plataforma. Esses dados são
                    privados e apenas você tem acesso.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">1.3 Dados de Uso</h3>
                  <p className="text-muted-foreground">
                    Coletamos informações sobre como você usa o Cogniflow (páginas visitadas, funcionalidades
                    utilizadas) para melhorar nosso serviço.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">2. Como Usamos suas Informações</h2>
            </div>
            <Card className="p-6">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Fornecer e melhorar nossos serviços</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Processar suas solicitações de geração de conteúdo com IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Enviar notificações importantes sobre sua conta</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Analisar uso da plataforma para melhorias</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Garantir segurança e prevenir fraudes</span>
                </li>
              </ul>
            </Card>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">3. Compartilhamento de Dados</h2>
            </div>
            <Card className="p-6">
              <p className="text-muted-foreground mb-4">
                <strong>Nós NÃO vendemos seus dados.</strong> Seus dados podem ser compartilhados apenas em
                situações específicas:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>OpenAI:</strong> Quando você usa funcionalidades de IA, o conteúdo é enviado
                    para processamento, mas não é armazenado pela OpenAI após 30 dias.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Supabase:</strong> Nosso provedor de banco de dados e autenticação segura.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    <strong>Obrigações legais:</strong> Se exigido por lei ou autoridades competentes.
                  </span>
                </li>
              </ul>
            </Card>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">4. Segurança</h2>
            </div>
            <Card className="p-6">
              <p className="text-muted-foreground mb-4">
                Implementamos medidas técnicas e organizacionais para proteger seus dados:
              </p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Criptografia de dados em trânsito (HTTPS/TLS)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Senhas hasheadas com algoritmos seguros</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Autenticação segura via Supabase</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Row Level Security (RLS) no banco de dados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Monitoramento contínuo de segurança</span>
                </li>
              </ul>
            </Card>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">5. Seus Direitos</h2>
            </div>
            <Card className="p-6">
              <p className="text-muted-foreground mb-4">Você tem direito a:</p>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Acessar seus dados pessoais</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Corrigir dados incorretos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Solicitar exclusão da sua conta e dados</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Exportar seus dados em formato legível</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Revogar consentimento a qualquer momento</span>
                </li>
              </ul>
            </Card>
          </section>

          {/* Section 6 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Cookie className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">6. Cookies</h2>
            </div>
            <Card className="p-6">
              <p className="text-muted-foreground">
                Usamos cookies essenciais para manter sua sessão ativa e garantir o funcionamento da
                plataforma. Não usamos cookies de rastreamento para publicidade.
              </p>
            </Card>
          </section>

          {/* Section 7 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">7. Alterações nesta Política</h2>
            </div>
            <Card className="p-6">
              <p className="text-muted-foreground">
                Podemos atualizar esta política periodicamente. Notificaremos você sobre mudanças
                significativas por email ou através da plataforma.
              </p>
            </Card>
          </section>

          {/* Contact */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">8. Contato</h2>
            </div>
            <Card className="p-6">
              <p className="text-muted-foreground mb-4">
                Se você tiver dúvidas sobre esta política ou quiser exercer seus direitos:
              </p>
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

        {/* Back to top */}
        <div className="mt-12 text-center">
          <Link href="/">
            <Button variant="outline">Voltar para Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
