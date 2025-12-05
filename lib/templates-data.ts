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
  {
    id: '5',
    title: 'Sistema de Design',
    description: 'Documentação completa para criar um Design System',
    category: 'design',
    tags: ['design-system', 'componentes', 'ui'],
    objective: 'Criar documentação de design system',
    target_audience: 'Designers e desenvolvedores',
    fields: [
      {
        id: 'nome_sistema',
        label: 'Nome do Design System',
        placeholder: 'Nome do seu sistema',
        type: 'text',
        required: true,
      },
      {
        id: 'principios',
        label: 'Princípios de Design',
        placeholder: 'Quais são os princípios fundamentais?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'cores_primarias',
        label: 'Cores Primárias',
        placeholder: '#000000, #FFFFFF...',
        type: 'text',
        required: true,
      },
      {
        id: 'tipografia',
        label: 'Tipografia',
        placeholder: 'Fontes e tamanhos',
        type: 'textarea',
        required: true,
      },
      {
        id: 'espacamento',
        label: 'Sistema de Espaçamento',
        placeholder: '4px, 8px, 16px...',
        type: 'text',
        required: true,
      },
      {
        id: 'componentes',
        label: 'Componentes Principais',
        placeholder: 'Buttons, Cards, Inputs...',
        type: 'textarea',
        required: true,
      },
    ],
    content_template: `# Design System: {{nome_sistema}}

## 🎨 Princípios de Design
{{principios}}

## 🌈 Paleta de Cores
{{cores_primarias}}

## 📝 Tipografia
{{tipografia}}

## 📏 Espaçamento
{{espacamento}}

## 🧩 Componentes
{{componentes}}`,
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Validação de Startup',
    description: 'Framework para validar sua ideia de negócio antes de construir',
    category: 'startup',
    tags: ['validação', 'lean-startup', 'mvp'],
    objective: 'Validar ideia de negócio',
    target_audience: 'Empreendedores iniciantes',
    fields: [
      {
        id: 'ideia',
        label: 'Ideia de Negócio',
        placeholder: 'Descreva sua ideia em 2-3 frases',
        type: 'textarea',
        required: true,
      },
      {
        id: 'hipotese_problema',
        label: 'Hipótese do Problema',
        placeholder: 'Qual problema você acredita que existe?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'publico_teste',
        label: 'Público para Teste',
        placeholder: 'Quem você vai entrevistar?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'perguntas_validacao',
        label: 'Perguntas de Validação',
        placeholder: 'O que você vai perguntar?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'criterio_sucesso',
        label: 'Critério de Sucesso',
        placeholder: 'Como você vai saber se vale a pena?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'prazo',
        label: 'Prazo de Validação',
        placeholder: '2 semanas, 1 mês...',
        type: 'text',
        required: true,
      },
    ],
    content_template: `# Plano de Validação

## 💡 Ideia
{{ideia}}

## 🎯 Hipótese do Problema
{{hipotese_problema}}

## 👥 Público para Teste
{{publico_teste}}

## ❓ Perguntas de Validação
{{perguntas_validacao}}

## ✅ Critério de Sucesso
{{criterio_sucesso}}

## ⏰ Prazo
{{prazo}}`,
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Especificação de Feature',
    description: 'Documento técnico para especificar nova funcionalidade',
    category: 'feature',
    tags: ['specs', 'desenvolvimento', 'feature'],
    objective: 'Especificar feature para desenvolvimento',
    target_audience: 'PMs e desenvolvedores',
    fields: [
      {
        id: 'nome_feature',
        label: 'Nome da Feature',
        placeholder: 'Nome da funcionalidade',
        type: 'text',
        required: true,
      },
      {
        id: 'contexto',
        label: 'Contexto',
        placeholder: 'Por que precisamos dessa feature?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'user_story',
        label: 'User Story',
        placeholder: 'Como [persona], eu quero [ação] para [benefício]',
        type: 'textarea',
        required: true,
      },
      {
        id: 'criterios_aceitacao',
        label: 'Critérios de Aceitação',
        placeholder: 'O que deve funcionar?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'casos_borda',
        label: 'Casos de Borda',
        placeholder: 'E se...?',
        type: 'textarea',
        required: false,
      },
      {
        id: 'impacto_tecnico',
        label: 'Impacto Técnico',
        placeholder: 'Complexidade, dependências...',
        type: 'textarea',
        required: true,
      },
    ],
    content_template: `# Especificação: {{nome_feature}}

## 📋 Contexto
{{contexto}}

## 👤 User Story
{{user_story}}

## ✅ Critérios de Aceitação
{{criterios_aceitacao}}

## ⚠️ Casos de Borda
{{casos_borda}}

## 🔧 Impacto Técnico
{{impacto_tecnico}}`,
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Campanha de Conteúdo',
    description: 'Planejamento de campanha de marketing de conteúdo',
    category: 'content',
    tags: ['conteúdo', 'blog', 'seo'],
    objective: 'Planejar campanha de conteúdo',
    target_audience: 'Content marketers',
    fields: [
      {
        id: 'tema_campanha',
        label: 'Tema da Campanha',
        placeholder: 'Qual o tema central?',
        type: 'text',
        required: true,
      },
      {
        id: 'objetivo_conteudo',
        label: 'Objetivo',
        placeholder: 'Gerar leads, educar, engajar...',
        type: 'textarea',
        required: true,
      },
      {
        id: 'publico_alvo',
        label: 'Público-Alvo',
        placeholder: 'Para quem é o conteúdo?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'formatos',
        label: 'Formatos de Conteúdo',
        placeholder: 'Blog posts, vídeos, infográficos...',
        type: 'textarea',
        required: true,
      },
      {
        id: 'palavras_chave',
        label: 'Palavras-Chave',
        placeholder: 'SEO keywords',
        type: 'textarea',
        required: true,
      },
      {
        id: 'distribuicao',
        label: 'Canais de Distribuição',
        placeholder: 'Onde será publicado?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'cronograma',
        label: 'Cronograma',
        placeholder: 'Timeline de publicação',
        type: 'textarea',
        required: true,
      },
    ],
    content_template: `# Campanha de Conteúdo: {{tema_campanha}}

## 🎯 Objetivo
{{objetivo_conteudo}}

## 👥 Público-Alvo
{{publico_alvo}}

## 📝 Formatos
{{formatos}}

## 🔍 Palavras-Chave
{{palavras_chave}}

## 📢 Distribuição
{{distribuicao}}

## 📅 Cronograma
{{cronograma}}`,
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    title: 'Copywriting de Vendas',
    description: 'Framework para escrever copy persuasiva que vende',
    category: 'content',
    tags: ['copywriting', 'vendas', 'conversão'],
    objective: 'Criar copy de vendas',
    target_audience: 'Copywriters e marqueteiros',
    fields: [
      {
        id: 'produto_servico',
        label: 'Produto/Serviço',
        placeholder: 'O que você está vendendo?',
        type: 'text',
        required: true,
      },
      {
        id: 'dor_principal',
        label: 'Dor Principal',
        placeholder: 'Qual a maior dor do cliente?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'beneficio_transformacao',
        label: 'Transformação Prometida',
        placeholder: 'O que muda na vida do cliente?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'prova_social',
        label: 'Prova Social',
        placeholder: 'Depoimentos, números, cases...',
        type: 'textarea',
        required: true,
      },
      {
        id: 'objecoes',
        label: 'Objeções Comuns',
        placeholder: 'Por que não comprar?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'cta',
        label: 'Call to Action',
        placeholder: 'Qual a ação desejada?',
        type: 'text',
        required: true,
      },
      {
        id: 'urgencia',
        label: 'Gatilho de Urgência',
        placeholder: 'Por que comprar agora?',
        type: 'text',
        required: false,
      },
    ],
    content_template: `# Copy de Vendas: {{produto_servico}}

## 😰 Problema (DOR)
{{dor_principal}}

## ✨ Transformação
{{beneficio_transformacao}}

## 💬 Prova Social
{{prova_social}}

## ❌ Objeções
{{objecoes}}

## 🚀 Call to Action
{{cta}}

## ⏰ Urgência
{{urgencia}}`,
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '10',
    title: 'Lançamento de Produto',
    description: 'Estratégia completa para lançar produto no mercado',
    category: 'marketing',
    tags: ['lançamento', 'go-to-market', 'produto'],
    objective: 'Planejar lançamento de produto',
    target_audience: 'Product marketers',
    fields: [
      {
        id: 'nome_produto_lancamento',
        label: 'Nome do Produto',
        placeholder: 'Produto a ser lançado',
        type: 'text',
        required: true,
      },
      {
        id: 'proposta_valor',
        label: 'Proposta de Valor',
        placeholder: 'Por que as pessoas devem se importar?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'segmento_inicial',
        label: 'Segmento Inicial',
        placeholder: 'Quem são os early adopters?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'estrategia_pre_lancamento',
        label: 'Pré-Lançamento',
        placeholder: 'O que fazer antes do lançamento?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'dia_lancamento',
        label: 'Dia do Lançamento',
        placeholder: 'Ações do dia D',
        type: 'textarea',
        required: true,
      },
      {
        id: 'pos_lancamento',
        label: 'Pós-Lançamento',
        placeholder: 'Como manter o momentum?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'meta_lancamento',
        label: 'Meta do Lançamento',
        placeholder: 'Usuários, vendas, leads...',
        type: 'text',
        required: true,
      },
    ],
    content_template: `# Plano de Lançamento: {{nome_produto_lancamento}}

## 💎 Proposta de Valor
{{proposta_valor}}

## 🎯 Segmento Inicial
{{segmento_inicial}}

## 📢 Pré-Lançamento
{{estrategia_pre_lancamento}}

## 🚀 Dia do Lançamento
{{dia_lancamento}}

## 📈 Pós-Lançamento
{{pos_lancamento}}

## 🎯 Meta
{{meta_lancamento}}`,
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '11',
    title: 'Plano de Negócios Lean',
    description: 'Modelo simplificado de plano de negócios em 1 página',
    category: 'business',
    tags: ['business-plan', 'negócios', 'estratégia'],
    objective: 'Criar plano de negócios enxuto',
    target_audience: 'Empreendedores',
    fields: [
      {
        id: 'nome_negocio',
        label: 'Nome do Negócio',
        placeholder: 'Nome da empresa',
        type: 'text',
        required: true,
      },
      {
        id: 'proposta_valor_negocio',
        label: 'Proposta de Valor',
        placeholder: 'O que você oferece de único?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'segmento_clientes',
        label: 'Segmento de Clientes',
        placeholder: 'Quem são seus clientes?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'canais_venda',
        label: 'Canais de Venda',
        placeholder: 'Como você vai vender?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'fontes_receita',
        label: 'Fontes de Receita',
        placeholder: 'Como você ganha dinheiro?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'custos_principais',
        label: 'Custos Principais',
        placeholder: 'Quais são os custos fixos e variáveis?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'vantagem_competitiva',
        label: 'Vantagem Competitiva',
        placeholder: 'Por que você vai vencer?',
        type: 'textarea',
        required: true,
      },
    ],
    content_template: `# Plano de Negócios: {{nome_negocio}}

## 💎 Proposta de Valor
{{proposta_valor_negocio}}

## 👥 Segmento de Clientes
{{segmento_clientes}}

## 📢 Canais de Venda
{{canais_venda}}

## 💰 Fontes de Receita
{{fontes_receita}}

## 💸 Custos Principais
{{custos_principais}}

## 🏆 Vantagem Competitiva
{{vantagem_competitiva}}`,
    is_public: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '12',
    title: 'Análise de Concorrência',
    description: 'Framework para mapear e analisar concorrentes',
    category: 'business',
    tags: ['análise', 'competição', 'mercado'],
    objective: 'Analisar concorrência do mercado',
    target_audience: 'Estrategistas de negócio',
    fields: [
      {
        id: 'mercado_analise',
        label: 'Mercado/Nicho',
        placeholder: 'Qual mercado você está analisando?',
        type: 'text',
        required: true,
      },
      {
        id: 'concorrente_1',
        label: 'Concorrente Principal #1',
        placeholder: 'Nome e análise',
        type: 'textarea',
        required: true,
      },
      {
        id: 'concorrente_2',
        label: 'Concorrente Principal #2',
        placeholder: 'Nome e análise',
        type: 'textarea',
        required: true,
      },
      {
        id: 'concorrente_3',
        label: 'Concorrente Principal #3',
        placeholder: 'Nome e análise',
        type: 'textarea',
        required: false,
      },
      {
        id: 'pontos_fortes_mercado',
        label: 'Pontos Fortes do Mercado',
        placeholder: 'O que eles fazem bem?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'gaps_oportunidades',
        label: 'Gaps e Oportunidades',
        placeholder: 'O que está faltando?',
        type: 'textarea',
        required: true,
      },
      {
        id: 'diferenciacao',
        label: 'Sua Diferenciação',
        placeholder: 'Como você se destaca?',
        type: 'textarea',
        required: true,
      },
    ],
    content_template: `# Análise de Concorrência: {{mercado_analise}}

## 🏢 Concorrente #1
{{concorrente_1}}

## 🏢 Concorrente #2
{{concorrente_2}}

## 🏢 Concorrente #3
{{concorrente_3}}

## ✅ Pontos Fortes do Mercado
{{pontos_fortes_mercado}}

## 💡 Gaps e Oportunidades
{{gaps_oportunidades}}

## 🎯 Nossa Diferenciação
{{diferenciacao}}`,
    is_public: true,
    created_at: new Date().toISOString(),
  },
];
