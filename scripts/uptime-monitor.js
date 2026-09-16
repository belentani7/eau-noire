#!/usr/bin/env node

/**
 * 🔍 UPTIME MONITOR — Monitor horario de los 9 sitios de Pedro Belentani
 * 
 * Uso:
 *   node scripts/uptime-monitor.js                    # Una vez
 *   node scripts/uptime-monitor.js --daemon           # Ejecución continua
 *   node scripts/uptime-monitor.js --alert telegram   # Alertas por Telegram
 *   node scripts/uptime-monitor.js --alert email      # Alertas por email
 * 
 * Requiere:
 *   npm install node-cron node-fetch
 * 
 * Variables de entorno:
 *   TELEGRAM_BOT_TOKEN  - Token del bot de Telegram
 *   TELEGRAM_CHAT_ID    - Chat ID para alertas
 *   SMTP_HOST/USER/PASS - Para alertas por email
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ─── CONFIGURACIÓN DE SITIOS ────────────────────────────────────────────────
const SITES = [
  { name: 'belentani.eu', url: 'https://belentani.eu', priority: 'critical' },
  { name: 'omega-os', url: 'https://omega.belentani.eu', priority: 'critical' },
  { name: 'cv-ai', url: 'https://cv.belentani.eu', priority: 'high' },
  { name: 'duck-studio', url: 'https://duck.belentani.eu', priority: 'high' },
  { name: 'manos-abiertas', url: 'https://manosabiertas.belentani.eu', priority: 'medium' },
  { name: 'eduforge', url: 'https://eduforge.belentani.eu', priority: 'high' },
  { name: 'secure-t-university', url: 'https://secure-t.belentani.eu', priority: 'medium' },
  { name: 'lingua-aberta', url: 'https://lingua.belentani.eu', priority: 'medium' },
  { name: 'carquidec', url: 'https://carquidec.belentani.eu', priority: 'low' }
];

const CHECK_INTERVAL = 60 * 60 * 1000; // 1 hora
const TIMEOUT = 10000; // 10 segundos
const LOG_DIR = path.join(__dirname, '..', 'logs', 'uptime');

// ─── VERIFICACIÓN HTTP ──────────────────────────────────────────────────────
function checkSite(site) {
  return new Promise((resolve) => {
    const start = Date.now();
    const client = site.url.startsWith('https') ? https : http;
    
    const req = client.get(site.url, { timeout: TIMEOUT }, (res) => {
      const latency = Date.now() - start;
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          site: site.name,
          url: site.url,
          status: res.statusCode,
          latency: latency,
          timestamp: new Date().toISOString(),
          isUp: res.statusCode >= 200 && res.statusCode < 400,
          priority: site.priority,
          ssl: res.socket?.authorized !== false,
          headers: {
            'content-type': res.headers['content-type'],
            'server': res.headers['server'],
            'x-github-request-id': res.headers['x-github-request-id']
          }
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        site: site.name,
        url: site.url,
        status: 0,
        latency: Date.now() - start,
        timestamp: new Date().toISOString(),
        isUp: false,
        error: err.message,
        priority: site.priority
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        site: site.name,
        url: site.url,
        status: 0,
        latency: TIMEOUT,
        timestamp: new Date().toISOString(),
        isUp: false,
        error: 'Timeout',
        priority: site.priority
      });
    });
  });
}

// ─── SISTEMA DE ALERTAS ─────────────────────────────────────────────────────
async function sendTelegramAlert(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!token || !chatId) {
    console.log('⚠️  Telegram no configurado (falta TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID)');
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const data = JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' });

  return new Promise((resolve) => {
    const req = https.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve(true));
    });
    req.on('error', (e) => console.error('Error Telegram:', e.message));
    req.write(data);
    req.end();
  });
}

async function sendEmailAlert(subject, body) {
  // Placeholder — requiere nodemailer
  console.log(`📧 Email alert: ${subject}`);
  console.log(body);
}

// ─── LOGGING ────────────────────────────────────────────────────────────────
function saveResults(results) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  
  const date = new Date().toISOString().split('T')[0];
  const logFile = path.join(LOG_DIR, `uptime-${date}.json`);
  
  let existing = [];
  if (fs.existsSync(logFile)) {
    existing = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
  }
  
  existing.push({
    checkTime: new Date().toISOString(),
    results: results
  });
  
  fs.writeFileSync(logFile, JSON.stringify(existing, null, 2));
}

function generateReport(results) {
  const up = results.filter(r => r.isUp);
  const down = results.filter(r => !r.isUp);
  const avgLatency = up.length > 0 
    ? Math.round(up.reduce((sum, r) => sum + r.latency, 0) / up.length)
    : 0;

  let report = `\n${'═'.repeat(60)}\n`;
  report += `  📊 UPTIME REPORT — ${new Date().toLocaleString('es-ES')}\n`;
  report += `${'═'.repeat(60)}\n\n`;
  report += `  ✅ Up: ${up.length}/${results.length}  |  ❌ Down: ${down.length}\n`;
  report += `  ⚡ Latencia media: ${avgLatency}ms\n\n`;

  results.forEach(r => {
    const icon = r.isUp ? '✅' : '❌';
    const latency = r.isUp ? `${r.latency}ms` : r.error || 'DOWN';
    report += `  ${icon} ${r.site.padEnd(25)} ${latency.padEnd(15)} ${r.url}\n`;
  });

  report += `\n${'═'.repeat(60)}\n`;
  return report;
}

// ─── EJECUCIÓN PRINCIPAL ────────────────────────────────────────────────────
async function runCheck() {
  console.log(`\n🔍 Checking ${SITES.length} sites...\n`);
  
  const results = await Promise.all(SITES.map(checkSite));
  const downSites = results.filter(r => !r.isUp);
  
  // Guardar resultados
  saveResults(results);
  
  // Imprimir reporte
  console.log(generateReport(results));
  
  // Alertas si hay sitios caídos
  if (downSites.length > 0) {
    const criticalDown = downSites.filter(r => r.priority === 'critical');
    const alertMsg = `🚨 <b>ALERTA UPTIME</b>\n\n` +
      `❌ ${downSites.length} sitio(s) caído(s):\n\n` +
      downSites.map(r => `• <b>${r.site}</b> — ${r.error || `HTTP ${r.status}`}`).join('\n') +
      (criticalDown.length > 0 ? `\n\n⚠️ ${criticalDown.length} sitio(s) CRÍTICO(S)` : '');
    
    await sendTelegramAlert(alertMsg);
  }
  
  return results;
}

async function runDaemon() {
  console.log('🔄 Uptime Monitor en modo daemon (cada hora)');
  console.log('   Ctrl+C para detener\n');
  
  await runCheck();
  
  setInterval(async () => {
    await runCheck();
  }, CHECK_INTERVAL);
}

// ─── CLI ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.includes('--daemon')) {
  runDaemon();
} else if (args.includes('--help')) {
  console.log(`
Uptime Monitor — Pedro Belentani

Uso:
  node uptime-monitor.js              Ejecutar una vez
  node uptime-monitor.js --daemon     Modo continuo (cada hora)
  node uptime-monitor.js --help       Esta ayuda

Variables de entorno:
  TELEGRAM_BOT_TOKEN   Token del bot de Telegram
  TELEGRAM_CHAT_ID     Chat ID para recibir alertas

Archivos generados:
  logs/uptime/uptime-YYYY-MM-DD.json   Historial de checks
`);
} else {
  runCheck().then(() => process.exit(0));
}

module.exports = { checkSite, runCheck, SITES };
