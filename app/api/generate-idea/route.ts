import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Modo DEMO - Mude para false quando tiver a API key
const DEMO_MODE = !process.env.DEEPSEEK_API_KEY && !process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { prompt, category, tone } = await request.json();

    console.log('💡 Generate Idea API - Prompt:', prompt?.substring(0, 50));

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt é obrigatório' },
        { status: 400 }
      );
    }

    // MODO DEMO - Retorna ideias personalizadas baseadas no prompt
    if (DEMO_MODE) {
      console.log('🎭 Modo DEMO ativo');
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simula delay da API
      
      // Detecta palavras-chave para personalizar as ideias
      const keywords = prompt.toLowerCase();
      const isApp = keywords.includes('app') || keywords.includes('aplicativo');
      const isBusiness = keywords.includes('negócio') || keywords.includes('startup') || keywords.includes('empresa');
      const isContent = keywords.includes('conteúdo') || keywords.includes('blog') || keywords.includes('social');
      
      // Gera ideias específicas baseadas no contexto
      const ideas = [];
      
      // Ideia 1 - Abordagem Inovadora
      ideas.push({
        title: isApp 
          ? `${prompt} com Experiência Gamificada`
          : isBusiness
          ? `${prompt} com Modelo de Assinatura Recorrente`
          : isContent
          ? `${prompt} com Inteligência de Distribuição`
          : `${prompt} com Personalização Avançada`,
        description: isApp
          ? `Transforme ${prompt.toLowerCase()} em uma experiência viciante através de gamificação inteligente. Cada ação do usuário gera pontos, desbloqueios e conquistas, criando um loop de engajamento contínuo.\n\nA interface utiliza micro-interações e animações fluidas que tornam cada tarefa satisfatória. Com sistema de níveis progressivos e recompensas personalizadas, os usuários são motivados a retornar diariamente. ${category ? `Especialmente otimizado para ${category}.` : 'Design responsivo e acessível em todas as plataformas.'}`
          : isBusiness
          ? `Desenvolva ${prompt.toLowerCase()} com um modelo de receita recorrente previsível. Três tiers de assinatura (Básico, Pro, Enterprise) atendem diferentes perfis de clientes, maximizando o LTV (Lifetime Value).\n\nO freemium permite que usuários testem gratuitamente, com upgrade natural conforme crescem. Sistema de billing automatizado integrado com Stripe/PayPal. ${category ? `Foco em ${category} como mercado principal.` : 'Escalável desde o primeiro dia.'} Retenção através de value delivery contínuo e suporte proativo.`
          : isContent
          ? `Crie ${prompt.toLowerCase()} com um sistema de distribuição multicanal automatizado. Cada conteúdo é otimizado automaticamente para diferentes plataformas (Instagram, TikTok, LinkedIn, YouTube).\n\nIA analisa performance em tempo real e sugere melhores horários de postagem. Sistema de repurposing transforma um conteúdo em múltiplos formatos. ${category ? `Especializado em ${category}.` : 'SEO e viralidade embutidos desde o início.'} Analytics preditivo mostra o que vai performar melhor.`
          : `Implemente ${prompt.toLowerCase()} com personalização baseada em comportamento do usuário. Machine learning identifica padrões de uso e adapta a experiência automaticamente.\n\nCada usuário vê uma versão única da interface, otimizada para suas preferências. A/B testing contínuo melhora conversões em tempo real. ${category ? `Customizado para ${category}.` : 'Integração fácil com ferramentas existentes.'} Dashboard de analytics mostra métricas de personalização.`,
        keyPoints: isApp
          ? [
              'Sistema de pontos e conquistas viciante',
              'Leaderboards sociais para competição amigável',
              'Desafios diários que mudam automaticamente',
              'Notificações inteligentes sem ser invasivo',
              'Recompensas tangíveis (descontos, features exclusivas)',
            ]
          : isBusiness
          ? [
              'Três tiers de preço claramente diferenciados',
              'Trial gratuito de 14 dias sem cartão de crédito',
              'Upsell automático baseado em uso',
              'Churn prevention com alertas preditivos',
              'Customer success proativo para contas enterprise',
            ]
          : isContent
          ? [
              'Publicação agendada em 10+ plataformas simultaneamente',
              'AI que reescreve conteúdo para cada rede social',
              'Biblioteca de templates virais testados',
              'Analytics unificado de todas as plataformas',
              'Sugestões de hashtags e keywords trending',
            ]
          : [
              'Recomendações personalizadas por ML',
              'Interface adaptativa que aprende preferências',
              'A/B testing automático de elementos UI',
              'Segmentação de usuários em micro-nichos',
              'Dashboard com insights acionáveis',
            ],
        nextSteps: isApp
          ? [
              'Definir sistema de pontos e economia do jogo',
              'Criar protótipo das animações principais',
              'Testar com 20-30 beta testers engajados',
              'Iterar baseado em métricas de retenção',
            ]
          : isBusiness
          ? [
              'Calcular CAC e LTV de cada tier',
              'Definir features de cada plano claramente',
              'Criar página de pricing otimizada para conversão',
              'Implementar sistema de billing e invoicing',
            ]
          : isContent
          ? [
              'Integrar APIs das principais redes sociais',
              'Treinar modelo de AI para reescrita',
              'Criar biblioteca de 50+ templates iniciais',
              'Validar com 5-10 creators de conteúdo',
            ]
          : [
              'Mapear jornada do usuário e pontos de personalização',
              'Implementar tracking de eventos granular',
              'Configurar pipeline de ML para recomendações',
              'Testar hipóteses de personalização com A/B tests',
            ],
      });
      
      // Ideia 2 - Abordagem Community-First
      ideas.push({
        title: isApp
          ? `${prompt} com Rede Social Integrada`
          : isBusiness
          ? `${prompt} com Marketplace de Dois Lados`
          : isContent
          ? `${prompt} com Co-criação Comunitária`
          : `${prompt} com Ecossistema de Parceiros`,
        description: isApp
          ? `Adicione uma camada social nativa a ${prompt.toLowerCase()}, transformando usuários em uma comunidade engajada. Feed de atividades, perfis públicos e sistema de seguidores criam network effects poderosos.\n\nUsuários compartilham conquistas, criam grupos de interesse e colaboram em tempo real. ${tone === 'Casual' ? 'Interface descontraída e divertida.' : tone === 'Profissional' ? 'Design clean e focado.' : 'Comunicação inspiradora.'} Sistema de reputação gamificado incentiva contribuições de qualidade. Moderação assistida por IA mantém ambiente saudável.`
          : isBusiness
          ? `Transforme ${prompt.toLowerCase()} em um marketplace bilateral conectando fornecedores e clientes. Modelo de comissão por transação cria alinhamento perfeito de incentivos.\n\nSistema de review e rating garante qualidade. Escrow payment protege ambas as partes. ${category ? `Nicho inicial em ${category} com expansão planejada.` : 'Começar vertical e expandir horizontal.'} Efeito de rede cria moat competitivo. Ferramentas de vendor management facilitam operação em escala.`
          : isContent
          ? `Implemente ${prompt.toLowerCase()} onde a comunidade co-cria o conteúdo principal. Usuários sugerem, votam e colaboram em ideias de conteúdo.\n\nSistema de contribuição distribuída com créditos claros. Curadoria colaborativa garante qualidade. ${category ? `Foco em ${category} como vertical inicial.` : 'Multi-formato desde o início.'} Contributors ganham reconhecimento e benefícios. Modelo de creator economy embutido.`
          : `Desenvolva ${prompt.toLowerCase()} como um ecossistema aberto de parceiros. API pública e programa de desenvolvedores criam extensibilidade infinita.\n\nMarketplace de integrações permite monetização de terceiros. Revenue share incentiva parceiros. ${category ? `Especializado em ${category}.` : 'Integrações nativas com ferramentas populares.'} Certificação de parceiros garante qualidade. Community-driven roadmap prioriza features certas.`,
        keyPoints: isApp
          ? [
              'Feed social com algoritmo de relevância',
              'Grupos privados e públicos auto-organizados',
              'Sistema de mensagens diretas e em grupo',
              'Eventos comunitários e challenges coletivos',
              'Badges e reconhecimento para membros ativos',
            ]
          : isBusiness
          ? [
              'Onboarding fácil para fornecedores e clientes',
              'Sistema de pagamento seguro com escrow',
              'Review e rating bidirecional',
              'Dashboard de performance para vendors',
              'Comissão escalável (começa baixa, cresce com volume)',
            ]
          : isContent
          ? [
              'Sistema de votação para ideias de conteúdo',
              'Ferramentas colaborativas de edição',
              'Créditos automáticos para contribuidores',
              'Curadoria baseada em engajamento',
              'Revenue share para top contributors',
            ]
          : [
              'API RESTful bem documentada',
              'SDK em 5+ linguagens populares',
              'Marketplace de plugins e integrações',
              'Revenue share de 70/30 para parceiros',
              'Programa de certificação e badges',
            ],
        nextSteps: isApp
          ? [
              'Definir features sociais do MVP',
              'Implementar sistema de moderação',
              'Criar programa de community champions',
              'Medir métricas de engajamento social',
            ]
          : isBusiness
          ? [
              'Decidir qual lado do marketplace conquistar primeiro',
              'Definir estrutura de comissões e fees',
              'Implementar sistema de pagamentos e escrow',
              'Criar programa de early suppliers com incentivos',
            ]
          : isContent
          ? [
              'Recrutar 10-20 co-criadores iniciais',
              'Definir processo de submissão e aprovação',
              'Implementar sistema de créditos e atribuição',
              'Criar guidelines de qualidade e branding',
            ]
          : [
              'Documentar API completa com exemplos',
              'Criar SDK para linguagens mais usadas',
              'Lançar programa de early partners',
              'Estabelecer processo de review de integrações',
            ],
      });
      
      // Ideia 3 - Abordagem com IA/Tecnologia Avançada
      ideas.push({
        title: isApp
          ? `${prompt} com Assistente Virtual Inteligente`
          : isBusiness
          ? `${prompt} com Automação Completa via IA`
          : isContent
          ? `${prompt} com Geração de Conteúdo por IA`
          : `${prompt} com Insights Preditivos`,
        description: isApp
          ? `Integre um assistente virtual contextual em ${prompt.toLowerCase()} que entende intenções e antecipa necessidades. NLP avançado permite interação em linguagem natural.\n\nO assistente aprende padrões de uso e oferece sugestões proativas. Automações inteligentes executam tarefas complexas com um comando. ${tone === 'Técnico' ? 'Arquitetura baseada em transformers e embeddings.' : 'Interface conversacional natural.'} Voice commands e chat unificado. Integração com calendários, emails e ferramentas externas.`
          : isBusiness
          ? `Automatize completamente ${prompt.toLowerCase()} usando IA para eliminar trabalho manual. Desde onboarding até operações diárias, a IA gerencia tudo.\n\nCustomer support 24/7 via chatbot inteligente que escalona apenas quando necessário. Processamento automático de documentos e dados. ${category ? `Otimizado para workflows de ${category}.` : 'Workflows customizáveis por setor.'} Decisões baseadas em ML melhoram com o tempo. ROI comprovado em 3-6 meses.`
          : isContent
          ? `Utilize IA generativa para criar ${prompt.toLowerCase()} em escala industrial mantendo qualidade. Sistema gera rascunhos que editores humanos refinam.\n\nPersonalização automática para diferentes audiências e plataformas. Tom de voz configurável e consistente. ${category ? `Especializado em ${category}.` : 'Multi-formato: texto, imagem, vídeo.'} SEO optimization embutida. Fact-checking automático reduz erros. 10x mais conteúdo com mesmo time.`
          : `Adicione camada de inteligência preditiva a ${prompt.toLowerCase()} que antecipa problemas e oportunidades. Machine learning analisa padrões históricos e projeta futuros.\n\nDashboard com forecasting automático de métricas principais. Alertas proativos de anomalias ou tendências. ${category ? `KPIs específicos de ${category}.` : 'Métricas customizáveis por objetivo.'} Recomendações acionáveis baseadas em dados. What-if analysis simula cenários.`,
        keyPoints: isApp
          ? [
              'Assistente com contexto completo do usuário',
              'NLP que entende linguagem natural e gírias',
              'Automações complexas com um comando',
              'Integração com 50+ apps externos',
              'Voice commands em português',
            ]
          : isBusiness
          ? [
              'Automação de 80%+ das tarefas operacionais',
              'Chatbot com 95%+ de resolução automática',
              'RPA para processos repetitivos',
              'Anomaly detection para prevenir problemas',
              'Self-healing systems que se auto-corrigem',
            ]
          : isContent
          ? [
              'Geração de conteúdo em múltiplos formatos',
              'Personalização automática para cada canal',
              'Tom de voz consistente e brandado',
              'SEO keywords e meta tags automáticos',
              'Fact-checking e verificação de sources',
            ]
          : [
              'Forecasting de métricas principais',
              'Detecção de anomalias em tempo real',
              'Recomendações baseadas em ML',
              'Simulações de cenários what-if',
              'Explicabilidade das previsões (XAI)',
            ],
        nextSteps: isApp
          ? [
              'Selecionar plataforma de NLP (OpenAI, Anthropic)',
              'Definir intents e entities principais',
              'Treinar modelo com casos de uso reais',
              'Implementar fallback para assistant humano',
            ]
          : isBusiness
          ? [
              'Mapear todos os processos automatizáveis',
              'Calcular ROI de cada automação',
              'Implementar chatbot com knowledge base',
              'Configurar monitoring e alertas',
            ]
          : isContent
          ? [
              'Definir templates e tom de voz',
              'Integrar API de geração (GPT-4, Claude)',
              'Criar workflow de revisão humana',
              'Estabelecer guidelines de qualidade',
            ]
          : [
              'Identificar métricas para previsão',
              'Coletar dados históricos (mínimo 6 meses)',
              'Treinar modelos preditivos iniciais',
              'Validar accuracy com dados de teste',
            ],
      });
      
      console.log('✅ Ideias geradas com sucesso (DEMO)');
      return NextResponse.json({ ideas });
    }

    // MODO PRODUÇÃO - Usa DeepSeek ou OpenAI (requer API key)
    const systemPrompt = `Você é um assistente criativo especializado em gerar ideias inovadoras e detalhadas. 
Seu objetivo é ajudar pessoas a desenvolver conceitos criativos para projetos, negócios, conteúdo e muito mais.
Seja específico, criativo e forneça ideias práticas e aplicáveis.`;

    const userPrompt = `Gere 3 ideias criativas sobre: ${prompt}
${category ? `Categoria: ${category}` : ''}
${tone ? `Tom: ${tone}` : ''}

Para cada ideia, forneça:
1. Título atraente
2. Descrição detalhada (2-3 parágrafos)
3. Pontos-chave (3-5 itens)
4. Próximos passos sugeridos

Formato de resposta em JSON:
{
  "ideas": [
    {
      "title": "Título da Ideia",
      "description": "Descrição detalhada...",
      "keyPoints": ["Ponto 1", "Ponto 2", "Ponto 3"],
      "nextSteps": ["Passo 1", "Passo 2", "Passo 3"]
    }
  ]
}`;

    // Criar client apenas quando necessário
    const client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
      baseURL: process.env.DEEPSEEK_API_KEY 
        ? 'https://api.deepseek.com'
        : 'https://api.openai.com/v1',
    });

    const completion = await client.chat.completions.create({
      model: process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0].message.content;
    const ideas = JSON.parse(responseContent || '{}');

    return NextResponse.json(ideas);
  } catch (error: any) {
    console.error('Erro ao gerar ideias:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar ideias' },
      { status: 500 }
    );
  }
}
