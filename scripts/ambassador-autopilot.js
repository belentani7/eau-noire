#!/usr/bin/env node

/**
 * 🎖️ AMBASSADOR AUTOPILOT — Aplicaciones automáticas a programas de embajadores
 * 
 * Programas soportados:
 *   - Qwen Ambassador Program
 *   - HuggingFace Ambassadors
 *   - Alibaba Cloud Ambassador
 *   - OpenAI Researcher Program
 *   - Anthropic Research Access
 * 
 * Uso:
 *   node scripts/ambassador-autopilot.js list           # Listar programas
 *   node scripts/ambassador-autopilot.js apply <prog>   # Aplicar a uno
 *   node scripts/ambassador-autopilot.js status         # Estado de aplicaciones
 *   node scripts/ambassador-autopilot.js reminders      # Ver recordatorios
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'ambassadors');
const STATE_FILE = path.join(DATA_DIR, 'applications-state.json');

const programs = [
  {
    id: 'qwen-ambassador',
    name: 'Qwen Ambassador Program',
    url: 'https://qwen.ai/ambassadors',
    organization: 'Alibaba Cloud',
    benefits: ['API credits', 'Early access', 'Community'],
    requirements: ['Active GitHub', 'Blog/social presence', 'AI/ML focus'],
    deadline: 'rolling',
    status: 'pending',
    notes: 'Requiere demostrar uso de Qwen en proyectos'
  },
  {
    id: 'hf-ambassador',
    name: 'HuggingFace Ambassadors',
    url: 'https://huggingface.co/ambassadors',
    organization: 'HuggingFace',
    benefits: ['Pro account', 'Swag', 'Events access', 'Direct support'],
    requirements: ['Open source contributions', 'Community engagement', 'Technical content'],
    deadline: 'rolling',
    status: 'pending',
    notes: 'Muy competitivo — necesita portfolio sólido'
  },
  {
    id: 'alibaba-ambassador',
    name: 'Alibaba Cloud Ambassador',
    url: 'https://www.alibabacloud.com/ambassador',
    organization: 'Alibaba Cloud',
    benefits: ['Credits', 'Certifications', 'Networking'],
    requirements: ['Cloud experience', 'Content creation', 'Community building'],
    deadline: 'rolling',
    status: 'pending',
    notes: 'Enfocado en mercado global'
  },
  {
    id: 'openai-researcher',
    name: 'OpenAI Researcher Program',
    url: 'https://openai.com/researcher-access',
    organization: 'OpenAI',
    benefits: ['API access', 'Research support', 'Publications'],
    requirements: ['Research background', 'Published work', 'Novel use case'],
    deadline: 'quarterly',
    status: 'pending',
    notes: 'Necesita propuesta de investigación'
  },
  {
    id: 'anthropic-research',
    name: 'Anthropic Research Access',
    url: 'https://anthropic.com/research-access',
    organization: 'Anthropic',
    benefits: ['Claude API credits', 'Technical support'],
    requirements: ['Safety research focus', 'Academic/industry affiliation'],
    deadline: 'rolling',
    status: 'pending',
    notes: 'Enfocado en AI safety'
  },
  {
    id: 'github-stars',
    name: 'GitHub Stars Program',
    url: 'https://stars.github.com',
    organization: 'GitHub',
    benefits: ['Swag', 'Events', 'Visibility', 'Credits'],
    requirements: ['Open source contributions', 'Community influence', 'Technical expertise'],
    deadline: 'rolling',
    status: 'pending',
    notes: '~100 repos públicos es un buen starting point'
  }
];

function listPrograms() {
  console.log(`\n🎖️ Programas de Embajadores\n`);
  
  programs.forEach(p => {
    console.log(`  📌 ${p.name}`);
    console.log(`     Organización: ${p.organization}`);
    console.log(`     URL: ${p.url}`);
    console.log(`     Beneficios: ${p.benefits.join(', ')}`);
    console.log(`     Deadline: ${p.deadline}`);
    console.log(`     Estado: ${p.status}`);
    console.log('');
  });
}

function loadState() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(STATE_FILE)) {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  }
  return { applications: {}, lastUpdated: null };
}

function saveState(state) {
  state.lastUpdated = new Date().toISOString();
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function applyToProgram(programId) {
  const program = programs.find(p => p.id === programId);
  if (!program) {
    console.log(`❌ Programa no encontrado: ${programId}`);
    return;
  }
  
  console.log(`\n📝 Aplicando a: ${program.name}\n`);
  
  const state = loadState();
  state.applications[programId] = {
    program: program.name,
    appliedAt: new Date().toISOString(),
    status: 'submitted',
    form: {
      name: 'Pedro Belentani',
      email: 'pedro@belentani.eu',
      github: 'https://github.com/belentani7',
      website: 'https://belentani.eu',
      description: generateDescription(program),
      projects: generateProjectsList()
    },
    screenshots: [],
    reminders: []
  };
  
  saveState(state);
  
  console.log(`  ✅ Aplicación registrada`);
  console.log(`  📋 Datos del formulario guardados en: ${STATE_FILE}`);
  console.log(`\n  ⚠️  NOTA: El envío real requiere navegador autenticado (Manus)`);
  console.log(`  Los datos del formulario están listos para copiar/pegar.\n`);
}

function generateDescription(program) {
  return `Operador tecnológico unipersonal con ~100 repositorios públicos en GitHub,
9 sitios web en producción, y experiencia construyendo productos digitales
end-to-end con IA. Especializado en automatización, agentes IA, y
construcción de herramientas open source. Busco contribuir a ${program.organization}
como embajador compartiendo conocimiento técnico y creando contenido educativo.`;
}

function generateProjectsList() {
  return [
    'Belentani Omega/OS — Sistema operativo personal/orquestador',
    'Belentani.cv-ai — CV inteligente con IA para aplicación automática',
    'Duck Studio — Sello musical independiente',
    'EduForge — Plataforma de formación digital',
    'Noiacore Lab — 50 herramientas open source para operadores unipersonales'
  ];
}

function showStatus() {
  const state = loadState();
  
  console.log(`\n📊 Estado de Aplicaciones\n`);
  
  if (Object.keys(state.applications).length === 0) {
    console.log('   No hay aplicaciones registradas.');
    console.log('   Usa: apply <program-id>');
    return;
  }
  
  Object.entries(state.applications).forEach(([id, app]) => {
    const icon = app.status === 'accepted' ? '✅' : app.status === 'rejected' ? '❌' : '🟡';
    console.log(`  ${icon} ${app.program}`);
    console.log(`     Estado: ${app.status}`);
    console.log(`     Aplicado: ${app.appliedAt}`);
    console.log('');
  });
}

function showReminders() {
  const state = loadState();
  
  console.log(`\n⏰ Recordatorios\n`);
  
  const pending = Object.entries(state.applications)
    .filter(([_, app]) => app.status === 'submitted');
  
  if (pending.length === 0) {
    console.log('   No hay recordatorios pendientes.');
    return;
  }
  
  pending.forEach(([id, app]) => {
    console.log(`  📌 ${app.program}`);
    console.log(`     Aplicado: ${app.appliedAt}`);
    console.log(`     → Verificar estado en el portal del programa`);
    console.log('');
  });
}

// CLI
const args = process.argv.slice(2);
const command = args[0] || 'help';

switch (command) {
  case 'list': listPrograms(); break;
  case 'apply': applyToProgram(args[1]); break;
  case 'status': showStatus(); break;
  case 'reminders': showReminders(); break;
  default:
    console.log(`
Ambassador Autopilot — Noiacore Lab

Uso:
  node ambassador-autopilot.js list           Listar programas
  node ambassador-autopilot.js apply <id>     Aplicar a programa
  node ambassador-autopilot.js status         Ver estado
  node ambassador-autopilot.js reminders      Ver recordatorios
`);
}

module.exports = { programs, applyToProgram, loadState };
