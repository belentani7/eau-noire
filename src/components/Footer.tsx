export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Brand Card */}
        <div className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-black border border-white/10 flex items-center justify-center text-2xl shrink-0">
              🖤
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg">Belentani Noiacore Lab</h3>
              <p className="text-slate-400 text-sm mt-1 italic">Eau Noire — El agua negra fluye en silencio, pero mueve montañas</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">50 herramientas</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">Open Source</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">MIT License</span>
                <span className="text-[10px] px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">Cloud-native</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-slate-500">Operador único</div>
              <div className="text-xs text-slate-600">Pedro Belentani</div>
              <div className="text-xs text-emerald-400 mt-1">belentani.eu</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries({
            'A': { name: 'Operar Web', count: 10, emoji: '🌐' },
            'B': { name: 'Investigar', count: 10, emoji: '🔍' },
            'C': { name: '24/7', count: 10, emoji: '⏰' },
            'D': { name: 'Entregables', count: 10, emoji: '📄' },
            'E': { name: 'Auxiliares', count: 10, emoji: '🛠️' }
          }).map(([key, info]) => (
            <div key={key} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{info.emoji}</div>
              <div className="text-xs text-slate-500">Bloque {key}</div>
              <div className="text-sm text-white font-semibold">{info.name}</div>
              <div className="text-xs text-emerald-400 mt-1">{info.count} herramientas</div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <div className="text-xs text-slate-600">
            © {new Date().getFullYear()} Belentani Noiacore Lab — Eau Noire
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>50 herramientas open source</span>
            <span>•</span>
            <span>MIT License</span>
            <span>•</span>
            <span>Cloud-native</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
