#!/usr/bin/env node

/**
 * 💰 API COSTS DASHBOARD — Monitor de gastos en APIs de IA
 * 
 * Uso:
 *   node scripts/api-costs-dashboard.js                   # Dashboard actual
 *   node scripts/api-costs-dashboard.js --alert           # Con alertas
 *   node scripts/api-costs-dashboard.js --history 7       # Últimos 7 días
 *   node scripts/api-costs-dashboard.js --export csv      # Exportar datos
 * 
 * APIs monitorizadas:
 *   - Alibaba Cloud (DashScope / Qwen)
 *   - HuggingFace Inference API
 *   - OpenRouter
 *   - Groq
 * 
 * Variables de entorno:
 *   ALIBABA_API_KEY       - Clave de Alibaba Cloud
 *   HF_TOKEN              - Token de HuggingFace
 *   OPENROUTER_API_KEY    - Clave de OpenRouter
 *   GROQ_API_KEY          - Clave de Groq
 *   COST_ALERT_THRESHOLD  - Umbral de alerta en USD (default: 10)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const COSTS_DIR = path.join(__dirname, '..', 'logs', 'costs');
const ALERT_THRESHOLD = parseFloat(process.env.COST_ALERT_THRESHOLD || '10');

// ─── PROVEEDORES ────────────────────────────────────────────────────────────
const providers = {
  alibaba: {
    name: 'Alibaba Cloud (DashScope)',
    emoji: '🟠',
    color: 'orange',
    checkBalance: async () => {
      const key = process.env.ALIBABA_API_KEY;
      if (!key) return { status: 'no-config', message: 'ALIBABA_API_KEY no configurada' };
      
      try {
        // DashScope usage API
        const data = await httpRequest({
          hostname: 'dashscope.aliyuncs.com',
          path: '/api/v1/usage',
          headers: { 'Authorization': `Bearer ${key}` }
        });
        
        return {
          status: 'ok',
          tokens_used: data.total_tokens || 0,
          tokens_remaining: data.remaining_tokens || 'N/A',
          estimated_cost_usd: data.estimated_cost || 0,
          plan: data.plan || 'Token Plan',
          period: data.period || 'monthly'
        };
      } catch (err) {
        return { status: 'error', message: err.message };
      }
    }
  },
  
  huggingface: {
    name: 'HuggingFace Inference',
    emoji: '🤗',
    color: 'yellow',
    checkBalance: async () => {
      const token = process.env.HF_TOKEN;
      if (!token) return { status: 'no-config', message: 'HF_TOKEN no configurado' };
      
      try {
        const data = await httpRequest({
          hostname: 'huggingface.co',
          path: '/api/whoami-v2',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        return {
          status: 'ok',
          plan: data.plan || 'free',
          is_pro: data.isPro || false,
          monthly_usage: data.monthlyUsage || 0,
          monthly_limit: data.monthlyLimit || 'unlimited'
        };
      } catch (err) {
        return { status: 'error', message: err.message };
      }
    }
  },
  
  openrouter: {
    name: 'OpenRouter',
    emoji: '🔀',
    color: 'blue',
    checkBalance: async () => {
      const key = process.env.OPENROUTER_API_KEY;
      if (!key) return { status: 'no-config', message: 'OPENROUTER_API_KEY no configurada' };
      
      try {
        const data = await httpRequest({
          hostname: 'openrouter.ai',
          path: '/api/v1/auth/key',
          headers: { 'Authorization': `Bearer ${key}` }
        });
        
        return {
          status: 'ok',
          credits_remaining: data.data?.credits_remaining || 0,
          total_spent: data.data?.total_spent || 0,
          limit: data.data?.limit || 'unlimited'
        };
      } catch (err) {
        return { status: 'error', message: err.message };
      }
    }
  },
  
  groq: {
    name: 'Groq',
    emoji: '⚡',
    color: 'red',
    checkBalance: async () => {
      const key = process.env.GROQ_API_KEY;
      if (!key) return { status: 'no-config', message: 'GROQ_API_KEY no configurada' };
      
      try {
        // Groq no tiene API pública de balance, simulamos con rate limits
        const data = await httpRequest({
          hostname: 'api.groq.com',
          path: '/openai/v1/models',
          headers: { 'Authorization': `Bearer ${key}` }
        });
        
        return {
          status: 'ok',
          models_available: data.data?.length || 0,
          rate_limit: '30 req/min (free tier)',
          note: 'Groq no expone balance directamente — estimar por uso local'
        };
      } catch (err) {
        return { status: 'error', message: err.message };
      }
    }
  }
};

// ─── HTTP HELPER ────────────────────────────────────────────────────────────
function httpRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`JSON parse error: ${data.slice(0, 100)}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

// ─── DASHBOARD ──────────────────────────────────────────────────────────────
async function renderDashboard() {
  console.log(`\n${'═'.repeat(65)}`);
  console.log(`  💰 API COSTS DASHBOARD — Pedro Belentani`);
  console.log(`  ${new Date().toLocaleString('es-ES')}`);
  console.log(`${'═'.repeat(65)}\n`);
  
  const results = {};
  let totalCost = 0;
  let alerts = [];
  
  for (const [key, provider] of Object.entries(providers)) {
    process.stdout.write(`  ${provider.emoji} ${provider.name}... `);
    const result = await provider.checkBalance();
    results[key] = result;
    
    if (result.status === 'ok') {
      const cost = result.estimated_cost_usd || result.total_spent || 0;
      totalCost += cost;
      console.log(`✅ $${cost.toFixed(2)}`);
      
      if (cost > ALERT_THRESHOLD) {
        alerts.push(`${provider.name}: $${cost.toFixed(2)} (supera umbral $${ALERT_THRESHOLD})`);
      }
    } else if (result.status === 'no-config') {
      console.log(`⚠️  No configurado`);
    } else {
      console.log(`❌ ${result.message}`);
    }
  }
  
  console.log(`\n${'─'.repeat(65)}`);
  console.log(`  💵 Coste total estimado: $${totalCost.toFixed(2)}`);
  console.log(`  🎯 Umbral de alerta: $${ALERT_THRESHOLD}`);
  
  if (alerts.length > 0) {
    console.log(`\n  🚨 ALERTAS:`);
    alerts.forEach(a => console.log(`     ⚠️  ${a}`));
  }
  
  console.log(`\n${'═'.repeat(65)}\n`);
  
  return { results, totalCost, alerts };
}

// ─── PERSISTENCIA ───────────────────────────────────────────────────────────
function saveCostSnapshot(data) {
  fs.mkdirSync(COSTS_DIR, { recursive: true });
  
  const date = new Date().toISOString().split('T')[0];
  const file = path.join(COSTS_DIR, `costs-${date}.json`);
  
  let existing = [];
  if (fs.existsSync(file)) {
    existing = JSON.parse(fs.readFileSync(file, 'utf-8'));
  }
  
  existing.push({
    timestamp: new Date().toISOString(),
    ...data
  });
  
  fs.writeFileSync(file, JSON.stringify(existing, null, 2));
}

// ─── EXPORT CSV ─────────────────────────────────────────────────────────────
function exportCSV(days) {
  fs.mkdirSync(COSTS_DIR, { recursive: true });
  
  const files = fs.readdirSync(COSTS_DIR)
    .filter(f => f.startsWith('costs-'))
    .sort()
    .slice(-days);
  
  let csv = 'date,timestamp,provider,total_cost_usd,alerts\n';
  
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(COSTS_DIR, file), 'utf-8'));
    for (const entry of data) {
      csv += `${file.replace('costs-', '').replace('.json', '')},${entry.timestamp},`;
      csv += `${entry.totalCost || 0},${(entry.alerts || []).join(';')}\n`;
    }
  }
  
  const csvFile = path.join(COSTS_DIR, 'costs-export.csv');
  fs.writeFileSync(csvFile, csv);
  console.log(`📊 CSV exportado: ${csvFile}`);
}

// ─── CLI ────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
API Costs Dashboard — Pedro Belentani

Uso:
  node api-costs-dashboard.js                  Dashboard actual
  node api-costs-dashboard.js --alert          Con alertas activas
  node api-costs-dashboard.js --history 7      Ver últimos 7 días
  node api-costs-dashboard.js --export csv     Exportar a CSV
  node api-costs-dashboard.js --help           Ayuda

Variables de entorno:
  ALIBABA_API_KEY        Clave de DashScope/Qwen
  HF_TOKEN               Token de HuggingFace
  OPENROUTER_API_KEY     Clave de OpenRouter
  GROQ_API_KEY           Clave de Groq
  COST_ALERT_THRESHOLD   Umbral de alerta en USD (default: 10)
`);
    return;
  }
  
  const data = await renderDashboard();
  saveCostSnapshot(data);
  
  if (args.includes('--export')) {
    const days = parseInt(args[args.indexOf('--export') + 1]) || 30;
    exportCSV(days);
  }
  
  if (args.includes('--alert') && data.alerts.length > 0) {
    console.log('\n🚨 Enviando alertas...');
    // Aquí se integraría con Telegram/email
  }
}

main().catch(console.error);

module.exports = { providers, renderDashboard };
