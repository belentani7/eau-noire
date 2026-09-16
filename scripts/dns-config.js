#!/usr/bin/env node

/**
 * Script de configuración DNS para belentani.eu
 * Uso: node scripts/dns-config.js --domain belentani.eu --registrar dondominio
 * 
 * Este script genera la configuración DNS lista para aplicar en DonDominio
 * y verifica la propagación.
 */

const fs = require('fs');
const path = require('path');

const config = {
  domain: 'belentani.eu',
  registrar: 'dondominio',
  nameservers: [
    'ns1.dondominio.com',
    'ns2.dondominio.com'
  ],
  records: {
    // A records - GitHub Pages
    A: [
      { name: '@', value: '185.199.108.153', ttl: 3600 },
      { name: '@', value: '185.199.109.153', ttl: 3600 },
      { name: '@', value: '185.199.110.153', ttl: 3600 },
      { name: '@', value: '185.199.111.153', ttl: 3600 }
    ],
    // CNAME records - Subdominios
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
    // TXT records - Verificaciones
    TXT: [
      { name: '@', value: 'google-site-verification=TU_CODIGO_AQUI', ttl: 3600 },
      { name: '_dmarc', value: 'v=DMARC1; p=none; rua=mailto:dmarc@belentani.eu', ttl: 3600 }
    ],
    // MX records - Email
    MX: [
      { name: '@', value: '10 mx1.improvmx.com', ttl: 3600 },
      { name: '@', value: '20 mx2.improvmx.com', ttl: 3600 }
    ]
  }
};

// Generar archivo de configuración
function generateConfig() {
  const outputPath = path.join(__dirname, '..', 'config', 'dns-belentani-eu.json');
  
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
  
  console.log('✅ Configuración DNS generada:', outputPath);
  console.log('\n📋 Próximos pasos:');
  console.log('1. Accede a DonDominio: https://dondominio.com');
  console.log('2. Ve a: Mis Dominios > belentani.eu > Zona DNS');
  console.log('3. Aplica los registros del archivo generado');
  console.log('4. Espera propagación (1-48 horas)');
  console.log('5. Verifica con: node scripts/verify-dns.js');
  
  return config;
}

// Generar script de verificación
function generateVerificationScript() {
  const script = `#!/usr/bin/env node
const dns = require('dns');
const util = require('util');
const resolve = util.promisify(dns.resolve);

const domain = '${config.domain}';
const subdomains = ${JSON.stringify(config.records.CNAME.map(r => r.name + '.' + config.domain), null, 2)};

async function verify() {
  console.log('🔍 Verificando DNS de', domain, '...\\n');
  
  try {
    const aRecords = await resolve(domain, 'A');
    console.log('✅ A records:', aRecords.join(', '));
  } catch (e) {
    console.log('❌ A records: No encontrados');
  }
  
  for (const sub of subdomains) {
    try {
      const cname = await resolve(sub, 'CNAME');
      console.log('✅', sub, '→', cname[0]);
    } catch (e) {
      console.log('❌', sub, ': No resuelve');
    }
  }
}

verify();
`;

  const scriptPath = path.join(__dirname, 'verify-dns.js');
  fs.writeFileSync(scriptPath, script);
  fs.chmodSync(scriptPath, '755');
  
  console.log('✅ Script de verificación generado:', scriptPath);
}

// Ejecutar
if (require.main === module) {
  generateConfig();
  generateVerificationScript();
}

module.exports = { config, generateConfig, generateVerificationScript };
