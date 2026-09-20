#!/usr/bin/env node
/**
 * 🌐 DNS MANAGER — Configuración y verificación de DNS/SSL
 * Tarea #6 — Noiacore Lab
 */
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const { promisify } = require('util');
const resolve = promisify(dns.resolve);
const resolveMx = promisify(dns.resolveMx);
const resolveTxt = promisify(dns.resolveTxt);

const CONFIG_DIR = path.join(__dirname, '..', 'config');

const defaultZones = {
  'belentani.eu': {
    registrar: 'dondominio',
    nameservers: ['ns1.dondominio.com', 'ns2.dondominio.com'],
    records: {
      A: [
        { name: '@', value: '185.199.108.153', ttl: 3600 },
        { name: '@', value: '185.199.109.153', ttl: 3600 },
        { name: '@', value: '185.199.110.153', ttl: 3600 },
        { name: '@', value: '185.199.111.153', ttl: 3600 }
      ],
      CNAME: [
        { name: 'www', value: 'belentani7.github.io', ttl: 3600 },
        { name: 'omega', value: 'belentani7.github.io', ttl: 3600 },
        { name: 'cv', value: 'belentani7.github.io', ttl: 3600 },
        { name: 'duck', value: 'belentani7.github.io', ttl: 3600 },
        { name: 'manosabiertas', value: 'belentani7.github.io', ttl: 3600 },
        { name: 'eduforge', value: 'belentani7.github.io', ttl: 3600 },
        { name: 'secure-t', value: 'belentani7.github.io', ttl: 3600 },
        { name: 'lingua', value: 'belentani7.github.io', ttl: 3600 },
        { name: 'carquidec', value: 'belentani7.github.io', ttl: 3600 }
      ],
      MX: [
        { name: '@', priority: 10, value: 'mx1.improvmx.com', ttl: 3600 },
        { name: '@', priority: 20, value: 'mx2.improvmx.com', ttl: 3600 }
      ]
    }
  }
};

async function verifyDomain(domain) {
  console.log(`\n🔍 Verificando: ${domain}\n`);
  const results = { domain, checks: [] };
  
  try {
    const a = await resolve(domain, 'A');
    console.log(`  ✅ A records: ${a.join(', ')}`);
    results.checks.push({ type: 'A', status: 'ok', values: a });
  } catch (e) {
    console.log(`  ❌ A records: ${e.message}`);
    results.checks.push({ type: 'A', status: 'error', error: e.message });
  }
  
  try {
    const mx = await resolveMx(domain);
    console.log(`  ✅ MX records: ${mx.map(m => `${m.priority} ${m.exchange}`).join(', ')}`);
    results.checks.push({ type: 'MX', status: 'ok', values: mx });
  } catch (e) {
    console.log(`  ❌ MX records: ${e.message}`);
    results.checks.push({ type: 'MX', status: 'error', error: e.message });
  }
  
  const subdomains = ['www', 'omega', 'cv', 'duck', 'eduforge'];
  for (const sub of subdomains) {
    try {
      const addr = await resolve(`${sub}.${domain}`);
      console.log(`  ✅ ${sub}.${domain} → ${addr.join(', ')}`);
      results.checks.push({ type: 'CNAME', subdomain: sub, status: 'ok', values: addr });
    } catch (e) {
      console.log(`  ❌ ${sub}.${domain}: no resuelve`);
      results.checks.push({ type: 'CNAME', subdomain: sub, status: 'error' });
    }
  }
  
  return results;
}

function generateZoneFile(domain) {
  const zone = defaultZones[domain];
  if (!zone) { console.log(`❌ Zona no configurada: ${domain}`); return; }
  
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  let output = `; Zone file for ${domain}\n`;
  output += `; Generated: ${new Date().toISOString()}\n`;
  output += `; Registrar: ${zone.registrar}\n\n`;
  output += `$TTL 3600\n`;
  output += `@  IN  SOA  ${zone.nameservers[0]}. admin.${domain}. (\n`;
  output += `            ${Math.floor(Date.now()/1000)}  ; serial\n            3600  ; refresh\n            900   ; retry\n            1209600 ; expire\n            300 )  ; minimum\n\n`;
  
  Object.entries(zone.records).forEach(([type, records]) => {
    output += `; ${type} records\n`;
    records.forEach(r => {
      if (type === 'MX') output += `${r.name}\t${r.ttl}\tIN\tMX\t${r.priority} ${r.value}\n`;
      else output += `${r.name}\t${r.ttl}\tIN\t${type}\t${r.value}\n`;
    });
    output += '\n';
  });
  
  const filePath = path.join(CONFIG_DIR, `zone-${domain}.txt`);
  fs.writeFileSync(filePath, output);
  console.log(`✅ Zone file generado: ${filePath}`);
}

const args = process.argv.slice(2);
switch (args[0]) {
  case 'verify': verifyDomain(args[1] || 'belentani.eu'); break;
  case 'generate': generateZoneFile(args[1] || 'belentani.eu'); break;
  default:
    console.log(`
DNS Manager — Noiacore Lab

Uso:
  node dns-manager.js verify [dominio]         Verificar DNS
  node dns-manager.js generate [dominio]       Generar zone file
`);
}

module.exports = { verifyDomain, generateZoneFile, defaultZones };
