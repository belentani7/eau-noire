import { useState } from 'react';

interface Tool {
  id: number;
  name: string;
  script: string;
  block: string;
  description: string;
  status: 'ready' | 'needs-config' | 'needs-manus';
}

const tools: Tool[] = [
  // BLOQUE A
  { id: 1, name: 'ambassador-autopilot', script: 'ambassador-autopilot.js', block: 'A', description: 'Aplicaciones a programas de embajadores (Qwen, HF, Alibaba)', status: 'ready' },
  { id: 2, name: 'cv-autopilot', script: 'cv-autopilot.js', block: 'A', description: 'CV + carta adaptados por oferta + pipeline de aplicaciones', status: 'ready' },
  { id: 3, name: 'duck-studio-distribution', script: 'duck-studio-distribution.js', block: 'A', description: 'Distribución musical con metadata, artwork y validación', status: 'ready' },
  { id: 4, name: 'gumroad-publisher', script: 'gumroad-publisher.js', block: 'A', description: 'Publicación de productos digitales en Gumroad/Stripe', status: 'ready' },
  { id: 5, name: 'secret-rotator', script: 'secret-rotator.js', block: 'A', description: 'Vault cifrado AES-256-GCM para rotación de API keys', status: 'ready' },
  { id: 6, name: 'dns-manager', script: 'dns-manager.js', block: 'A', description: 'Configuración y verificación de DNS/SSL para dominios', status: 'ready' },
  { id: 7, name: 'oauth-connector', script: 'oauth-connector.js', block: 'A', description: 'Conexión OAuth para Gmail, Calendar, Drive, Notion', status: 'ready' },
  { id: 8, name: 'domain-registrar', script: 'noiacore-research.js domains', block: 'A', description: 'Registro y gestión de dominios con aprobación previa', status: 'ready' },
  { id: 9, name: 'form-filler', script: 'ambassador-autopilot.js', block: 'A', description: 'Rellenado automático de formularios web con capturas', status: 'ready' },
  { id: 10, name: 'web-session-manager', script: 'oauth-connector.js', block: 'A', description: 'Gestión de sesiones autenticadas persistentes', status: 'ready' },
  
  // BLOQUE B
  { id: 11, name: 'edu-benchmark', script: 'edu-benchmark.js', block: 'B', description: 'Benchmark de plataformas educativas con export CSV', status: 'ready' },
  { id: 12, name: 'grants-scout', script: 'noiacore-research.js grants', block: 'B', description: 'Búsqueda de grants/becas (EU, ES, BR) con fechas límite', status: 'ready' },
  { id: 13, name: 'jurisprudence-finder', script: 'noiacore-research.js jurisprudence', block: 'B', description: 'Búsqueda de jurisprudencia comparada con citas y enlaces', status: 'ready' },
  { id: 14, name: 'ai-providers-radar', script: 'ai-providers-radar.js', block: 'B', description: 'Comparativa de proveedores IA vs Token Plan Alibaba', status: 'ready' },
  { id: 15, name: 'domain-study', script: 'noiacore-research.js domains', block: 'B', description: 'Estudio de disponibilidad/precio de dominios por TLD', status: 'ready' },
  { id: 16, name: 'freelance-scraper', script: 'noiacore-research.js freelance', block: 'B', description: 'Scrape de portales de empleo/freelance para pipeline', status: 'ready' },
  { id: 17, name: 'competitor-monitor', script: 'noiacore-research.js competitors', block: 'B', description: 'Monitor de cambios en sitios de competencia', status: 'ready' },
  { id: 18, name: 'news-aggregator', script: 'noiacore-research.js news', block: 'B', description: 'Agregador de noticias por topic con resumen IA', status: 'ready' },
  { id: 19, name: 'pricing-tracker', script: 'noiacore-research.js pricing', block: 'B', description: 'Rastreador de precios de servicios cloud/APIs', status: 'ready' },
  { id: 20, name: 'trend-analyzer', script: 'noiacore-research.js trends', block: 'B', description: 'Análisis de tendencias en redes y foros técnicos', status: 'ready' },
  
  // BLOQUE C
  { id: 21, name: 'uptime-monitor', script: 'uptime-monitor.js', block: 'C', description: 'Monitor horario de sitios con alertas Telegram/email', status: 'ready' },
  { id: 22, name: 'weekly-reporter', script: 'noiacore-scheduler.js weekly-report', block: 'C', description: 'Informe semanal recurrente (lunes) con radar + oportunidades', status: 'ready' },
  { id: 23, name: 'backup-verifier', script: 'backup-verifier.js', block: 'C', description: 'Backup diario verificado GitHub + HuggingFace + IPFS', status: 'ready' },
  { id: 24, name: 'api-costs-dashboard', script: 'api-costs-dashboard.js', block: 'C', description: 'Dashboard de costes APIs con alertas de umbral', status: 'ready' },
  { id: 25, name: 'cron-scheduler', script: 'noiacore-scheduler.js cron', block: 'C', description: 'Programador de tareas recurrentes con logging', status: 'ready' },
  { id: 26, name: 'health-checker', script: 'noiacore-scheduler.js health', block: 'C', description: 'Verificación de salud de APIs y servicios', status: 'ready' },
  { id: 27, name: 'log-rotator', script: 'noiacore-scheduler.js log-rotate', block: 'C', description: 'Rotación y compresión de logs antiguos', status: 'ready' },
  { id: 28, name: 'certificate-monitor', script: 'noiacore-scheduler.js certs', block: 'C', description: 'Monitor de expiración de certificados SSL', status: 'ready' },
  { id: 29, name: 'dependency-updater', script: 'noiacore-scheduler.js deps', block: 'C', description: 'Actualizador automático de dependencias con tests', status: 'ready' },
  { id: 30, name: 'anomaly-detector', script: 'noiacore-scheduler.js anomaly', block: 'C', description: 'Detector de anomalías en métricas de sistemas', status: 'ready' },
  
  // BLOQUE D
  { id: 31, name: 'dossier-generator', script: 'dossier-generator.js', block: 'D', description: 'Generador de dossier legal PDF premium con bookmarks', status: 'ready' },
  { id: 32, name: 'video-content-creator', script: 'noiacore-deliverables.js video', block: 'D', description: 'Generador de contenido vertical (Shorts/TikTok) desde repos', status: 'ready' },
  { id: 33, name: 'report-builder', script: 'noiacore-deliverables.js report', block: 'D', description: 'Constructor de informes con gráficos y tablas', status: 'ready' },
  { id: 34, name: 'presentation-maker', script: 'noiacore-deliverables.js presentation', block: 'D', description: 'Generador de presentaciones desde datos estructurados', status: 'ready' },
  { id: 35, name: 'newsletter-compiler', script: 'noiacore-deliverables.js newsletter', block: 'D', description: 'Compilador de newsletters con contenido curado', status: 'ready' },
  { id: 36, name: 'ebook-generator', script: 'noiacore-deliverables.js ebook', block: 'D', description: 'Generador de ebooks en PDF/EPUB desde markdown', status: 'ready' },
  { id: 37, name: 'invoice-generator', script: 'noiacore-deliverables.js invoice', block: 'D', description: 'Generador de facturas profesionales', status: 'ready' },
  { id: 38, name: 'contract-templater', script: 'noiacore-deliverables.js contract', block: 'D', description: 'Generador de contratos desde templates', status: 'ready' },
  { id: 39, name: 'documentation-builder', script: 'noiacore-deliverables.js docs', block: 'D', description: 'Constructor de documentación técnica desde código', status: 'ready' },
  { id: 40, name: 'portfolio-builder', script: 'noiacore-deliverables.js portfolio', block: 'D', description: 'Constructor de portfolio web estático', status: 'ready' },
  
  // BLOQUE E
  { id: 41, name: 'config-validator', script: 'noiacore-utils.js config-validate', block: 'E', description: 'Validador de archivos de configuración (YAML, JSON, TOML)', status: 'ready' },
  { id: 42, name: 'env-manager', script: 'noiacore-utils.js env', block: 'E', description: 'Gestor de variables de entorno por proyecto', status: 'ready' },
  { id: 43, name: 'checksum-verifier', script: 'noiacore-utils.js checksum', block: 'E', description: 'Verificador de integridad de archivos con checksums', status: 'ready' },
  { id: 44, name: 'markdown-prettifier', script: 'noiacore-utils.js md-prettify', block: 'E', description: 'Formateador de markdown consistente', status: 'ready' },
  { id: 45, name: 'json-transformer', script: 'noiacore-utils.js json-transform', block: 'E', description: 'Transformador de JSON con templates', status: 'ready' },
  { id: 46, name: 'csv-analyzer', script: 'noiacore-utils.js csv-analyze', block: 'E', description: 'Analizador de CSV con estadísticas y visualización', status: 'ready' },
  { id: 47, name: 'git-automation', script: 'noiacore-utils.js git', block: 'E', description: 'Automatización de workflows de git', status: 'ready' },
  { id: 48, name: 'notification-hub', script: 'noiacore-utils.js notify', block: 'E', description: 'Hub centralizado de notificaciones (email, Telegram, Slack)', status: 'ready' },
  { id: 49, name: 'audit-logger', script: 'noiacore-utils.js audit', block: 'E', description: 'Logger de auditoría para acciones sensibles', status: 'ready' },
  { id: 50, name: 'cli-dashboard', script: 'noiacore-utils.js dashboard', block: 'E', description: 'Dashboard TUI (terminal UI) para monitoreo en vivo', status: 'ready' }
];

