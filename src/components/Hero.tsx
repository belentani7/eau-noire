export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-slate-300">Manus Operations Dashboard</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            20 Cosas Que Solo
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Manus Puede Hacer
          </span>
          <br />
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            por Pedro Belentani
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-center text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Filtro aplicado: <span className="text-emerald-400 font-medium">Nube</span> +{' '}
          <span className="text-blue-400 font-medium">Navegador Autenticado</span> +{' '}
          <span className="text-amber-400 font-medium">Asíncrono 24/7</span> +{' '}
          <span className="text-purple-400 font-medium">Entregables</span>
        </p>

        {/* Criteria */}
        <div className="mt-10 max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="text-white font-semibold mb-2">Criterio de División</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Descartado lo que hacen mejor tus CLIs locales (editar tus propios repos, escribir código, READMEs, refactors). 
                  <span className="text-white font-medium"> Manus aporta algo que tu PC no puede:</span> un navegador con sesión real, 
                  una VM en nube ejecutando horas, tareas cron sin tu máquina, y producción de documentos/hojas/videos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Priority */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <span>🎯</span> Prioridades
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-xs font-bold">1</span>
                <span className="text-sm text-slate-300">Que nada se caiga</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">2</span>
                <span className="text-sm text-slate-300">Visibilidad y cobros</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">3</span>
                <span className="text-sm text-slate-300">Investigación con ventaja</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold">4</span>
                <span className="text-sm text-slate-300">Entregables largos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
