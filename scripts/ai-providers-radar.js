#!/usr/bin/env node

/**
 * 🔍 AI PROVIDERS RADAR — Comparativa de proveedores de IA
 * 
 * Uso:
 *   node scripts/ai-providers-radar.js                    # Radar completo
 *   node scripts/ai-providers-radar.js --compare alibaba  # vs Token Plan
 *   node scripts/ai-providers-radar.js --export json      # Exportar datos
 * 
 * Monitoriza: precios, límites, modelos nuevos, latency
 * Compara contra el Token Plan de Alibaba
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'radar');

// ─── BASE DE DATOS DE PROVEEDORES ───────────────────────────────────────────
const providers = {
  alibaba: {
    name: 'Alibaba Cloud (DashScope/Qwen)',
    emoji: '🟠',
    url: 'https://dashscope.aliyun.com',
    models: [
      { id: 'qwen-max', name: 'Qwen Max', inputPrice: 0.02, outputPrice: 0.06, context: 32768 },
      { id: 'qwen-plus', name: 'Qwen Plus', inputPrice: 0.004, outputPrice: 0.012, context: 131072 },
      { id: 'qwen-turbo', name: 'Qwen Turbo', inputPrice: 0.001, outputPrice: 0.002, context: 131072 },
      { id: 'qwen-long', name: 'Qwen Long', inputPrice: 0.0005, outputPrice: 0.002, context: 10000000 }
    ],
    plan: 'Token Plan',
    notes: 'Plan con tokens pre-pagados, descuentos por volumen'
  },
  
  openai: {
    name: 'OpenAI',
    emoji: '🟢',
    url: 'https://platform.openai.com',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', inputPrice: 0.005, outputPrice: 0.015, context: 128000 },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', inputPrice: 0.00015, outputPrice: 0.0006, context: 128000 },
      { id: 'o1-preview', name: 'o1 Preview', inputPrice: 0.015, outputPrice: 0.06, context: 128000 },
      { id: 'o1-mini', name: 'o1 Mini', inputPrice: 0.003, outputPrice: 0.012, context: 128000 }
    ],
    plan: 'Pay-as-you-go',
    notes: 'Tier 1: $100/mo, Tier 2: $500/mo, Tier 3: $1000/mo'
  },
  
  anthropic: {
    name: 'Anthropic',
    emoji: '🟤',
    url: 'https://console.anthropic.com',
    models: [
      { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', inputPrice: 0.003, outputPrice: 0.015, context: 200000 },
      { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', inputPrice: 0.001, outputPrice: 0.005, context: 200000 }
    ],
    plan: 'Pay-as-you-go',
    notes: 'API directa o via Bedrock/Vertex'
  },
  
  google: {
    name: 'Google (Gemini)',
    emoji: '🔵',
    url: 'https://ai.google.dev',
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', inputPrice: 0.0001, outputPrice: 0.0004, context: 1000000 },
      { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', inputPrice: 0.00125, outputPrice: 0.005, context: 2000000 }
    ],
    plan: 'Free tier + Pay-as-you-go',
    notes: 'Free: 15 RPM, 1M TPM. Paid: sin límites estrictos'
  },
  
  groq: {
    name: 'Groq',
    emoji: '⚡',
    url: 'https://console.groq.com',
    models: [
      { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', inputPrice: 0.0, outputPrice: 0.0, context: 128000 },
      { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', inputPrice: 0.0, outputPrice: 0.0, context: 32768 }
    ],
    plan: 'Free tier (rate limited)',
    notes: 'Extremadamente rápido (LPU). Free: 30 RPM, 5000 TPD'
  },
  
  openrouter: {
    name: 'OpenRouter',
    emoji: '🔀',
    url: 'https://openrouter.ai',
    models: [
      { id: 'auto', name: 'Auto (routing)', inputPrice: 0.0, outputPrice: 0.0, context: 0 },
      { id: 'meta-llama/llama-3.3-70b', name: 'Llama 3.3 70B', inputPrice: 0.0004, outputPrice: 0.0004, context: 128000 }
    ],
    plan: 'Pay-as-you-go (markup ~5-10%)',
    notes: 'Agregador. Unifica acceso a múltiples modelos'
  },
  
  huggingface: {
    name: 'HuggingFace Inference',
    emoji: '🤗',
    url: 'https://huggingface.co/inference-api',
    models: [
      { id: 'serverless', name: 'Serverless (free)', inputPrice: 0.0, outputPrice: 0.0, context: 0 },
      { id: 'dedicated', name: 'Dedicated (Inference Endpoints)', inputPrice: 0.0, outputPrice: 0.0, context: 0 }
    ],
    plan: 'Free + Pro ($9/mo) + Dedicated',
    notes: 'Serverless: rate limited. Endpoints: desde $0.60/hora'
  }
};

// ─── ANÁLISIS ───────────────────────────────────────────────────────────────
function analyzeProviders() {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  🔍 AI PROVIDERS RADAR — ${new Date().toLocaleString('es-ES')}`);
  console.log(`${'═'.repeat(70)}\n`);
  
  const analysis = {
    timestamp: new Date().toISOString(),
    providers: {},
    recommendations: [],
    alibabaComparison: {}
  };
  
  // Análisis por proveedor
  for (const [key, provider] of Object.entries(providers)) {
    console.log(`  ${provider.emoji} ${provider.name}`);
    
    const cheapestModel = provider.models.reduce((min, m) => 
      (m.inputPrice + m.outputPrice) < (min.inputPrice + min.outputPrice) ? m : min
    );
    
    const mostCapable = provider.models.reduce((max, m) => 
      m.context > max.context ? m : max
    );
    
    const avgInputPrice = provider.models.reduce((sum, m) => sum + m.inputPrice, 0) / provider.models.length;
    const avgOutputPrice = provider.models.reduce((sum, m) => sum + m.outputPrice, 0) / provider.models.length;
    
    analysis.providers[key] = {
      ...provider,
      cheapest: cheapestModel,
      mostCapable: mostCapable,
      avgInputPrice: avgInputPrice,
      avgOutputPrice: avgOutputPrice,
      modelCount: provider.models.length
    };
    
    console.log(`     Modelos: ${provider.models.length}`);
    console.log(`     Más barato: ${cheapestModel.name} ($${cheapestModel.inputPrice}/1K in)`);
    console.log(`     Mayor contexto: ${mostCapable.name} (${mostCapable.context.toLocaleString()} tokens)`);
    console.log('');
  }
  
  // Comparación con Alibaba (referencia)
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`  📊 COMPARATIVA vs ALIBABA TOKEN PLAN\n`);
  
  const alibaba = analysis.providers.alibaba;
  const alibabaAvgInput = alibaba.avgInputPrice;
  const alibabaAvgOutput = alibaba.avgOutputPrice;
  
  for (const [key, provider] of Object.entries(analysis.providers)) {
    if (key === 'alibaba') continue;
    
    const inputRatio = provider.avgInputPrice / alibabaAvgInput;
    const outputRatio = provider.avgOutputPrice / alibabaAvgOutput;
    
    let verdict = '';
    if (inputRatio < 0.5 && outputRatio < 0.5) verdict = '💰 Más barato que Alibaba';
    else if (inputRatio > 2 && outputRatio > 2) verdict = '💸 Más caro que Alibaba';
    else if (inputRatio === 0) verdict = '🆓 Gratis (rate limited)';
    else verdict = '≈ Competitivo';
    
    console.log(`  ${provider.emoji} ${provider.name.padEnd(30)} Input: ${inputRatio.toFixed(1)}x  Output: ${outputRatio.toFixed(1)}x  ${verdict}`);
    
    analysis.alibabaComparison[key] = {
      inputRatio,
      outputRatio,
      verdict
    };
  }
  
  // Recomendaciones
  console.log(`\n${'─'.repeat(70)}`);
  console.log(`  💡 RECOMENDACIONES\n`);
  
  analysis.recommendations = [
    {
      scenario: 'Uso intensivo (alto volumen)',
      recommendation: 'Alibaba Token Plan — mejor ratio precio/volumen',
      reason: 'Precios pre-pagados con descuento por volumen'
    },
    {
      scenario: 'Prototipado / Testing',
      recommendation: 'Groq + Google Free tier',
      reason: 'Gratis, rápido, suficiente para desarrollo'
    },
    {
      scenario: 'Máxima calidad (tareas complejas)',
      recommendation: 'OpenAI GPT-4o o Anthropic Claude Sonnet 4',
      reason: 'Mejor rendimiento en razonamiento complejo'
    },
    {
      scenario: 'Contexto masivo (documentos largos)',
      recommendation: 'Google Gemini 2.0 Pro (2M tokens)',
      reason: 'Ventana de contexto 20x mayor que competencia'
    },
    {
      scenario: 'Multi-modelo / Flexibilidad',
      recommendation: 'OpenRouter como agregador',
      reason: 'Un solo endpoint, acceso a todos los modelos'
    }
  ];
  
  analysis.recommendations.forEach(r => {
    console.log(`  📌 ${r.scenario}`);
    console.log(`     → ${r.recommendation}`);
    console.log(`     ${r.reason}\n`);
  });
  
  console.log(`${'═'.repeat(70)}\n`);
  
  return analysis;
}

// ─── PERSISTENCIA ───────────────────────────────────────────────────────────
function saveRadar(analysis) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  
  const date = new Date().toISOString().split('T')[0];
  const file = path.join(DATA_DIR, `radar-${date}.json`);
  
  fs.writeFileSync(file, JSON.stringify(analysis, null, 2));
  console.log(`📁 Datos guardados: ${file}`);
}

// ─── CLI ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.log(`
AI Providers Radar — Pedro Belentani

Uso:
  node ai-providers-radar.js                    Radar completo
  node ai-providers-radar.js --compare alibaba  Comparativa vs Alibaba
  node ai-providers-radar.js --export json      Exportar datos
  node ai-providers-radar.js --help             Ayuda
`);
} else {
  const analysis = analyzeProviders();
  saveRadar(analysis);
}

module.exports = { providers, analyzeProviders };
