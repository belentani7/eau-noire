#!/usr/bin/env node
/**
 * 📋 TOOL REGISTRY — Registro central de las 50 herramientas Noiacore Lab
 */
const fs = require('fs');
const path = require('path');

const tools = [
  // BLOQUE A — OPERAR EN LA WEB (10)
  { id: 1, name: 'ambassador-autopilot', script: 'ambassador-autopilot.js', block: 'A', status: 'ready' },
  { id: 2, name: 'cv-autopilot', script: 'cv-autopilot.js', block: 'A', status: 'ready' },
  { id: 3, name: 'duck-studio-distribution', script: 'duck-studio-distribution.js', block: 'A', status: 'ready' },
  { id: 4, name: 'gumroad-publisher', script: 'gumroad-publisher.js', block: 'A', status: 'ready' },
  { id: 5, name: 'secret-rotator', script: 'secret-rotator.js', block: 'A', status: 'ready' },
  { id: 6, name: 'dns-manager', script: 'dns-manager.js', block: 'A', status: 'ready' },
  { id: 7, name: 'oauth-connector', script: 'oauth-connector.js', block: 'A', status: 'ready' },
  { id: 8, name: 'domain-registrar', script: 'noiacore-research.js domains', block: 'A', status: 'ready' },
  { id: 9, name: 'form-filler', script: 'ambassador-autopilot.js', block: 'A', status: 'ready' },
  { id: 10, name: 'web-session-manager', script: 'oauth-connector.js', block: 'A', status: 'ready' },
  
  // BLOQUE B — INVESTIGACIÓN WEB (10)
  { id: 11, name: 'edu-benchmark', script: 'edu-benchmark.js', block: 'B', status: 'ready' },
  { id: 12, name: 'grants-scout', script: 'noiacore-research.js grants', block: 'B', status: 'ready' },
  { id: 13, name: 'jurisprudence-finder', script: 'noiacore-research.js jurisprudence', block: 'B', status: 'ready' },
  { id: 14, name: 'ai-providers-radar', script: 'ai-providers-radar.js', block: 'B', status: 'ready' },
  { id: 15, name: 'domain-study', script: 'noiacore-research.js domains', block: 'B', status: 'ready' },
  { id: 16, name: 'freelance-scraper', script: 'noiacore-research.js freelance', block: 'B', status: 'ready' },
  { id: 17, name: 'competitor-monitor', script: 'noiacore-research.js competitors', block: 'B', status: 'ready' },
  { id: 18, name: 'news-aggregator', script: 'noiacore-research.js news', block: 'B', status: 'ready' },
  { id: 19, name: 'pricing-tracker', script: 'noiacore-research.js pricing', block: 'B', status: 'ready' },
  { id: 20, name: 'trend-analyzer', script: 'noiacore-research.js trends', block: 'B', status: 'ready' },
  
  // BLOQUE C — TAREAS PROGRAMADAS 24/7 (10)
  { id: 21, name: 'uptime-monitor', script: 'uptime-monitor.js', block: 'C', status: 'ready' },
  { id: 22, name: 'weekly-reporter', script: 'noiacore-scheduler.js weekly-report', block: 'C', status: 'ready' },
  { id: 23, name: 'backup-verifier', script: 'backup-verifier.js', block: 'C', status: 'ready' },
  { id: 24, name: 'api-costs-dashboard', script: 'api-costs-dashboard.js', block: 'C', status: 'ready' },
  { id: 25, name: 'cron-scheduler', script: 'noiacore-scheduler.js cron', block: 'C', status: 'ready' },
  { id: 26, name: 'health-checker', script: 'noiacore-scheduler.js health', block: 'C', status: 'ready' },
  { id: 27, name: 'log-rotator', script: 'noiacore-scheduler.js log-rotate', block: 'C', status: 'ready' },
  { id: 28, name: 'certificate-monitor', script: 'noiacore-scheduler.js certs', block: 'C', status: 'ready' },
  { id: 29, name: 'dependency-updater', script: 'noiacore-scheduler.js deps', block: 'C', status: 'ready' },
  { id: 30, name: 'anomaly-detector', script: 'noiacore-scheduler.js anomaly', block: 'C', status: 'ready' },
  
  // BLOQUE D — PRODUCCIÓN DE ENTREGABLES (10)
  { id: 31, name: 'dossier-generator', script: 'dossier-generator.js', block: 'D', status: 'ready' },
  { id: 32, name: 'video-content-creator', script: 'noiacore-deliverables.js video', block: 'D', status: 'ready' },
  { id: 33, name: 'report-builder', script: 'noiacore-deliverables.js report', block: 'D', status: 'ready' },
  { id: 34, name: 'presentation-maker', script: 'noiacore-deliverables.js presentation', block: 'D', status: 'ready' },
  { id: 35, name: 'newsletter-compiler', script: 'noiacore-deliverables.js newsletter', block: 'D', status: 'ready' },
  { id: 36, name: 'ebook-generator', script: 'noiacore-deliverables.js ebook', block: 'D', status: 'ready' },
  { id: 37, name: 'invoice-generator', script: 'noiacore-deliverables.js invoice', block: 'D', status: 'ready' },
  { id: 38, name: 'contract-templater', script: 'noiacore-deliverables.js contract', block: 'D', status: 'ready' },
  { id: 39, name: 'documentation-builder', script: 'noiacore-deliverables.js docs', block: 'D', status: 'ready' },
  { id: 40, name: 'portfolio-builder', script: 'noiacore-deliverables.js portfolio', block: 'D', status: 'ready' },
  
  // BLOQUE E — HERRAMIENTAS AUXILIARES (10)
  { id: 41, name: 'config-validator', script: 'noiacore-utils.js config-validate', block: 'E', status: 'ready' },
  { id: 42, name: 'env-manager', script: 'noiacore-utils.js env', block: 'E', status: 'ready' },
  { id: 43, name: 'checksum-verifier', script: 'noiacore-utils.js checksum', block: 'E', status: 'ready' },
  { id: 44, name: 'markdown-prettifier', script: 'noiacore-utils.js md-prettify', block: 'E', status: 'ready' },
  { id: 45, name: 'json-transformer', script: 'noiacore-utils.js json-transform', block: 'E', status: 'ready' },
  { id: 46, name: 'csv-analyzer', script: 'noiacore-utils.js csv-analyze', block: 'E', status: 'ready' },
  { id: 47, name: 'git-automation', script: 'noiacore-utils.js git', block: 'E', status: 'ready' },
  { id: 48, name: 'notification-hub', script: 'noiacore-utils.js notify', block: 'E', status: 'ready' },
  { id: 49, name: 'audit-logger', script: 'noiacore-utils.js audit', block: 'E', status: 'ready' },
  { id: 50, name: 'cli-dashboard', script: 'noiacore-utils.js dashboard', block: 'E', status: 'ready' }
];

