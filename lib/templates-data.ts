export interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  required: boolean;
}

export interface TemplateData {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  objective: string;
  target_audience: string;
  fields: TemplateField[];
  content_template: string;
  is_public: boolean;
  created_at: string;
}

export const TEMPLATES_DATA: TemplateData[] = [
  {
    id: '1',
    title: 'Brief de Design de App',
    description: 'Estrutura completa para briefing de design de aplicativo',
    category: 'design',
    tags: ['design', 'app', 'brief'],
    objective: 'Estrutura completa para briefing de design de aplicativo',
    target_audience: 'Usuários de figma',
    fields: [
      {
        id: 'nome_app',
        label: 'Nome App',
        placeholder: 'Nome do aplicativo',
        type: 'text',
        required: true,
      },
      {
        id: 'objetivo_principal',
        label: 'Objetivo Principal',
        placeholder: 'O que o app deve alcançar?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'persona_detalhada',
        label: 'Persona Detalhada',
        placeholder: 'Quem vai usar?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'funcionalidade_1',
        label: 'Funcionalidade 1',
        placeholder: 'Feature principal #1',
        type: 'text',
        required: true,
      },
      {
        id: 'funcionalidade_2',
        label: 'Funcionalidade 2',
        placeholder: 'Feature principal #2',
        type: 'text',
        required: false,
      },
      {
        id: 'funcionalidade_3',
        label: 'Funcionalidade 3',
        placeholder: 'Feature principal #3',
        type: 'text',
        required: false,
      },
      {
        id: 'apps_inspiracao',
        label: 'Referências Visuais',
        placeholder: 'Apps de inspiração',
        type: 'textarea',
        required: false,
      },
      {
        id: 'cores_preferidas',
        label: 'Paleta de Cores',
        placeholder: 'Cores preferidas',
        type: 'text',
        required: false,
      },
    ],
    content_template: `# Design Brief: {{nome_app}}

## Objetivo
{{objetivo_principal}}

## Público-Alvo
{{persona_detalhada}}

## Funcionalidades Principais
{{funcionalidade_1}}
{{funcionalidade_2}}
{{funcionalidade_3}}

## Referências Visuais
{{apps_inspiracao}}

## Paleta de Cores
{{cores_preferidas}}`,
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Pitch de Startup',
    description: 'Template completo para criar seu pitch deck de startup',
    category: 'startup',
    tags: ['pitch', 'investimento', 'startup'],
    objective: 'Criar um pitch deck completo para investidores',
    target_audience: 'Empreendedores e fundadores',
    fields: [
      {
        id: 'nome_startup',
        label: 'Nome da Startup',
        placeholder: 'Nome da sua startup',
        type: 'text',
        required: true,
      },
      {
        id: 'problema',
        label: 'Problema',
        placeholder: 'Qual problema você está resolvendo?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'solucao',
        label: 'Solução',
        placeholder: 'Como você resolve esse problema?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'mercado',
        label: 'Tamanho do Mercado',
        placeholder: 'TAM, SAM, SOM',
        type: 'textarea',
        required: true,
      },
      {
        id: 'modelo_receita',
        label: 'Modelo de Receita',
        placeholder: 'Como você vai ganhar dinheiro?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'tracao',
        label: 'Tração Atual',
        placeholder: 'Métricas, usuários, receita',
        type: 'textarea',
        required: false,
      },
      {
        id: 'investimento',
        label: 'Investimento Buscado',
        placeholder: 'Quanto você está levantando?',
        type: 'text',
        required: true,
      },
    ],
    content_template: `# Pitch Deck: {{nome_startup}}

## 🎯 Problema
{{problema}}

## 💡 Solução
{{solucao}}

## 📊 Mercado
{{mercado}}

## 💰 Modelo de Receita
{{modelo_receita}}

## 📈 Tração
{{tracao}}

## 🚀 Investimento
{{investimento}}`,
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Planejamento de Produto',
    description: 'Estrutura para planejar features de produto e definir MVP',
    category: 'feature',
    tags: ['produto', 'mvp', 'roadmap'],
    objective: 'Planejar desenvolvimento de produto',
    target_audience: 'Product Managers e Founders',
    fields: [
      {
        id: 'nome_produto',
        label: 'Nome do Produto',
        placeholder: 'Nome do seu produto',
        type: 'text',
        required: true,
      },
      {
        id: 'visao',
        label: 'Visão do Produto',
        placeholder: 'Onde você quer chegar?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'usuarios',
        label: 'Usuários Alvo',
        placeholder: 'Quem vai usar?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'feature_1',
        label: 'Feature 1 (MVP)',
        placeholder: 'Feature essencial #1',
        type: 'text',
        required: true,
      },
      {
        id: 'feature_2',
        label: 'Feature 2 (MVP)',
        placeholder: 'Feature essencial #2',
        type: 'text',
        required: true,
      },
      {
        id: 'feature_3',
        label: 'Feature 3 (Futuro)',
        placeholder: 'Feature futura',
        type: 'text',
        required: false,
      },
      {
        id: 'metricas',
        label: 'Métricas de Sucesso',
        placeholder: 'Como você vai medir sucesso?',
        type: 'textarea',
        required: true,
      },
    ],
    content_template: `# Planejamento de Produto: {{nome_produto}}

## 🎯 Visão
{{visao}}

## 👥 Usuários Alvo
{{usuarios}}

## 🚀 MVP (Versão 1)
- {{feature_1}}
- {{feature_2}}

## 🔮 Roadmap Futuro
- {{feature_3}}

## 📊 Métricas de Sucesso
{{metricas}}`,
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Estratégia de Marketing',
    description: 'Framework para criar estratégia de marketing digital completa',
    category: 'marketing',
    tags: ['marketing', 'digital', 'estratégia'],
    objective: 'Criar estratégia de marketing completa',
    target_audience: 'Profissionais de marketing',
    fields: [
      {
        id: 'empresa',
        label: 'Nome da Empresa',
        placeholder: 'Nome da empresa/produto',
        type: 'text',
        required: true,
      },
      {
        id: 'objetivo_marketing',
        label: 'Objetivo de Marketing',
        placeholder: 'O que você quer alcançar?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'persona',
        label: 'Persona Principal',
        placeholder: 'Descreva sua persona',
        type: 'textarea',
        required: true,
      },
      {
        id: 'canais',
        label: 'Canais Prioritários',
        placeholder: 'Instagram, LinkedIn, Google Ads...',
        type: 'textarea',
        required: true,
      },
      {
        id: 'orcamento',
        label: 'Orçamento Mensal',
        placeholder: 'Quanto você pode investir?',
        type: 'text',
        required: false,
      },
      {
        id: 'kpis',
        label: 'KPIs Principais',
        placeholder: 'CAC, LTV, Taxa de Conversão...',
        type: 'textarea',
        required: true,
      },
    ],
    content_template: `# Estratégia de Marketing: {{empresa}}

## 🎯 Objetivo
{{objetivo_marketing}}

## 👤 Persona
{{persona}}

## 📢 Canais de Aquisição
{{canais}}

## 💰 Orçamento
{{orcamento}}

## 📊 KPIs
{{kpis}}`,
    is_public: true,
    created_at: new Date().toISOString(),
  },
];
