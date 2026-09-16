export interface Project {
  id: string;
  name: string;
  emoji: string;
  category: string;
  categoryColor: string;
  description: string;
  status: 'activo' | 'en pausa' | 'producción' | 'desarrollo';
  statusColor: string;
  site?: string;
  repo?: string;
  manusTasks: number[]; // IDs de las tareas que aplican
  priority: 'alta' | 'media' | 'baja';
  notes?: string;
}

export const projects: Project[] = [
  {
    id: 'omega-os',
    name: 'Belentani Omega/OS',
    emoji: '🧠',
    category: 'Sistema Operativo',
    categoryColor: 'indigo',
    description: 'Sistema operativo personal/orquestador de todos los proyectos. Capa unificada de control.',
    status: 'activo',
    statusColor: 'emerald',
    repo: 'belentani7/omega-os',
    manusTasks: [15, 16, 17, 18],
    priority: 'alta',
    notes: 'Núcleo de la operación unipersonal'
  },
  {
    id: 'judas-experience',
    name: 'Judas Experience',
    emoji: '🎭',
    category: 'Arte / Narrativa',
    categoryColor: 'red',
    description: 'Proyecto artístico-narrativo. Experiencia inmersiva con contenido multimedia.',
    status: 'activo',
    statusColor: 'emerald',
    manusTasks: [3, 4, 20],
    priority: 'alta'
  },
  {
    id: 'manos-abiertas',
    name: 'ManosAbiertas',
    emoji: '🤝',
    category: 'Social / Comunidad',
    categoryColor: 'amber',
    description: 'Iniciativa social. Plataforma de colaboración y apoyo comunitario.',
    status: 'activo',
    statusColor: 'emerald',
    site: 'manosabiertas.belentani.eu',
    manusTasks: [6, 10, 15, 16],
    priority: 'media'
  },
  {
    id: 'cruzando-charco',
    name: 'Cruzando-el-Charco',
    emoji: '🌊',
    category: 'Cultural / Migración',
    categoryColor: 'cyan',
    description: 'Proyecto cultural sobre migración y diáspora. Contenido documental y educativo.',
    status: 'activo',
    statusColor: 'emerald',
    manusTasks: [10, 11, 14, 20],
    priority: 'media'
  },
  {
    id: 'duck-studio',
    name: 'Duck Studio',
    emoji: '🦆',
    category: 'Música',
    categoryColor: 'yellow',
    description: 'Sello musical / distribución. Producción y publicación de canciones propias.',
    status: 'producción',
    statusColor: 'blue',
    manusTasks: [3, 4, 20],
    priority: 'alta',
    notes: 'Distribución musical activa'
  },
  {
    id: 'cv-ai',
    name: 'Belentani.cv-ai',
    emoji: '📄',
    category: 'IA / Empleo',
    categoryColor: 'emerald',
    description: 'CV inteligente con IA. Aplicación automática a ofertas y colaboraciones.',
    status: 'activo',
    statusColor: 'emerald',
    repo: 'belentani7/belentani-cv-ai',
    manusTasks: [2, 14],
    priority: 'alta',
    notes: 'Pipeline de oportunidades freelance'
  },
  {
    id: 'tender-words',
    name: 'tender-words-connect',
    emoji: '💌',
    category: 'Social / Comunicación',
    categoryColor: 'pink',
    description: 'Plataforma de conexión a través de palabras. Comunicación emocional y artística.',
    status: 'desarrollo',
    statusColor: 'amber',
    manusTasks: [6, 15, 16],
    priority: 'media'
  },
  {
    id: 'ivy-la-vie',
    name: 'ivy-la-vie',
    emoji: '🌿',
    category: 'Arte / Personal',
    categoryColor: 'green',
    description: 'Proyecto artístico personal. Expresión creativa multiformato.',
    status: 'activo',
    statusColor: 'emerald',
    manusTasks: [4, 20],
    priority: 'baja'
  },
  {
    id: 'carquidec',
    name: 'CARQUIDEC',
    emoji: '🔬',
    category: 'Investigación / Ciencia',
    categoryColor: 'violet',
    description: 'Proyecto de investigación científica o técnica. Contenido académico-divulgativo.',
    status: 'activo',
    statusColor: 'emerald',
    manusTasks: [9, 10, 11, 12],
    priority: 'media'
  },
  {
    id: 'secure-t-university',
    name: 'secure-t-university',
    emoji: '🔐',
    category: 'Educación / Seguridad',
    categoryColor: 'slate',
    description: 'Plataforma educativa sobre seguridad. Cursos y formación especializada.',
    status: 'activo',
    statusColor: 'emerald',
    manusTasks: [4, 8, 9],
    priority: 'alta',
    notes: 'Cursos y productos digitales'
  },
  {
    id: 'lingua-aberta',
    name: 'lingua-aberta',
    emoji: '🗣️',
    category: 'Lingüística / Cultura',
    categoryColor: 'teal',
    description: 'Proyecto lingüístico abierto. Recursos educativos de idiomas y cultura.',
    status: 'activo',
    statusColor: 'emerald',
    manusTasks: [9, 10, 13],
    priority: 'media'
  },
  {
    id: 'eduforge',
    name: 'eduforge',
    emoji: '🎓',
    category: 'Educación / Plataforma',
    categoryColor: 'orange',
    description: 'Forja educativa. Plataforma de formación y creación de contenido pedagógico.',
    status: 'activo',
    statusColor: 'emerald',
    manusTasks: [4, 8, 9, 10],
    priority: 'alta',
    notes: 'Benchmark vs Coursera/edX/Platzi'
  },
  {
    id: 'belentani-eu',
    name: 'belentani.eu',
    emoji: '🌐',
    category: 'Infraestructura',
    categoryColor: 'sky',
    description: 'Dominio principal y hub personal. 9 sitios en GitHub Pages bajo esta marca.',
    status: 'producción',
    statusColor: 'blue',
    site: 'belentani.eu',
    manusTasks: [1, 5, 6, 7, 8, 13, 15],
    priority: 'alta',
    notes: 'DNS en DonDominio + GitHub Pages'
  },
  {
    id: 'caso-belentani',
    name: 'CASO_BELENTANI',
    emoji: '⚖️',
    category: 'Legal',
    categoryColor: 'rose',
    description: 'Caso legal abierto. Requiere investigación jurídica, dossier y seguimiento.',
    status: 'activo',
    statusColor: 'emerald',
    manusTasks: [11, 19],
    priority: 'alta',
    notes: 'Dossier PDF premium + jurisprudencia'
  }
];

export const categories = [
  { id: 'all', name: 'Todos', emoji: '📦' },
  { id: 'Sistema Operativo', name: 'Sistema', emoji: '🧠' },
  { id: 'Arte / Narrativa', name: 'Arte', emoji: '🎭' },
  { id: 'Música', name: 'Música', emoji: '🦆' },
  { id: 'Educación / Plataforma', name: 'Educación', emoji: '🎓' },
  { id: 'IA / Empleo', name: 'IA', emoji: '📄' },
  { id: 'Infraestructura', name: 'Infra', emoji: '🌐' },
  { id: 'Legal', name: 'Legal', emoji: '⚖️' }
];
