import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

const templateExamples = [
  {
    title: 'Startup SaaS',
    category: 'Ideia de Negócio',
    description: 'Template completo para validar e estruturar uma ideia de SaaS.',
    tags: ['Startup', 'SaaS', 'Validação'],
  },
  {
    title: 'Landing Page',
    category: 'Design',
    description: 'Estrutura de conteúdo e prompts para criar landing pages de alta conversão.',
    tags: ['Design', 'Marketing', 'Conversão'],
  },
  {
    title: 'Feature de App',
    category: 'Produto',
    description: 'Framework para especificar e documentar novas features.',
    tags: ['Produto', 'Features', 'UX'],
  },
];

export function Templates() {
  return (
    <section className="section-spacing bg-muted/30">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Templates <span className="gradient-text">Prontos para Usar</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Escolha entre dezenas de templates criados por especialistas
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {templateExamples.map((template) => (
            <Card
              key={template.title}
              className="transition hover:border-cyber-cyan/50 hover:shadow-lg"
            >
              <CardHeader>
                <Badge className="mb-2 w-fit">{template.category}</Badge>
                <CardTitle className="text-xl">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-secondary px-2 py-1 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href={ROUTES.TEMPLATES}>Ver Todos os Templates</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
