#!/usr/bin/env node
/**
 * 🔗 OAUTH CONNECTOR — Conexión OAuth para Gmail, Calendar, Drive, Notion
 * Tarea #7 — Noiacore Lab
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');

const CONFIG_DIR = path.join(__dirname, '..', 'config');
const TOKENS_DIR = path.join(CONFIG_DIR, 'oauth-tokens');

const providers = {
  google: {
    name: 'Google (Gmail/Calendar/Drive)',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scopes: [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/drive.file'
    ],
    envVars: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI']
  },
  notion: {
    name: 'Notion',
    authUrl: 'https://api.notion.com/v1/oauth/authorize',
    tokenUrl: 'https://api.notion.com/v1/oauth/token',
    scopes: [],
    envVars: ['NOTION_CLIENT_ID', 'NOTION_CLIENT_SECRET', 'NOTION_REDIRECT_URI']
  },
  github: {
    name: 'GitHub',
    authUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    scopes: ['repo', 'user', 'gist'],
    envVars: ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET']
  }
};

function generateAuthUrl(provider) {
  const config = providers[provider];
  if (!config) { console.log(`❌ Provider no encontrado: ${provider}`); return; }
  
  const state = crypto.randomBytes(16).toString('hex');
  const params = new URLSearchParams({
    client_id: process.env[config.envVars[0]] || 'YOUR_CLIENT_ID',
    redirect_uri: process.env[config.envVars[config.envVars.length-1]] || 'http://localhost:3000/callback',
    response_type: 'code',
    scope: config.scopes.join(' '),
    state: state,
    access_type: 'offline',
    prompt: 'consent'
  });
  
  const url = `${config.authUrl}?${params.toString()}`;
  console.log(`\n🔗 URL de autorización para ${config.name}:\n`);
  console.log(`   ${url}\n`);
  console.log(`   Estado: ${state}`);
  console.log(`   ⚠️  Abre esta URL en un navegador autenticado\n`);
  
  return { url, state };
}

function exchangeCode(provider, code) {
  const config = providers[provider];
  console.log(`\n🔄 Intercambiando código por token para ${config.name}...`);
  console.log(`   Código: ${code.slice(0, 10)}...`);
  console.log(`   ⚠️  Requiere ejecución con navegador (Manus)`);
}

function listProviders() {
  console.log(`\n🔗 Providers OAuth disponibles:\n`);
  Object.entries(providers).forEach(([key, p]) => {
    console.log(`  📌 ${p.name}`);
    console.log(`     Scopes: ${p.scopes.join(', ') || 'N/A'}`);
    console.log(`     Env vars: ${p.envVars.join(', ')}`);
    console.log('');
  });
}

function saveToken(provider, token) {
  fs.mkdirSync(TOKENS_DIR, { recursive: true });
  const tokenFile = path.join(TOKENS_DIR, `${provider}.json`);
  fs.writeFileSync(tokenFile, JSON.stringify({
    provider,
    token,
    savedAt: new Date().toISOString()
  }, null, 2));
  console.log(`✅ Token guardado: ${tokenFile}`);
}

const args = process.argv.slice(2);
switch (args[0]) {
  case 'list': listProviders(); break;
  case 'auth': generateAuthUrl(args[1]); break;
  case 'exchange': exchangeCode(args[1], args[2]); break;
  default:
    console.log(`
OAuth Connector — Noiacore Lab

Uso:
  node oauth-connector.js list                    Listar providers
  node oauth-connector.js auth <provider>         Generar URL de auth
  node oauth-connector.js exchange <provider> <code>  Intercambiar código
`);
}

module.exports = { providers, generateAuthUrl, saveToken };
