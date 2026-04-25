'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Zap, Share2, Brain, Layers, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Brain,
    title: 'Gerador de Ideias IA',
    description: 'Gere ideias criativas automaticamente com inteligência artificial avançada.',
  },
  {
    icon: Layers,
    title: 'Biblioteca de Templates',
    description: 'Acesse centenas de templates prontos para diversos nichos e projetos.',
  },
  {
    icon: Share2,
    title: 'Exportação Integrada',
    description: 'Exporte suas ideias direto para Lovable, Notion, Figma e outras ferramentas.',
  },
  {
    icon: Zap,
    title: 'Assistente Inteligente',
    description: 'Chat com IA que refina e expande suas ideias em tempo real.',
  },
  {
    icon: Sparkles,
    title: 'Prompts Otimizados',
    description: 'Receba prompts estruturados e otimizados para máxima eficiência.',
  },
  {
    icon: Rocket,
    title: 'Dashboard Poderoso',
    description: 'Gerencie todas suas ideias e projetos em um só lugar.',
  },
];

export function Features() {
  return (
    <section className="section-spacing bg-muted/50">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Tudo que você precisa para <span className="gradient-text">criar sem limites</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Ferramentas poderosas para transformar suas ideias em realidade
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full transition-all hover:border-cyber-cyan/50 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyber-blue to-cyber-cyan">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
