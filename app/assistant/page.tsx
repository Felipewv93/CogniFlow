export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-padding mx-auto max-w-4xl py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Assistente de <span className="gradient-text">IA</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Converse com nossa IA para refinar e expandir suas ideias
          </p>
        </div>

        <div className="border rounded-lg h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="border-b p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-cyan flex items-center justify-center text-white font-bold">
                AI
              </div>
              <div>
                <h3 className="font-semibold">Assistente Cogniflow</h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-blue to-cyber-cyan flex items-center justify-center text-white text-xs font-bold">
                AI
              </div>
              <div className="flex-1 bg-muted/50 rounded-lg p-3">
                <p className="text-sm">
                  Olá! 👋 Sou o Assistente Cogniflow. Como posso ajudar você a
                  desenvolver suas ideias hoje?
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="flex-1 max-w-[80%] bg-primary text-primary-foreground rounded-lg p-3">
                <p className="text-sm">
                  Configure a integração com OpenAI para começar a conversar!
                </p>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-2 border rounded-lg bg-background"
                disabled
              />
              <button
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
                disabled
              >
                Enviar
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Configure sua API key da OpenAI nas configurações para ativar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
