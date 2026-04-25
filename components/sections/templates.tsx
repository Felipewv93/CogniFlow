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
    <section className="section-spacing">
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
              className="group relative border-cyan-500/20 bg-black/50 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/50 hover:bg-black/70 hover:shadow-lg hover:shadow-cyan-500/30"
            >
              <CardHeader>
                <Badge className="mb-2 w-fit bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600">
                  {template.category}
                </Badge>
                <CardTitle className="text-xl">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-cyan-500/30 bg-cyan-500/20 px-2 py-1 text-xs text-cyan-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white hover:opacity-90"
            asChild
          >
            <Link href={ROUTES.TEMPLATES}>Ver Todos os Templates</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
