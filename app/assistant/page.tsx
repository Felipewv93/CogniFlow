'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Loader2, Trash2, Plus, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/navbar';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/supabase/client';
import { UI_MESSAGES } from '@/utils/constants';

// Função para formatar markdown para JSX
function formatMarkdown(text: string) {
  // Remove TODOS os asteriscos do texto primeiro
  const cleanText = text.replace(/\*/g, '');

  const lines = cleanText.split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Linha vazia
    if (line.trim() === '') {
      elements.push(<br key={key++} />);
      continue;
    }

    // Título com ":" no final (ex: "Como posso te ajudar:")
    if (line.includes(':') && !line.match(/^[•✓\d]/)) {
      elements.push(
        <div key={key++} className="mb-1 mt-3 font-bold text-foreground">
          {line}
        </div>
      );
      continue;
    }

    // Lista com bullet • ou ✓
    if (line.match(/^[•✓]/)) {
      elements.push(
        <div key={key++} className="mb-1 ml-4">
          {line}
        </div>
      );
      continue;
    }

    // Lista numerada
    if (line.match(/^\d+\./)) {
      elements.push(
        <div key={key++} className="mb-1 ml-4">
          {line}
        </div>
      );
      continue;
    }

    // Texto normal
    elements.push(
      <div key={key++} className="mb-1">
        {line}
      </div>
    );
  }

  return elements;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
  user_id?: string;
}

export default function AssistantPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Olá! 👋 Sou o Assistente Cogniflow. Como posso ajudar você a desenvolver suas ideias hoje?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Carregar conversas do Supabase ao montar (apenas se logado)
  useEffect(() => {
    if (user) {
      loadConversationsFromDB();
    }
  }, [user]);

  const loadConversationsFromDB = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setConversations(data);
      }
    } catch (error: any) {
      console.error('Erro ao carregar conversas:', error);
      toast.error('Erro ao carregar conversas');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar mensagem');
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
        },
      ]);
    } catch (error: any) {
      console.error('Erro no chat:', error);
      toast.error(UI_MESSAGES.CHAT_SEND_ERROR);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([
      {
        role: 'assistant',
        content:
          'Olá! 👋 Sou o Assistente Cogniflow. Como posso ajudar você a desenvolver suas ideias hoje?',
      },
    ]);
  };

  const saveCurrentConversation = async () => {
    if (!user) {
      toast.error('Faça login para salvar conversas');
      return;
    }

    if (messages.length <= 1) return;

    const title = messages[1]?.content.slice(0, 50) + '...' || 'Nova conversa';

    try {
      if (currentConversationId) {
        // Atualizar conversa existente
        const { error } = await supabase
          .from('conversations')
          .update({
            title,
            messages,
          })
          .eq('id', currentConversationId)
          .eq('user_id', user.id);

        if (error) throw error;

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === currentConversationId ? { ...conv, messages, title } : conv
          )
        );
      } else {
        // Criar nova conversa
        const { data, error } = await supabase
          .from('conversations')
          .insert({
            title,
            messages,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setConversations((prev) => [data, ...prev]);
          setCurrentConversationId(data.id);
        }
      }

      toast.success('Conversa salva!');
    } catch (error: any) {
      console.error('Erro ao salvar conversa:', error);
      toast.error('Erro ao salvar conversa');
    }
  };

  const loadConversation = (conv: Conversation) => {
    setCurrentConversationId(conv.id);
    setMessages(conv.messages);
  };

  const deleteConversation = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setConversations((prev) => prev.filter((conv) => conv.id !== id));
      if (currentConversationId === id) {
        startNewConversation();
      }
      toast.success('Conversa excluída');
    } catch (error: any) {
      console.error('Erro ao excluir conversa:', error);
      toast.error('Erro ao excluir conversa');
    }
  };

  const clearChat = () => {
    startNewConversation();
    toast.success('Chat limpo com sucesso');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        {/* Sidebar - Conversas */}
        <div className="flex w-72 flex-col border-r bg-card/50">
          {/* Sidebar Header */}
          <div className="border-b p-4">
            <button
              onClick={startNewConversation}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyber-blue to-cyber-cyan px-4 py-3 font-semibold text-white transition hover:opacity-90"
            >
              <Plus className="h-5 w-5" />
              Nova Conversa
            </button>
          </div>

          {/* Lista de Conversas */}
          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Conversas
            </h3>
            {!user ? (
              <div className="py-8 text-center">
                <p className="mb-2 text-sm text-muted-foreground">
                  Faça login para salvar suas conversas
                </p>
              </div>
            ) : conversations.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhuma conversa salva
              </p>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`group cursor-pointer rounded-lg border p-3 transition ${
                    currentConversationId === conv.id
                      ? 'border-cyber-blue bg-muted'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => loadConversation(conv)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <p className="truncate text-sm font-medium">{conv.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(conv.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="rounded p-1 opacity-0 transition hover:bg-destructive/10 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="border-b bg-card/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Bot className="h-8 w-8 text-cyber-blue" />
                  <h1 className="text-3xl font-bold">Assistente IA</h1>
                </div>
                <p className="text-muted-foreground">Refine e expanda suas ideias</p>
              </div>
              <div className="flex gap-2">
                {user && (
                  <button
                    onClick={saveCurrentConversation}
                    disabled={messages.length <= 1}
                    className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-muted/50 disabled:opacity-50"
                  >
                    💾 Salvar
                  </button>
                )}
                <button
                  onClick={clearChat}
                  className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition hover:bg-muted/50"
                >
                  <Trash2 className="h-4 w-4" />
                  Limpar
                </button>
              </div>
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex flex-1 flex-col bg-background">
            {/* Chat Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyber-blue to-cyber-cyan">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-cyber-blue to-cyber-cyan text-white'
                        : 'bg-muted/50'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>
                    ) : (
                      <div className="text-sm leading-relaxed">
                        {formatMarkdown(message.content)}
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyber-blue to-cyber-cyan">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-cyber-blue" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 rounded-lg border bg-background px-4 py-3"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyber-blue to-cyber-cyan px-6 py-3 text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                💡 Pressione Enter para enviar, Shift+Enter para nova linha
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
