'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/utils/constants';

export function CTA() {
  return (
    <section className="section-spacing">
      <div className="container-padding mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyber-blue via-cyber-cyan to-cyber-neon p-12 text-center">
          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Pronto para Desbloquear Sua Criatividade?
            </h2>
            <p className="mb-8 text-lg text-white/90">
              Junte-se a milhares de criadores que já transformaram suas ideias em realidade.
            </p>
            <Button size="lg" variant="secondary" asChild className="group">
              <Link href={ROUTES.AUTH.SIGNUP}>
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
