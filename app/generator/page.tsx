export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-padding mx-auto max-w-4xl py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Gerador de <span className="gradient-text">Ideias</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Use IA para gerar ideias criativas automaticamente
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Categoria
            </label>
            <select className="w-full px-4 py-2 border rounded-lg bg-background">
              <option>Startup</option>
              <option>Design</option>
              <option>App Feature</option>
              <option>Conteúdo</option>
              <option>Marketing</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Descreva sua ideia (opcional)
            </label>
            <textarea
              className="w-full px-4 py-2 border rounded-lg bg-background min-h-[120px]"
              placeholder="Ex: Quero criar um app de produtividade..."
            />
          </div>

          <button className="w-full px-6 py-3 bg-gradient-to-r from-cyber-blue to-cyber-cyan text-white rounded-lg font-semibold hover:opacity-90 transition">
            ✨ Gerar Ideias com IA
          </button>

          <div className="mt-8 p-6 border rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-3">💡 Ideias Geradas:</h3>
            <p className="text-muted-foreground">
              Clique no botão acima para gerar suas primeiras ideias!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
