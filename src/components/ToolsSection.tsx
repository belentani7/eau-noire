import { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  emoji: string;
  script: string;
  description: string;
  phase: string;
  phaseColor: string;
  commands: { cmd: string; desc: string }[];
  envVars?: string[];
  status: 'ready' | 'needs-config' | 'needs-manus';
}

const tools: Tool[] = [
  {
    id: 'uptime',
    name: 'Uptime Monitor',
    emoji: '🔍',
    script: 'scripts/uptime-monitor.js',
    description: 'Monitor horario de los 9 sitios con alertas por Telegram/email',
    phase: 'C',
    phaseColor: 'amber',
    commands: [
      { cmd: 'node scripts/uptime-monitor.js', desc: 'Check una vez' },
      { cmd: 'node scripts/uptime-monitor.js --daemon', desc: 'Modo continuo (cada hora)' }
    ],
    envVars: ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID'],
    status: 'needs-config'
  },
  {
    id: 'backup',
    name: 'Backup Verificado',
    emoji: '💾',
    script: 'scripts/backup-verifier.js',
    description: 'Backup diario GitHub + HuggingFace + IPFS con verificación de integridad',
    phase: 'C',
    phaseColor: 'amber',
    commands: [
      { cmd: 'node scripts/backup-verifier.js', desc: 'Backup completo' },
      { cmd: 'node scripts/backup-verifier.js --verify', desc: 'Solo verificar' }
    ],
    envVars: ['HF_TOKEN', 'PINATA_JWT'],
    status: 'needs-config'
  },
  {
    id: 'costs',
    name: 'API Costs Dashboard',
    emoji: '💰',
    script: 'scripts/api-costs-dashboard.js',
    description: 'Monitor de gastos en Alibaba, HF, OpenRouter, Groq con alertas',
    phase: 'C',
    phaseColor: 'amber',
    commands: [
      { cmd: 'node scripts/api-costs-dashboard.js', desc: 'Dashboard actual' },
      { cmd: 'node scripts/api-costs-dashboard.js --alert', desc: 'Con alertas' }
    ],
    envVars: ['ALIBABA_API_KEY', 'HF_TOKEN', 'OPENROUTER_API_KEY', 'GROQ_API_KEY'],
    status: 'needs-config'
  },
  {
    id: 'vault',
    name: 'Secret Rotator',
    emoji: '🔐',
    script: 'scripts/secret-rotator.js',
    description: 'Vault cifrado AES-256-GCM para rotación segura de API keys',
    phase: 'A',
    phaseColor: 'emerald',
    commands: [
      { cmd: 'node scripts/secret-rotator.js list', desc: 'Listar secretos' },
      { cmd: 'node scripts/secret-rotator.js set <key> <value>', desc: 'Guardar secreto' },
      { cmd: 'node scripts/secret-rotator.js rotate alibaba', desc: 'Guía de rotación' }
    ],
    envVars: ['VAULT_PASSPHRASE'],
    status: 'needs-config'
  },
  {
    id: 'dossier',
    name: 'Dossier Legal',
    emoji: '📝',
    script: 'scripts/dossier-generator.js',
    description: 'Generador de dossier PDF premium con índice, bookmarks y cronología',
    phase: 'D',
    phaseColor: 'purple',
    commands: [
      { cmd: 'node scripts/dossier-generator.js', desc: 'Generar PDF/HTML' }
    ],
    status: 'ready'
  },
  {
    id: 'radar',
    name: 'AI Providers Radar',
    emoji: '🔍',
    script: 'scripts/ai-providers-radar.js',
    description: 'Comparativa de proveedores IA vs Token Plan de Alibaba',
    phase: 'B',
    phaseColor: 'blue',
    commands: [
      { cmd: 'node scripts/ai-providers-radar.js', desc: 'Radar completo' },
      { cmd: 'node scripts/ai-providers-radar.js --compare alibaba', desc: 'vs Alibaba' }
    ],
    status: 'ready'
  },
  {
    id: 'duck',
    name: 'Duck Studio Distribution',
    emoji: '🦆',
    script: 'scripts/duck-studio-distribution.js',
    description: 'Preparación y validación de distribución musical (metadata, artwork, audio)',
    phase: 'A',
    phaseColor: 'emerald',
    commands: [
      { cmd: 'node scripts/duck-studio-distribution.js prepare', desc: 'Crear template' },
      { cmd: 'node scripts/duck-studio-distribution.js validate', desc: 'Validar todo' }
    ],
    status: 'ready'
  },
  {
    id: 'cv',
    name: 'CV Autopilot',
    emoji: '📄',
    script: 'scripts/cv-autopilot.js',
    description: 'Generación de CV y carta adaptados por oferta + pipeline de aplicaciones',
    phase: 'A',
    phaseColor: 'emerald',
    commands: [
      { cmd: 'node scripts/cv-autopilot.js scan', desc: 'Ver portales' },
      { cmd: 'node scripts/cv-autopilot.js pipeline', desc: 'Ver pipeline' }
    ],
    status: 'ready'
  },
  {
    id: 'benchmark',
    name: 'Edu Benchmark',
    emoji: '🎓',
    script: 'scripts/edu-benchmark.js',
    description: 'Benchmark de Coursera, edX, Platzi, UX Academy con comparativa vs EduForge',
    phase: 'B',
    phaseColor: 'blue',
    commands: [
      { cmd: 'node scripts/edu-benchmark.js', desc: 'Benchmark completo' },
      { cmd: 'node scripts/edu-benchmark.js --compare', desc: 'vs EduForge' },
      { cmd: 'node scripts/edu-benchmark.js --export csv', desc: 'Exportar CSV' }
    ],
    status: 'ready'
  }
];

