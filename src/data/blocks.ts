export interface Task {
  id: number;
  title: string;
  description: string;
  tags?: string[];
}

export interface Block {
  id: string;
  letter: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  gradient: string;
  tasks: Task[];
}

export const blocks: Block[] = [
  {
    id: 'A',
    letter: 'A',
    title: 'OPERAR EN LA WEB COMO TÚ',
    subtitle: 'Navegador autenticado',
    icon: '🌐',
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    tasks: [
      {
        id: 1,
        title: 'Aplicaciones a embajadores',
        description: 'Rellenar y seguir las aplicaciones a embajadores (Qwen, HuggingFace, Alibaba) logueado, con recordatorios y captura de cada envío.',
        tags: ['OAuth', 'Formularios', 'Capturas']
      },
      {
        id: 2,
        title: 'cv-ai autopiloto',
        description: 'Aplicar a ofertas/colaboraciones rellenando los formularios web con CV y carta adaptados por oferta.',
        tags: ['Automatización', 'CV', 'Cartas']
      },
      {
        id: 3,
        title: 'Distribución musical Duck Studio',
        description: 'Preparar y subir la distribución musical de Duck Studio (metadata, artwork, formulario de la distribuidora) y seguir el estado.',
        tags: ['Música', 'Metadata', 'Distribución']
      },
      {
        id: 4,
        title: 'Productos digitales en Gumroad/Stripe',
        description: 'Publicar productos digitales (templates/cursos) en Gumroad/Stripe y probar el checkout de verdad, comprando en modo test.',
        tags: ['E-commerce', 'Checkout', 'Test']
      },
      {
        id: 5,
        title: 'Rotación de secretos API',
        description: 'Migrar y rotar secretos de API (Alibaba, HF, OpenRouter, Groq) en los paneles web de cada proveedor y dejarlos en un vault.',
        tags: ['Seguridad', 'API Keys', 'Vault']
      },
      {
        id: 6,
        title: 'DNS/SSL de belentani.eu',
        description: 'Configurar DNS/SSL de belentani.eu + subdominios en el registrador y verificarlo en vivo (DonDominio + GitHub Pages).',
        tags: ['DNS', 'SSL', 'Dominios']
      },
      {
        id: 7,
        title: 'OAuth Gmail/Calendar/Drive/Notion',
        description: 'Conectar por OAuth Gmail / Calendar / Drive / Notion para enviar, agendar y archivar en mi nombre.',
        tags: ['OAuth', 'Google', 'Notion']
      },
      {
        id: 8,
        title: 'Dominios de marca y hosting',
        description: 'Comprar/registrar dominios de marca y hosting donde haga falta, pidiéndome aprobación antes de pagar.',
        tags: ['Dominios', 'Hosting', 'Aprobación']
      }
    ]
  },
  {
    id: 'B',
    letter: 'B',
    title: 'INVESTIGACIÓN WEB A ESCALA',
    subtitle: 'Scraping + síntesis',
    icon: '🔍',
    color: 'blue',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    tasks: [
      {
        id: 9,
        title: 'Benchmark plataformas educativas',
        description: 'Benchmark competitivo de plataformas educativas (Coursera, edX, Platzi, UX Academy) → hoja de cálculo estructurada.',
        tags: ['Benchmark', 'Educación', 'Hoja de cálculo']
      },
      {
        id: 10,
        title: 'Búsqueda de grants/becas',
        description: 'Búsqueda de grants/becas (EU, España, Brasil) para IA y cultura, con requisitos, importes y fechas límite en informe fechado.',
        tags: ['Grants', 'Becas', 'EU/ES/BR']
      },
      {
        id: 11,
        title: 'Jurisprudencia CASO_BELENTANI',
        description: 'Búsqueda de jurisprudencia comparada aplicable al CASO_BELENTANI, resumida y citada con enlaces a la fuente.',
        tags: ['Legal', 'Jurisprudencia', 'Citado']
      },
      {
        id: 12,
        title: 'Radar de proveedores de IA',
        description: 'Radar de proveedores de IA: precios, límites y modelos nuevos, comparados contra mi Token Plan de Alibaba.',
        tags: ['IA', 'Precios', 'Comparativa']
      },
      {
        id: 13,
        title: 'Estudio de dominios/marca',
        description: 'Estudio de disponibilidad/precio de dominios y alternativas por TLD para la marca Belentani.',
        tags: ['Dominios', 'TLD', 'Marca']
      },
      {
        id: 14,
        title: 'Pipeline de oportunidades freelance',
        description: 'Scrape de portales de empleo/freelance relevantes → pipeline de oportunidades para cv-ai.',
        tags: ['Scraping', 'Freelance', 'Pipeline']
      }
    ]
  },
  {
    id: 'C',
    letter: 'C',
    title: 'TAREAS PROGRAMADAS 24/7',
    subtitle: 'Sin tu PC encendido',
    icon: '⏰',
    color: 'amber',
    gradient: 'from-amber-500/20 to-orange-500/20',
    tasks: [
      {
        id: 15,
        title: 'Monitor de uptime horario',
        description: 'Monitor de uptime horario de los 9 sitios + alerta por email o Telegram cuando alguno caiga.',
        tags: ['Uptime', 'Alertas', 'Telegram']
      },
      {
        id: 16,
        title: 'Informe semanal recurrente',
        description: 'Informe semanal recurrente cada lunes: radar IA + oportunidades + estado de mis sitios y costes.',
        tags: ['Semanal', 'Radar', 'Costes']
      },
      {
        id: 17,
        title: 'Backup diario verificado',
        description: 'Backup diario verificado GitHub + HuggingFace + IPFS, con informe nocturno de resultado.',
        tags: ['Backup', 'GitHub', 'IPFS']
      },
      {
        id: 18,
        title: 'Dashboard de costes APIs',
        description: 'Dashboard de costes de APIs (Alibaba, HF, OpenRouter) con alerta si el gasto supera un umbral.',
        tags: ['Costes', 'Dashboard', 'Alertas']
      }
    ]
  },
  {
    id: 'D',
    letter: 'D',
    title: 'PRODUCCIÓN DE ENTREGABLES',
    subtitle: 'Research → documento',
    icon: '📄',
    color: 'purple',
    gradient: 'from-purple-500/20 to-pink-500/20',
    tasks: [
      {
        id: 19,
        title: 'Dossier legal CASO_BELENTANI',
        description: 'Dossier legal CASO_BELENTANI en PDF premium con índice, bookmarks, cronología y anexos navegables.',
        tags: ['PDF', 'Legal', 'Premium']
      },
      {
        id: 20,
        title: 'Contenido vertical (Shorts/TikTok)',
        description: 'Contenido vertical (Shorts/TikTok) generado desde mis repos y canciones, y programado/publicado en las redes.',
        tags: ['Video', 'Social Media', 'Automatización']
      }
    ]
  }
];