function listTools(block) {
  const filtered = block ? tools.filter(t => t.block === block.toUpperCase()) : tools;
  
  console.log(`\n🖤 NOIACORE LAB — ${filtered.length} Herramientas\n`);
  
  const blocks = { A: [], B: [], C: [], D: [], E: [] };
  filtered.forEach(t => blocks[t.block].push(t));
  
  Object.entries(blocks).forEach(([block, tools]) => {
    if (tools.length === 0) return;
    console.log(`  BLOQUE ${block} (${tools.length} herramientas)`);
    tools.forEach(t => {
      const icon = t.status === 'ready' ? '✅' : '🔨';
      console.log(`    ${icon} #${String(t.id).padStart(2, '0')} ${t.name}`);
      console.log(`         node scripts/${t.script}`);
    });
    console.log('');
  });
}

function exportRegistry() {
  const registryFile = path.join(__dirname, '..', 'data', 'tool-registry.json');
  fs.mkdirSync(path.dirname(registryFile), { recursive: true });
  fs.writeFileSync(registryFile, JSON.stringify({ tools, exportedAt: new Date().toISOString() }, null, 2));
  console.log(`✅ Registry exportado: ${registryFile}`);
}

function showStats() {
  console.log(`\n📊 Estadísticas Noiacore Lab\n`);
  console.log(`  Total herramientas: ${tools.length}`);
  console.log(`  Listas: ${tools.filter(t => t.status === 'ready').length}`);
  console.log(`  En desarrollo: ${tools.filter(t => t.status === 'development').length}`);
  console.log('');
  console.log('  Por bloque:');
  ['A', 'B', 'C', 'D', 'E'].forEach(b => {
    const count = tools.filter(t => t.block === b).length;
    console.log(`    Bloque ${b}: ${count} herramientas`);
  });
}

const args = process.argv.slice(2);
switch (args[0]) {
  case 'list': listTools(args[1]); break;
  case 'export': exportRegistry(); break;
  case 'stats': showStats(); break;
  default:
    console.log(`
Tool Registry — Noiacore Lab

Uso:
  node tool-registry.js list [bloque]    Listar herramientas
  node tool-registry.js export           Exportar registry JSON
  node tool-registry.js stats            Estadísticas
`);
}

module.exports = { tools };