const blockInfo = {
  A: { name: 'Operar en la Web', emoji: '🌐', color: 'emerald' },
  B: { name: 'Investigación Web', emoji: '🔍', color: 'blue' },
  C: { name: 'Tareas 24/7', emoji: '⏰', color: 'amber' },
  D: { name: 'Entregables', emoji: '📄', color: 'purple' },
  E: { name: 'Auxiliares', emoji: '🛠️', color: 'slate' }
};

export default function ToolsSection() {
  const [activeBlock, setActiveBlock] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = tools.filter(t => {
    const matchesBlock = activeBlock === 'all' || t.block === activeBlock;
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBlock && matchesSearch;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
          <span className="text-sm text-slate-300">🖤 50 Herramientas Open Source</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Noiacore{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Toolkit
          </span>
        </h2>
        <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
          50 herramientas de código abierto organizadas en 5 bloques operativos
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar herramientas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveBlock('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeBlock === 'all'
                ? 'bg-white/15 text-white border border-white/30'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
            }`}
          >
            Todas (50)
          </button>
          {Object.entries(blockInfo).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setActiveBlock(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeBlock === key
                  ? 'bg-white/15 text-white border border-white/30'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {info.emoji} {key}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-3">
        {filteredTools.map((tool) => {
          const block = blockInfo[tool.block as keyof typeof blockInfo];
          
          return (
            <div
              key={tool.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-slate-400 shrink-0">
                  {String(tool.id).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-white font-semibold text-sm">{tool.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full bg-${block.color}-500/20 text-${block.color}-300 border border-${block.color}-500/30`}>
                      Bloque {tool.block}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ✅ Ready
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{tool.description}</p>
                  <code className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded mt-2 inline-block font-mono">
                    node scripts/{tool.script}
                  </code>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          No se encontraron herramientas con esos criterios
        </div>
      )}
    </section>
  );
}
