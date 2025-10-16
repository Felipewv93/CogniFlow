export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-padding mx-auto max-w-7xl py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Biblioteca de <span className="gradient-text">Templates</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Explore centenas de templates prontos para usar
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="mb-3">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Startup
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Template #{i}</h3>
              <p className="text-muted-foreground mb-4">
                Descrição do template para ajudar você a começar rapidamente.
              </p>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
                Usar Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
