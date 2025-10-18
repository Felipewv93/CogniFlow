import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// DeepSeek API - Compatível com OpenAI SDK
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.DEEPSEEK_API_KEY 
    ? 'https://api.deepseek.com'
    : 'https://api.openai.com/v1',
});

// Modo DEMO - Mude para false quando tiver a API key
const DEMO_MODE = !process.env.DEEPSEEK_API_KEY && !process.env.OPENAI_API_KEY;

// Função para gerar respostas contextuais e personalizadas
function generateContextualResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  // Detecção de contexto
  const isGreeting = msg.includes('olá') || msg.includes('oi') || msg.includes('ei') || msg.includes('hey');
  const isQuestion = msg.includes('?') || msg.includes('como') || msg.includes('qual') || msg.includes('quando') || msg.includes('por que');
  const isIdea = msg.includes('ideia') || msg.includes('criar') || msg.includes('desenvolver') || msg.includes('projeto');
  const isHelp = msg.includes('ajuda') || msg.includes('preciso') || msg.includes('pode') || msg.includes('consegue');
  const isApp = msg.includes('app') || msg.includes('aplicativo') || msg.includes('sistema');
  const isBusiness = msg.includes('negócio') || msg.includes('startup') || msg.includes('empresa') || msg.includes('vender');
  const isMarketing = msg.includes('marketing') || msg.includes('divulgar') || msg.includes('vender') || msg.includes('cliente');
  const isTech = msg.includes('tecnologia') || msg.includes('código') || msg.includes('desenvolver') || msg.includes('programa');
  
  // Respostas contextuais baseadas no que o usuário disse
  if (isGreeting) {
    return '👋 Olá! É ótimo ter você aqui! Sou o Assistente Cogniflow, especialista em transformar ideias em realidade.\n\nComo posso ajudar você hoje? Está trabalhando em algum projeto específico ou quer explorar novas ideias?';
  }
  
  if (isIdea && isApp) {
    return '💡 Apps são incríveis! Vamos pensar estrategicamente:\n\n**Questões importantes:**\n• Qual problema específico seu app resolve?\n• Quem é seu usuário ideal?\n• O que torna seu app único vs. alternativas?\n\n**Sugestões iniciais:**\n1. Comece com um MVP ultra-focado\n2. Valide com 10-20 usuários reais antes de escalar\n3. Considere uma landing page para capturar interesse\n\nConte-me mais sobre sua ideia de app! Qual é o conceito central?';
  }
  
  if (isIdea && isBusiness) {
    return '🚀 Adorei o entusiasmo empreendedor! Negócios de sucesso nascem da validação constante.\n\n**Framework para você:**\n\n**1. Problema → Solução**\nDefina claramente o problema que resolve e para quem\n\n**2. Modelo de Receita**\nComo você vai monetizar? (assinatura, comissão, marketplace)\n\n**3. Validação Rápida**\nVenda antes de construir - teste a demanda real\n\n**4. Métricas Importantes**\n• CAC (Custo de Aquisição)\n• LTV (Valor do Cliente)\n• Margem de contribuição\n\nQual aspecto do seu negócio você quer explorar primeiro?';
  }
  
  if (isIdea && isMarketing) {
    return '📢 Marketing eficaz é sobre estar onde seu cliente está!\n\n**Estratégias que funcionam:**\n\n**1. Marketing de Conteúdo**\n• Blog posts otimizados para SEO\n• Vídeos educacionais no YouTube\n• Posts engajadores no LinkedIn\n\n**2. Growth Hacking**\n• Loops virais de indicação\n• Parcerias estratégicas\n• Community building\n\n**3. Paid Ads (quando validado)**\n• Começar com €5-10/dia\n• Testar múltiplas variações\n• Focar em conversão, não apenas cliques\n\n**Pergunta crucial:** Onde seu público-alvo passa tempo online? Instagram? LinkedIn? TikTok?';
  }
  
  if (isHelp && isTech) {
    return '⚙️ Tecnologia é meu forte! Vamos escolher o caminho certo.\n\n**Stack Recomendado (2025):**\n\n**Frontend:**\n• Next.js 14 (React) - SEO + Performance\n• TypeScript - Menos bugs, mais produtividade\n• Tailwind CSS - UI rápido e consistente\n\n**Backend:**\n• Node.js + Express ou Next.js API Routes\n• PostgreSQL (dados estruturados) ou MongoDB (flexível)\n• Supabase (backend-as-a-service)\n\n**Deploy:**\n• Vercel (frontend) - grátis para começar\n• Railway/Render (backend) - tier gratuito\n\n**Qual parte técnica você quer discutir? Arquitetura? Database? APIs?**';
  }
  
  if (isQuestion && (msg.includes('começar') || msg.includes('iniciar') || msg.includes('start'))) {
    return '🎯 Começar é o mais importante! Aqui está seu plano de ação:\n\n**Fase 1: Clareza (Semana 1)**\n✓ Escreva sua ideia em 1 parágrafo\n✓ Liste 3 problemas que ela resolve\n✓ Defina quem são seus primeiros 10 usuários\n\n**Fase 2: Validação (Semana 2-3)**\n✓ Converse com 20 pessoas do público-alvo\n✓ Crie uma landing page simples\n✓ Teste se pagariam pelo que você propõe\n\n**Fase 3: MVP (Semana 4-8)**\n✓ Construa a versão mais simples que resolve o problema\n✓ Lance para os early adopters\n✓ Colete feedback brutal e honesto\n\n**Próximo passo:** Descreva sua ideia em 2-3 frases. Vou te ajudar a refinar!';
  }
  
  if (msg.includes('obrigado') || msg.includes('valeu') || msg.includes('ajudou')) {
    return '😊 Fico feliz em ajudar! Estou aqui para isso.\n\n**Lembre-se:**\n• Ação > Perfeição\n• Feedback rápido > Planejamento eterno\n• Aprender fazendo > Estudar teoria\n\n**Posso te ajudar com mais alguma coisa?** Brainstorm? Estratégia? Técnica? Ou quer explorar uma nova direção?';
  }
  
  // Respostas genéricas mas úteis
  const genericResponses = [
    `Interessante perspectiva! Vamos aprofundar nisso.\n\n**Algumas perguntas para refinarmos:**\n• Qual o impacto que você quer causar?\n• Quem mais está tentando resolver isso?\n• O que torna sua abordagem única?\n\nMe conte mais detalhes!`,
    
    `Ótimo ponto! Aqui está como eu pensaria sobre isso:\n\n**1. Valide a Premissa**\nCertifique-se que o problema realmente existe\n\n**2. Comece Pequeno**\nMVP focado em uma feature killer\n\n**3. Itere Rápido**\nSemanas, não meses, entre versões\n\n**Qual dessas etapas você quer explorar mais?**`,
    
    `Vejo potencial aqui! Deixa eu te dar alguns insights:\n\n**Oportunidades:**\n✓ Mercado em crescimento\n✓ Demanda por soluções inovadoras\n✓ Tecnologia acessível para implementar\n\n**Desafios:**\n⚠ Competição estabelecida\n⚠ Aquisição de usuários iniciais\n⚠ Monetização sustentável\n\n**Como você pensa em diferenciação?**`,
    
    `Excelente! Aqui estão 3 caminhos que você pode seguir:\n\n**Opção A: Rápido e Direto**\nNo-code tools + landing page + validação em 2 semanas\n\n**Opção B: Estruturado**\nMVP técnico + beta fechado + crescimento orgânico\n\n**Opção C: Ambicioso**\nProduto completo + investimento + go-to-market agressivo\n\n**Qual se alinha melhor com seus recursos e momento de vida?**`,
    
    `💭 Pensando junto com você... Algumas ideias:\n\n• **Ângulo 1:** Foco em nicho específico primeiro\n• **Ângulo 2:** Resolva um problema seu próprio\n• **Ângulo 3:** Combine duas ideias existentes de forma nova\n\n**Exemplo real:** Instagram = Fotos + Social (ambos existentes)\n\nQue tipo de combinação faz sentido para você?`,
  ];
  
  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Mensagens são obrigatórias' },
        { status: 400 }
      );
    }

    // MODO DEMO - Respostas contextuais e personalizadas
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400)); // Delay variável realista
      
      const lastMessage = messages[messages.length - 1];
      const contextualResponse = generateContextualResponse(lastMessage.content);
      
      return NextResponse.json({
        message: contextualResponse,
        role: 'assistant',
      });
    }

    const systemMessage = {
      role: 'system' as const,
      content: `Você é o Assistente Cogniflow, um especialista em criatividade e inovação.
Você ajuda pessoas a desenvolver ideias, fazer brainstorming, resolver problemas criativos e planejar projetos.

Seu estilo é:
- Amigável e encorajador
- Criativo e inspirador
- Prático e orientado a ações
- Faz perguntas para entender melhor as necessidades
- Fornece exemplos concretos
- Sugere próximos passos claros

Sempre que possível:
1. Faça perguntas para entender o contexto
2. Ofereça múltiplas perspectivas
3. Sugira recursos ou referências úteis
4. Divida problemas complexos em etapas menores
5. Celebre progressos e ideias do usuário`,
    };

    const completion = await client.chat.completions.create({
      model: process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-4o',
      messages: [systemMessage, ...messages],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const assistantMessage = completion.choices[0].message;

    return NextResponse.json({
      message: assistantMessage.content,
      role: assistantMessage.role,
    });
  } catch (error: any) {
    console.error('Erro no chat:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao processar mensagem' },
      { status: 500 }
    );
  }
}
