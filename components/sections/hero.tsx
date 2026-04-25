'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Wand2, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/utils/constants';

export function Hero() {
  return (
    <section className="section-spacing cyber-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-blue/5 via-transparent to-transparent" />

      <div className="container-padding relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-flex items-center rounded-full border border-cyber-cyan/20 bg-cyber-cyan/10 px-4 py-2 text-sm text-cyber-cyan"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Potencialize sua criatividade com IA
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Desbloqueie Sua <span className="gradient-text">Criatividade Oculta</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8 text-lg text-muted-foreground sm:text-xl"
          >
            Plataforma SaaS de inteligência criativa que ajuda você a estruturar ideias, gerar
            prompts e conectar conceitos para ferramentas como Lovable, Notion e Figma.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" variant="cyber" asChild className="group">
              <Link href={ROUTES.AUTH.SIGNUP}>
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={ROUTES.TEMPLATES}>Explorar Templates</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-1">
              <Gift className="h-4 w-4" />
              Sem necessidade de cartão de crédito
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              Templates ilimitados
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-1">
              <Wand2 className="h-4 w-4" />
              IA integrada
            </span>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute left-10 top-1/4 h-72 w-72 rounded-full bg-cyber-blue/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-10 h-72 w-72 rounded-full bg-cyber-cyan/10 blur-3xl" />
      </div>
    </section>
  );
}
