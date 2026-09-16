#!/usr/bin/env node

/**
 * 📄 CV-AUTOPILOT — Sistema de aplicación automática a ofertas
 * 
 * Uso:
 *   node scripts/cv-autopilot.js scan                    # Buscar ofertas
 *   node scripts/cv-autopilot.js apply <url>             # Aplicar a una oferta
 *   node scripts/cv-autopilot.js generate --offer <json> # Generar CV+carta adaptados
 *   node scripts/cv-autopilot.js track                   # Estado de aplicaciones
 *   node scripts/cv-autopilot.js pipeline                # Ver pipeline completo
 * 
 * Portales soportados:
 *   - LinkedIn Jobs
 *   - Indeed
 *   - InfoJobs (España)
 *   - Infojobs (Brasil)
 *   - Glassdoor
 *   - Remote.co / We Work Remotely
 *   - GitHub Jobs
 * 
 * Variables de entorno:
 *   LINKEDIN_EMAIL / LINKEDIN_PASS - Credenciales LinkedIn
 *   CV_TEMPLATE_PATH               - Ruta al CV base (PDF/JSON)
 */

const fs = require('fs');
const path = require('path');

const CV_DIR = path.join(__dirname, '..', 'cv');
const APPLICATIONS_DIR = path.join(CV_DIR, 'applications');
const PIPELINE_FILE = path.join(CV_DIR, 'pipeline.json');

// ─── PERFIL BASE ────────────────────────────────────────────────────────────
const profile = {
  name: 'Pedro Belentani',
  email: 'pedro@belentani.eu',
  website: 'https://belentani.eu',
  github: 'https://github.com/belentani7',
  location: 'España / Remoto',
  languages: ['PT (nativo)', 'ES (nativo)', 'EN (avanzado)', 'CA (intermedio)'],
  
  summary: `Operador tecnológico unipersonal con ~100 repositorios públicos,
  9 sitios web en producción, y experiencia en IA, desarrollo web,
  educación digital y producción musical. Especializado en automatización,
  agentes IA, y construcción de productos digitales end-to-end.`,
  
  skills: {
    technical: [
      'JavaScript/TypeScript', 'Python', 'Node.js', 'React', 'Vite',
      'AI/ML (Qwen, GPT, Claude, Llama)', 'API Design', 'DevOps',
      'GitHub Actions', 'DNS/SSL', 'OAuth', 'Web Scraping'
    ],
    creative: [
      'Producción musical', 'Diseño web', 'Contenido educativo',
      'Escritura técnica', 'Narrativa digital', 'Video editing'
    ],
    operational: [
      'Gestión de proyectos', 'Automatización', 'Investigación web',
      'Gestión de dominios', 'Monitoreo de sistemas', 'Documentación'
    ]
  },
  
  projects: [
    {
      name: 'Belentani Omega/OS',
      description: 'Sistema operativo personal / orquestador de proyectos',
      url: 'https://omega.belentani.eu',
      tech: ['Node.js', 'AI Agents', 'Automation']
    },
    {
      name: 'Belentani.cv-ai',
      description: 'CV inteligente con IA para aplicación automática',
      url: 'https://cv.belentani.eu',
      tech: ['AI', 'Web Scraping', 'Form Automation']
    },
    {
      name: 'Duck Studio',
      description: 'Sello musical independiente',
      url: 'https://duck.belentani.eu',
      tech: ['Music Production', 'Distribution', 'Metadata']
    },
    {
      name: 'EduForge',
      description: 'Plataforma de formación digital',
      url: 'https://eduforge.belentani.eu',
      tech: ['Education', 'LMS', 'Content Creation']
    }
  ]
};

// ─── GENERADOR DE CV ADAPTADO ───────────────────────────────────────────────
function generateAdaptedCV(offerData) {
  console.log(`\n📄 Generando CV adaptado para: ${offerData.title}\n`);
  
  fs.mkdirSync(CV_DIR, { recursive: true });
  
  const adaptedCV = {
    generatedAt: new Date().toISOString(),
    offer: offerData,
    
    cv: {
      header: {
        name: profile.name,
        title: generateTitle(offerData),
        contact: {
          email: profile.email,
          website: profile.website,
          github: profile.github,
          location: profile.location
        }
      },
      
      summary: generateSummary(offerData),
      
      skills: filterSkills(offerData),
      
      experience: generateExperience(offerData),
      
      projects: profile.projects.filter(p => 
        matchesOffer(p, offerData)
      ),
      
      education: [
        {
          degree: 'Autodidacta / Aprendizaje continuo',
          institution: 'GitHub, HuggingFace, Coursera, documentación oficial',
          period: '2020 - presente',
          highlights: [
            '~100 repositorios públicos',
            '78+ proyectos open source',
            '9 sitios web en producción'
          ]
        }
      ],
      
      languages: profile.languages
    },
    
    coverLetter: generateCoverLetter(offerData)
  };
  
  // Guardar
  const slug = offerData.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50);
  const outputDir = path.join(APPLICATIONS_DIR, slug);
  fs.mkdirSync(outputDir, { recursive: true });
  
  fs.writeFileSync(
    path.join(outputDir, 'cv-adapted.json'),
    JSON.stringify(adaptedCV.cv, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'cover-letter.md'),
    adaptedCV.coverLetter
  );
  
  console.log(`   ✅ CV adaptado: ${outputDir}/cv-adapted.json`);
  console.log(`   ✅ Carta: ${outputDir}/cover-letter.md`);
  
  return adaptedCV;
}