const statusConfig = {
  ready: { label: 'Listo', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
  'needs-config': { label: 'Requiere config', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', dot: 'bg-amber-400' },
  'needs-manus': { label: 'Requiere Manus', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' }
};

export default function ToolsSection() {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const readyCount = tools.filter(t => t.status === 'ready').length;
  const configCount = tools.filter(t => t.status === 'needs-config').length;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
          <span className="text-sm text-slate-300">🛠️ Toolkit Construido</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          9 Herramientas{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Funcionales
          </span>
        </h2>
        <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
          Scripts Node.js listos para ejecutar. Cada uno resuelve una o más tareas del plan operativo.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-emerald-400">{readyCount}</div>
          <div className="text-xs text-emerald-300">Listos</div>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-amber-400">{configCount}</div>
          <div className="text-xs text-amber-300">Requieren config</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
          <div className="text-2xl font-bold text-white">{tools.length}</div>
          <div className="text-xs text-slate-400">Total</div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4">
        {tools.map((tool) => {
          const status = statusConfig[tool.status];
          const isExpanded = expandedTool === tool.id;

          return (
            <div
              key={tool.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/[0.07] transition-colors"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedTool(isExpanded ? null : tool.id)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl shrink-0">
                  {tool.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-semibold text-sm">{tool.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${status.color}`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${status.dot} mr-1`} />
                      {status.label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-400">
                      Fase {tool.phase}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1 truncate">{tool.description}</p>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                  {/* Script path */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">📁</span>
                    <code className="text-xs text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded font-mono">
                      {tool.script}
                    </code>
                  </div>

                  {/* Commands */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Comandos</h4>
                    <div className="space-y-2">
                      {tool.commands.map((c, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 text-xs mt-0.5">$</span>
                          <div>
                            <code className="text-xs text-slate-300 font-mono bg-white/5 px-2 py-1 rounded block">
                              {c.cmd}
                            </code>
                            <span className="text-[10px] text-slate-500 mt-0.5">{c.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Env vars */}
                  {tool.envVars && tool.envVars.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Variables de entorno</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {tool.envVars.map(v => (
                          <span key={v} className="text-[10px] px-2 py-1 rounded bg-amber-500/10 text-amber-300 font-mono">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
