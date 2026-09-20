export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/60 via-transparent to-transparent" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Brand badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
            <span className="text-sm text-slate-300 font-medium tracking-wide">BELENTANI NOIACORE LAB</span>
            <span className="text-slate-600">|</span>
            <span className="text-sm text-slate-500 italic">Eau Noire</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            50 Herramientas
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            de Código Abierto
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-center text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Operaciones unipersonales en la nube.{' '}
          <span className="text-emerald-400">Navegador autenticado</span> +{' '}
          <span className="text-blue-400">Investigación a escala</span> +{' '}
          <span className="text-amber-400">Ejecución 24/7</span> +{' '}
          <span className="text-purple-400">Entregables automáticos</span>
        </p>

        {/* Philosophy */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🖤</span>
              <div>
                <h3 className="text-white font-semibold mb-2">Eau Noire</h3>
                <p className="text-slate-400 text-sm leading-relaxed italic">
                  "El agua negra fluye en silencio, pero mueve montañas."
                </p>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                  Noiacore Lab opera en la profundidad de la automatización, invisible pero omnipresente. 
                  Cada herramienta es una gota en el océano de la eficiencia unipersonal.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Blocks */}
        <div className="mt-10 grid grid-cols-5 gap-2 max-w-3xl mx-auto">
          {[
            { letter: 'A', name: 'Operar Web', count: 10, color: 'emerald' },
            { letter: 'B', name: 'Investigar', count: 10, color: 'blue' },
            { letter: 'C', name: '24/7', count: 10, color: 'amber' },
            { letter: 'D', name: 'Entregables', count: 10, color: 'purple' },
            { letter: 'E', name: 'Auxiliares', count: 10, color: 'slate' }
          ].map(b => (
            <div key={b.letter} className={`bg-${b.color}-500/10 border border-${b.color}-500/20 rounded-xl p-3 text-center`}>
              <div className={`text-2xl font-bold text-${b.color}-400`}>{b.letter}</div>
              <div className="text-[10px] text-slate-500 mt-1">{b.name}</div>
              <div className={`text-xs text-${b.color}-300 font-semibold mt-0.5`}>{b.count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
