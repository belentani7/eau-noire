import { Block } from '../data/blocks';

interface BlockSectionProps {
  block: Block;
  isExpanded: boolean;
  onToggle: () => void;
}

const colorMap: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  emerald: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300'
  },
  blue: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300'
  },
  amber: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300'
  },
  purple: {
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    badge: 'bg-purple-500/20 text-purple-300'
  }
};

export default function BlockSection({ block, isExpanded, onToggle }: BlockSectionProps) {
  const colors = colorMap[block.color] || colorMap.emerald;

  return (
    <div className={`rounded-2xl border ${colors.border} bg-gradient-to-br ${block.gradient} backdrop-blur-sm overflow-hidden transition-all duration-300`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-2xl`}>
            {block.icon}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${colors.badge}`}>
                BLOQUE {block.letter}
              </span>
              <span className="text-xs text-slate-500">{block.tasks.length} tareas</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">{block.title}</h2>
            <p className="text-sm text-slate-400">{block.subtitle}</p>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className={`w-4 h-4 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Tasks */}
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="px-6 pb-6 grid gap-4 md:grid-cols-2">
          {block.tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <span className={`w-7 h-7 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center text-xs font-bold shrink-0`}>
                  {task.id}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm group-hover:text-white/90">
                    {task.title}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    {task.description}
                  </p>
                  {task.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] px-2 py-0.5 rounded-full ${colors.badge}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