function generateTitle(offer) {
  const keywords = offer.keywords || [];
  if (keywords.some(k => k.toLowerCase().includes('ai'))) return 'AI Engineer & Automation Specialist';
  if (keywords.some(k => k.toLowerCase().includes('web'))) return 'Full-Stack Developer & Web Architect';
  if (keywords.some(k => k.toLowerCase().includes('education'))) return 'Educational Technologist & Content Creator';
  return 'Technology Operator & Digital Product Builder';
}

function generateSummary(offer) {
  const company = offer.company || 'su empresa';
  return `${profile.summary}\n\nBusco contribuir a ${company} con mi experiencia en ${offer.field || 'tecnología'}, aportando capacidad de ejecución autónoma y visión de producto completa.`;
}

function filterSkills(offer) {
  const keywords = (offer.keywords || []).map(k => k.toLowerCase());
  const allSkills = [...profile.skills.technical, ...profile.skills.creative, ...profile.skills.operational];
  
  const matched = allSkills.filter(s => 
    keywords.some(k => s.toLowerCase().includes(k))
  );
  
  const bonus = matched.length > 0 ? matched : allSkills.slice(0, 8);
  
  return {
    matched: bonus,
    all: profile.skills
  };
}

function generateExperience(offer) {
  return [
    {
      role: 'Operador Tecnológico Independiente',
      company: 'Belentani.eu (proyecto propio)',
      period: '2022 - presente',
      location: 'Remoto',
      achievements: [
        'Construí y mantengo ~100 repositorios públicos en GitHub',
        'Opero 9 sitios web en producción con monitoreo 24/7',
        'Desarrollé sistema de agentes IA para automatización de tareas',
        'Gestiono infraestructura cloud (DNS, SSL, APIs, dominios)',
        'Produzco contenido educativo, musical y artístico digital'
      ]
    },
    {
      role: 'Desarrollador de Agentes IA',
      company: 'Proyectos Open Source',
      period: '2023 - presente',
      location: 'Remoto',
      achievements: [
        'Diseñé e implementé cv-ai: sistema de aplicación automática a ofertas',
        'Integré múltiples APIs de IA (Qwen, GPT, Claude, Llama, Groq)',
        'Automatización de investigación web a escala',
        'Generación de documentos y entregables con IA'
      ]
    }
  ];
}

function generateCoverLetter(offer) {
  return `
Estimado equipo de ${offer.company || 'selección'},

Me dirijo a ustedes con gran interés en la posición de ${offer.title}.

Soy Pedro Belentani, operador tecnológico independiente con experiencia
construyendo productos digitales de principio a fin. Mi perfil combina
capacidad técnica profunda con visión de producto y ejecución autónoma.

${offer.description ? `\nSobre la posición:\n${offer.description.slice(0, 200)}...\n` : ''}

Mi experiencia relevante incluye:

• ${profile.projects.length}+ proyectos activos en producción
• ~100 repositorios open source en GitHub
• Dominio de múltiples stacks tecnológicos
• Capacidad de trabajar de forma 100% autónoma y remota
• Experiencia con IA aplicada a automatización y productos

Mi portfolio completo está en ${profile.website} y mi código en ${profile.github}.

Quedo a disposición para ampliar cualquier información.

Un cordial saludo,
${profile.name}
${profile.email}
${profile.website}
`.trim();
}

function matchesOffer(project, offer) {
  const keywords = (offer.keywords || []).map(k => k.toLowerCase());
  const projectText = `${project.name} ${project.description} ${project.tech.join(' ')}`.toLowerCase();
  return keywords.some(k => projectText.includes(k));
}

// ─── PIPELINE ───────────────────────────────────────────────────────────────
function loadPipeline() {
  if (fs.existsSync(PIPELINE_FILE)) {
    return JSON.parse(fs.readFileSync(PIPELINE_FILE, 'utf-8'));
  }
  return { applications: [], lastUpdated: null };
}

