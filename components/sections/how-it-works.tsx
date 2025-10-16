'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Search, Edit, Share } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: '1. Explore ou Gere',
    description: 'Navegue por templates ou use nossa IA para gerar novas ideias.',
  },
  {
    icon: Edit,
    title: '2. Refine com IA',
    description: 'Use o assistente inteligente para aprimorar e expandir conceitos.',
  },
  {
    icon: Share,
    title: '3. Exporte',
    description: 'Envie suas ideias para suas ferramentas favoritas em um clique.',
  },
];

export function HowItWorks() {
  return (
    <section className="section-spacing">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Como Funciona
          </h2>
          <p className="text-lg text-muted-foreground">
            Três passos simples para transformar ideias em ação
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title} className="text-center">
              <CardContent className="pt-6">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyber-blue to-cyber-cyan">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
