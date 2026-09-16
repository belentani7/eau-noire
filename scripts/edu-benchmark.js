#!/usr/bin/env node

/**
 * 🎓 EDUCATIONAL PLATFORMS BENCHMARK
 * 
 * Uso:
 *   node scripts/edu-benchmark.js                        # Benchmark completo
 *   node scripts/edu-benchmark.js --compare              # Comparativa directa
 *   node scripts/edu-benchmark.js --export csv           # Exportar hoja de cálculo
 *   node scripts/edu-benchmark.js --category <cat>       # Filtrar por categoría
 * 
 * Plataformas analizadas:
 *   Coursera, edX, Platzi, UX Academy, Udemy, Domestika,
 *   Khan Academy, eduforge (propia)
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'output');
const DATA_DIR = path.join(__dirname, '..', 'data', 'benchmark');

// ─── DATOS DE PLATAFORMAS ───────────────────────────────────────────────────
const platforms = [
  {
    id: 'coursera',
    name: 'Coursera',
    url: 'https://coursera.org',
    emoji: '🎓',
    founded: 2012,
    hq: 'Mountain View, CA',
    
    metrics: {
      courses: 7000,
      specializations: 900,
      degrees: 40,
      universities: 300,
      learners: '150M+',
      countries: 190
    },
    
    pricing: {
      free: true,
      freeDetails: 'Auditar cursos gratis (sin certificado)',
      subscription: '$49/mes (Coursera Plus)',
      perCourse: '$49-$99 por certificado',
      degree: '$9,000-$45,000',
      enterprise: 'Desde $399/año por usuario'
    },
    
    tech: {
      videoStreaming: true,
      interactiveExercises: true,
      peerGrading: true,
      mobileApp: true,
      offlineAccess: true,
      api: false,
      whiteLabel: false,
      aiFeatures: ['Coursera Coach (GPT-4)', 'Recomendaciones IA']
    },
    
    strengths: ['Prestigio universitario', 'Certificados reconocidos', 'Variedad enorme'],
    weaknesses: ['Precio elevado', 'Ritmo lento', 'Poco práctico'],
    
    relevance: {
      competition: 'alta',
      inspiration: 'media',
      partnership: 'baja'
    }
  },
  
  {
    id: 'edx',
    name: 'edX',
    url: 'https://edx.org',
    emoji: '🏛️',
    founded: 2012,
    hq: 'Cambridge, MA (2U Inc.)',
    
    metrics: {
      courses: 4000,
      specializations: 500,
      degrees: 30,
      universities: 160,
      learners: '50M+',
      countries: 190
    },
    
    pricing: {
      free: true,
      freeDetails: 'Auditar gratis (sin verificación)',
      subscription: 'No tiene suscripción global',
      perCourse: '$50-$300 por verificación',
      degree: '$10,000-$60,000',
      enterprise: 'edX for Business — custom pricing'
    },
    
    tech: {
      videoStreaming: true,
      interactiveExercises: true,
      peerGrading: true,
      mobileApp: true,
      offlineAccess: false,
      api: true,
      whiteLabel: false,
      aiFeatures: 'Limitados'
    },
    
    strengths: ['MIT/Harvard backing', 'Open source (Open edX)', 'Rigor académico'],
    weaknesses: ['Adquirido por 2U (menos abierto)', 'UX anticuada', 'Precios altos'],
    
    relevance: {
      competition: 'media',
      inspiration: 'alta',
      partnership: 'baja'
    }
  },
  
  {
    id: 'platzi',
    name: 'Platzi',
    url: 'https://platzi.com',
    emoji: '🟢',
    founded: 2014,
    hq: 'Miami / Bogotá',
    
    metrics: {
      courses: 2000,
      specializations: 80,
      degrees: 0,
      universities: 0,
      learners: '5M+',
      countries: 40
    },
    
    pricing: {
      free: false,
      freeDetails: 'Trial de 7 días',
      subscription: '$15-$40/mes (básico/expert/expert+)',
      perCourse: 'No vende individual',
      degree: 'No ofrece',
      enterprise: 'Platzi para Empresas — custom'
    },
    
    tech: {
      videoStreaming: true,
      interactiveExercises: true,
      peerGrading: false,
      mobileApp: true,
      offlineAccess: true,
      api: false,
      whiteLabel: false,
      aiFeatures: ['Platzi AI (reciente)', 'Rutas de aprendizaje adaptativas']
    },
    
    strengths: ['Enfoque LATAM', 'Comunidad activa', 'Precio accesible', 'Contenido actualizado'],
    weaknesses: ['Solo suscripción', 'Sin certificados universitarios', 'Calidad variable'],
    
    relevance: {
      competition: 'alta',
      inspiration: 'alta',
      partnership: 'media'
    }
  },
  
  {
    id: 'ux-academy',
    name: 'UX Academy',
    url: 'https://uxacademy.es',
    emoji: '🎨',
    founded: 2016,
    hq: 'Madrid, España',
    
    metrics: {
      courses: 15,
      specializations: 5,
      degrees: 0,
      universities: 0,
      learners: '10K+',
      countries: 5
    },
    
    pricing: {
      free: false,
      freeDetails: 'Webinars gratuitos ocasionales',
      subscription: 'No tiene',
      perCourse: '€2,000-€4,000 por bootcamp',
      degree: 'No ofrece',
      enterprise: 'Formación in-company'
    },
    
    tech: {
      videoStreaming: true,
      interactiveExercises: true,
      peerGrading: true,
      mobileApp: false,
      offlineAccess: false,
      api: false,
      whiteLabel: false,
      aiFeatures: 'Mínimos'
    },
    
    strengths: ['Mentoría 1:1', 'Portfolio real', 'Bolsa de empleo', 'Calidad premium'],
    weaknesses: ['Precio muy alto', 'Pocos cursos', 'Solo UX/UI'],
    
    relevance: {
      competition: 'baja',
      inspiration: 'media',
      partnership: 'baja'
    }
  },
  
  {
    id: 'udemy',
    name: 'Udemy',
    url: 'https://udemy.com',
    emoji: '🟣',
    founded: 2010,
    hq: 'San Francisco, CA',
    
    metrics: {
      courses: 210000,
      specializations: 0,
      degrees: 0,
      universities: 0,
      learners: '60M+',
      countries: 180
    },
    
    pricing: {
      free: true,
      freeDetails: 'Algunos cursos gratis',
      subscription: 'Udemy Personal Plan $16.99/mes',
      perCourse: '$9.99-$199.99 (ofertas frecuentes)',
      degree: 'No ofrece',
      enterprise: 'Udemy Business — $360/año por usuario'
    },
    
    tech: {
      videoStreaming: true,
      interactiveExercises: true,
      peerGrading: false,
      mobileApp: true,
      offlineAccess: true,
      api: true,
      whiteLabel: true,
      aiFeatures: ['Udemy AI (búsqueda)', 'Recomendaciones']
    },
    
    strengths: ['Catálogo masivo', 'Precios bajos', 'Marketplace abierto', 'Cualquiera puede enseñar'],
    weaknesses: ['Calidad muy variable', 'Sin prestigio', 'Saturado'],
    
    relevance: {
      competition: 'alta',
      inspiration: 'media',
      partnership: 'media'
    }
  },
  
  {
    id: 'domestika',
    name: 'Domestika',
    url: 'https://domestika.org',
    emoji: '🟠',
    founded: 2013,
    hq: 'Barcelona, España',
    
    metrics: {
      courses: 5000,
      specializations: 30,
      degrees: 0,
      universities: 0,
      learners: '10M+',
      countries: 150
    },
    
    pricing: {
      free: false,
      freeDetails: 'Algunos recursos gratis',
      subscription: 'Domestika Plus $9/mes',
      perCourse: '€9.99-€39.99',
      degree: 'No ofrece',
      enterprise: 'Domestika para Empresas'
    },
    
    tech: {
      videoStreaming: true,
      interactiveExercises: false,
      peerGrading: true,
      mobileApp: true,
      offlineAccess: true,
      api: false,
      whiteLabel: false,
      aiFeatures: 'Mínimos'
    },
    
    strengths: ['Producción premium', 'Enfoque creativo', 'Comunidad hispana', 'Precios accesibles'],
    weaknesses: ['Solo creativo', 'Poco interactivo', 'Sin certificados formales'],
    
    relevance: {
      competition: 'media',
      inspiration: 'alta',
      partnership: 'alta'
    }
  },
  
  {
    id: 'eduforge',
    name: 'EduForge (Propia)',
    url: 'https://eduforge.belentani.eu',
    emoji: '🔨',
    founded: 2024,
    hq: 'belentani.eu',
    
    metrics: {
      courses: 0,
      specializations: 0,
      degrees: 0,
      universities: 0,
      learners: 0,
      countries: 0
    },
    
    pricing: {
      free: true,
      freeDetails: 'Modelo a definir',
      subscription: 'Por definir',
      perCourse: 'Por definir',
      degree: 'No',
      enterprise: 'Posible'
    },
    
    tech: {
      videoStreaming: false,
      interactiveExercises: false,
      peerGrading: false,
      mobileApp: false,
      offlineAccess: false,
      api: true,
      whiteLabel: true,
      aiFeatures: ['IA integrada desde el diseño']
    },
    
    strengths: ['Control total', 'IA nativa', 'Sin intermediarios', 'Multi-idioma (PT>ES>EN>CA)'],
    weaknesses: ['Sin audiencia', 'Sin contenido', 'Sin infraestructura'],
    
    relevance: {
      competition: 'N/A (propia)',
      inspiration: 'N/A',
      partnership: 'N/A'
    }
  }
];

// ─── BENCHMARK ──────────────────────────────────────────────────────────────
function runBenchmark() {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  🎓 EDUCATIONAL PLATFORMS BENCHMARK`);
  console.log(`  ${new Date().toLocaleString('es-ES')}`);
  console.log(`${'═'.repeat(70)}\n`);
  
  platforms.forEach(p => {
    console.log(`  ${p.emoji} ${p.name} (${p.hq})`);
    console.log(`     Fundada: ${p.founded} | Cursos: ${p.metrics.courses} | Learners: ${p.metrics.learners}`);
    console.log(`     Precio: ${p.pricing.perCourse || p.pricing.subscription}`);
    console.log(`     Fortaleza: ${p.strengths[0]}`);
    console.log(`     Debilidad: ${p.weaknesses[0]}`);
    console.log('');
  });
  
  return platforms;
}

// ─── EXPORT CSV ─────────────────────────────────────────────────────────────
function exportCSV() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  const headers = [
    'Plataforma', 'URL', 'Fundada', 'Sede', 'Cursos', 'Learners',
    'Precio/curso', 'Suscripción', 'API', 'White Label', 'IA',
    'Fortaleza principal', 'Debilidad principal'
  ];
  
  const rows = platforms.map(p => [
    p.name,
    p.url,
    p.founded,
    p.hq,
    p.metrics.courses,
    p.metrics.learners,
    p.pricing.perCourse || '',
    p.pricing.subscription || '',
    p.tech.api ? 'Sí' : 'No',
    p.tech.whiteLabel ? 'Sí' : 'No',
    p.tech.aiFeatures.join('; '),
    p.strengths[0],
    p.weaknesses[0]
  ]);
  
  const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
  
  const csvPath = path.join(OUTPUT_DIR, 'edu-benchmark.csv');
  fs.writeFileSync(csvPath, csv);
  
  console.log(`\n📊 CSV exportado: ${csvPath}`);
  console.log(`   ${platforms.length} plataformas × ${headers.length} columnas`);
}

// ─── COMPARATIVA vs EDUFORGE ────────────────────────────────────────────────
function compareWithEduforge() {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  📊 COMPARATIVA vs EDUFORGE (tu plataforma)`);
  console.log(`${'═'.repeat(70)}\n`);
  
  const eduforge = platforms.find(p => p.id === 'eduforge');
  const competitors = platforms.filter(p => p.id !== 'eduforge');
  
  console.log(`  OPORTUNIDADES PARA EDUFORGE:\n`);
  
  console.log(`  1. IA NATIVA — Ninguna plataforma tiene IA integrada desde el diseño`);
  console.log(`     → Ventaja: Tutor IA, evaluación automática, contenido adaptativo`);
  console.log(`     → Referencia: Coursera Coach (GPT-4) es un add-on, no el core\n`);
  
  console.log(`  2. MULTI-IDIOMA (PT > ES > EN > CA) — Nicho desatendido`);
  console.log(`     → Ventaja: Mercado lusófono (260M) + hispano (500M) combinados`);
  console.log(`     → Referencia: Platzi solo tiene ES/PT, Domestika ES/PT/EN\n`);
  
  console.log(`  3. API-FIRST — Solo Udemy y edX tienen API`);
  console.log(`     → Ventaja: Integración con herramientas, automatización`);
  console.log(`     → Referencia: Tu experiencia con APIs de IA\n`);
  
  console.log(`  4. PRECIO — Gap entre Platzi ($15/mes) y UX Academy (€2000+)`);
  console.log(`     → Oportunidad: Modelo freemium + premium accesible`);
  console.log(`     → Referencia: Domestika (€10/curso) funciona bien\n`);
  
  console.log(`  5. CONTENIDO PROPIO — Control total vs marketplace`);
  console.log(`     → Ventaja: Calidad garantizada, marca coherente`);
  console.log(`     → Referencia: UX Academy (calidad premium, catálogo pequeño)\n`);
  
  console.log(`  MODELO SUGERIDO PARA EDUFORGE:\n`);
  console.log(`     • Free: Cursos introductorios + comunidad`);
  console.log(`     • Pro ($9-15/mes): Todos los cursos + certificaciones`);
  console.log(`     • Premium ($29-49/mes): Mentoría IA + proyectos reales`);
  console.log(`     • Enterprise: Custom para empresas\n`);
}

// ─── PERSISTENCIA ───────────────────────────────────────────────────────────
function saveBenchmark() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  
  const date = new Date().toISOString().split('T')[0];
  const file = path.join(DATA_DIR, `benchmark-${date}.json`);
  
  fs.writeFileSync(file, JSON.stringify({
    date,
    platforms,
    generatedBy: 'edu-benchmark.js'
  }, null, 2));
  
  console.log(`\n📁 Datos guardados: ${file}`);
}

// ─── CLI ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.log(`
Educational Platforms Benchmark

Uso:
  node edu-benchmark.js                    Benchmark completo
  node edu-benchmark.js --compare          Comparativa vs EduForge
  node edu-benchmark.js --export csv       Exportar hoja de cálculo
  node edu-benchmark.js --help             Ayuda
`);
} else if (args.includes('--compare')) {
  compareWithEduforge();
} else if (args.includes('--export')) {
  runBenchmark();
  exportCSV();
} else {
  runBenchmark();
  saveBenchmark();
}

module.exports = { platforms, runBenchmark, exportCSV };