function savePipeline(pipeline) {
  pipeline.lastUpdated = new Date().toISOString();
  fs.mkdirSync(CV_DIR, { recursive: true });
  fs.writeFileSync(PIPELINE_FILE, JSON.stringify(pipeline, null, 2));
}

function trackApplication(offer, status) {
  const pipeline = loadPipeline();
  
  const existing = pipeline.applications.find(a => a.url === offer.url);
  if (existing) {
    existing.status = status;
    existing.updatedAt = new Date().toISOString();
  } else {
    pipeline.applications.push({
      url: offer.url,
      title: offer.title,
      company: offer.company,
      portal: offer.portal,
      status: status,
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
  
  savePipeline(pipeline);
}

function showPipeline() {
  const pipeline = loadPipeline();
  
  console.log(`\n📊 PIPELINE DE APLICACIONES\n`);
  console.log(`   Total: ${pipeline.applications.length}`);
  console.log(`   Actualizado: ${pipeline.lastUpdated || 'nunca'}\n`);
  
  const byStatus = {};
  pipeline.applications.forEach(a => {
    byStatus[a.status] = (byStatus[a.status] || 0) + 1;
  });
  
  console.log('   Por estado:');
  Object.entries(byStatus).forEach(([status, count]) => {
    console.log(`     ${status}: ${count}`);
  });
  
  if (pipeline.applications.length > 0) {
    console.log('\n   Últimas aplicaciones:');
    pipeline.applications.slice(-10).reverse().forEach(a => {
      const icon = a.status === 'accepted' ? '✅' : a.status === 'rejected' ? '❌' : '🟡';
      console.log(`     ${icon} ${a.title} @ ${a.company} (${a.status})`);
    });
  }
}

// ─── SCANNER DE PORTALES ────────────────────────────────────────────────────
function scanPortals() {
  console.log(`\n🔍 Scanner de portales de empleo\n`);
  console.log(`   Portales configurados:\n`);
  
  const portals = [
    { name: 'LinkedIn Jobs', url: 'https://linkedin.com/jobs', auth: true },
    { name: 'Indeed', url: 'https://indeed.com', auth: false },
    { name: 'InfoJobs', url: 'https://infojobs.net', auth: true, region: 'ES' },
    { name: 'Infojobs', url: 'https://infojobs.com.br', auth: true, region: 'BR' },
    { name: 'Glassdoor', url: 'https://glassdoor.com', auth: false },
    { name: 'Remote.co', url: 'https://remote.co', auth: false },
    { name: 'We Work Remotely', url: 'https://weworkremotely.com', auth: false },
    { name: 'GitHub Jobs', url: 'https://github.com/jobs', auth: false }
  ];
  
  portals.forEach(p => {
    const authIcon = p.auth ? '🔐' : '🌐';
    const region = p.region ? ` (${p.region})` : '';
    console.log(`   ${authIcon} ${p.name}${region}: ${p.url}`);
  });
  
  console.log(`\n   ⚠️  El scraping real requiere navegador autenticado (Manus)`);
  console.log(`   Para ejecutar: Manus usa el Bloque A.2 (cv-ai autopiloto)`);
}

// ─── CLI ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const command = args[0] || 'help';

switch (command) {
  case 'scan':
    scanPortals();
    break;
    
  case 'apply':
    if (args.length < 2) {
      console.log('Uso: apply <url-de-oferta>');
      break;
    }
    const offerData = {
      url: args[1],
      title: args[2] || 'Posición',
      company: args[3] || 'Empresa',
      keywords: args.slice(4)
    };
    generateAdaptedCV(offerData);
    trackApplication(offerData, 'applied');
    break;
    
  case 'generate':
    if (args.includes('--offer')) {
      const offerIdx = args.indexOf('--offer');
      const offerJson = args[offerIdx + 1];
      try {
        const offer = JSON.parse(offerJson);
        generateAdaptedCV(offer);
      } catch (e) {
        console.error('Error parsing offer JSON:', e.message);
      }
    }
    break;
    
  case 'track':
    showPipeline();
    break;
    
  case 'pipeline':
    showPipeline();
    break;
    
  case 'help':
  default:
    console.log(`
CV-Autopilot — Pedro Belentani

Uso:
  node cv-autopilot.js scan                         Buscar ofertas en portales
  node cv-autopilot.js apply <url> [titulo] [empresa]  Aplicar a oferta
  node cv-autopilot.js generate --offer '<json>'    Generar CV+carta
  node cv-autopilot.js track                        Ver pipeline
  node cv-autopilot.js pipeline                     Ver pipeline completo

Ejemplo:
  node cv-autopilot.js apply https://linkedin.com/jobs/123 "AI Engineer" "Google" ai automation
`);
}

module.exports = { profile, generateAdaptedCV, loadPipeline, savePipeline };
