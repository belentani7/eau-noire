import { useState } from 'react';
import { projects, categories, Project } from '../data/projects';

const categoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
  indigo: { bg: 'bg-indigo-500/15', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  red: { bg: 'bg-red-500/15', text: 'text-red-300', border: 'border-red-500/30' },
  amber: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/30' },
  cyan: { bg: 'bg-cyan-500/15', text: 'text-cyan-300', border: 'border-cyan-500/30' },
  yellow: { bg: 'bg-yellow-500/15', text: 'text-yellow-300', border: 'border-yellow-500/30' },
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  pink: { bg: 'bg-pink-500/15', text: 'text-pink-300', border: 'border-pink-500/30' },
  green: { bg: 'bg-green-500/15', text: 'text-green-300', border: 'border-green-500/30' },
  violet: { bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/30' },
  slate: { bg: 'bg-slate-500/15', text: 'text-slate-300', border: 'border-slate-500/30' },
  teal: { bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/30' },
  orange: { bg: 'bg-orange-500/15', text: 'text-orange-300', border: 'border-orange-500/30' },
  sky: { bg: 'bg-sky-500/15', text: 'text-sky-300', border: 'border-sky-500/30' },
  rose: { bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-500/30' }
};

const statusMap: Record<string, { label: string; dot: string }> = {
  activo: { label: 'Activo', dot: 'bg-emerald-400' },
  'en pausa': { label: 'En pausa', dot: 'bg-slate-400' },
  producción: { label: 'Producción', dot: 'bg-blue-400' },
  desarrollo: { label: 'Desarrollo', dot: 'bg-amber-400' }
};

const priorityMap: Record<string, { label: string; color: string }> = {
  alta: { label: 'Alta', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
  media: { label: 'Media', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  baja: { label: 'Baja', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' }
};

export default function ProjectsSection() {
  const [filter, setFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
          <span className="text-sm text-slate-300">📂 Ecosistema de Proyectos</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Alcance Completo de{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Manus
          </span>
        </h2>
        <p className="text-slate-400 mt-3 max-w-2xl mx-auto">
          Cada proyecto mapeado a las tareas específicas que Manus puede ejecutar. 
          Haz clic en un proyecto para ver su plan operativo.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat.id
                ? 'bg-white/15 text-white border border-white/30'
                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="mr-1.5">{cat.emoji}</span>
            {cat.name}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => {
          const colors = categoryColorMap[project.categoryColor] || categoryColorMap.indigo;
          const status = statusMap[project.status];
          const priority = priorityMap[project.priority];

          return (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`text-left relative rounded-2xl border ${colors.border} bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm p-5 hover:scale-[1.02] hover:bg-white/10 transition-all group`}
            >
              {/* Priority badge */}
              <div className="absolute top-3 right-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${priority.color}`}>
                  {priority.label}
                </span>
              </div>

              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center text-xl shrink-0`}>
                  {project.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm truncate group-hover:text-white/90">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                      {project.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                  <span className="text-[11px] text-slate-500">{status.label}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <span className="text-emerald-400 font-bold">{project.manusTasks.length}</span>
                  <span>tareas Manus</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const colors = categoryColorMap[project.categoryColor] || categoryColorMap.indigo;
  const status = statusMap[project.status];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-6`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center text-3xl`}>
              {project.emoji}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{project.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                  {project.category}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descripción</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{project.description}</p>
          </div>

          {/* Links */}
          {(project.site || project.repo) && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Enlaces</h4>
              <div className="flex flex-wrap gap-2">
                {project.site && (
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    🌐 {project.site}
                  </span>
                )}
                {project.repo && (
                  <span className="text-xs px-3 py-1.5 rounded-lg bg-slate-500/10 text-slate-300 border border-slate-500/20">
                    📦 {project.repo}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Manus Tasks */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              🤖 Tareas Manus Aplicables ({project.manusTasks.length})
            </h4>
            <div className="space-y-2">
              {project.manusTasks.map((taskId) => {
                const task = getTaskById(taskId);
                if (!task) return null;
                return (
                  <div
                    key={taskId}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                      {taskId}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-semibold">{task.title}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{task.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          {project.notes && (
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">📝 Notas</h4>
              <p className="text-slate-300 text-sm">{project.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper to get task info by ID
const allTasks: Record<number, { title: string; description: string }> = {
  1: { title: 'Aplicaciones a embajadores', description: 'Qwen, HuggingFace, Alibaba con capturas' },
  2: { title: 'cv-ai autopiloto', description: 'Aplicar a ofertas con CV y carta adaptados' },
  3: { title: 'Distribución musical Duck Studio', description: 'Metadata, artwork, distribuidora' },
  4: { title: 'Productos digitales Gumroad/Stripe', description: 'Templates/cursos con checkout test' },
  5: { title: 'Rotación de secretos API', description: 'Alibaba, HF, OpenRouter, Groq en vault' },
  6: { title: 'DNS/SSL belentani.eu', description: 'DonDominio + GitHub Pages + subdominios' },
  7: { title: 'OAuth Gmail/Calendar/Drive/Notion', description: 'Enviar, agendar, archivar' },
  8: { title: 'Dominios de marca y hosting', description: 'Registro con aprobación previa' },
  9: { title: 'Benchmark plataformas educativas', description: 'Coursera, edX, Platzi, UX Academy' },
  10: { title: 'Grants/becas IA y cultura', description: 'EU, España, Brasil con fechas límite' },
  11: { title: 'Jurisprudencia CASO_BELENTANI', description: 'Comparada, citada con enlaces' },
  12: { title: 'Radar proveedores IA', description: 'Precios vs Token Plan Alibaba' },
  13: { title: 'Estudio dominios/marca', description: 'Disponibilidad por TLD para Belentani' },
  14: { title: 'Pipeline oportunidades freelance', description: 'Scrape de portales para cv-ai' },
  15: { title: 'Monitor uptime horario', description: '9 sitios + alerta Telegram/email' },
  16: { title: 'Informe semanal lunes', description: 'Radar IA + oportunidades + costes' },
  17: { title: 'Backup diario verificado', description: 'GitHub + HuggingFace + IPFS' },
  18: { title: 'Dashboard costes APIs', description: 'Alibaba, HF, OpenRouter con alertas' },
  19: { title: 'Dossier legal PDF', description: 'CASO_BELENTANI premium navegable' },
  20: { title: 'Contenido vertical Shorts/TikTok', description: 'Desde repos y canciones' }
};

function getTaskById(id: number) {
  return allTasks[id] || null;
}
