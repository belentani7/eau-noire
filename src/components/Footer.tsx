export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
              PB
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">Pedro Belentani</h3>
              <p className="text-slate-400 text-sm mt-1">
                Operador único · GitHub <span className="text-emerald-400">belentani7</span> · ~100 repos · 78+ públicos · 9 sitios en GitHub Pages
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300">belentani.eu</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">Omega/OS</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">cv-ai</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">Duck Studio</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">CASO_BELENTANI</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-slate-500">Sin GPU dedicada</div>
              <div className="text-xs text-slate-600">Intel UHD 620 · 1GB VRAM</div>
              <div className="text-xs text-emerald-400 mt-1">→ Todo el trabajo pesado en la nube</div>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="mb-8">
          <h4 className="text-white font-semibold text-sm mb-3">Proyectos Activos</h4>
          <div className="flex flex-wrap gap-2">
            {[
              'Belentani Omega/OS', 'Judas Experience', 'ManosAbiertas', 
              'Cruzando-el-Charco', 'Duck Studio', 'Belentani.cv-ai',
              'tender-words-connect', 'ivy-la-vie', 'CARQUIDEC',
              'secure-t-university', 'lingua-aberta', 'eduforge'
            ].map((project) => (
              <span
                key={project}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-default"
              >
                {project}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <div className="text-xs text-slate-600">
            Manus Operations Dashboard · Planificación de agente autónomo
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600">
              Filtro: Nube + Navegador + 24/7 + Entregables
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
