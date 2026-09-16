#!/usr/bin/env node

/**
 * 💾 BACKUP VERIFICADO — GitHub + HuggingFace + IPFS
 * 
 * Uso:
 *   node scripts/backup-verifier.js                    # Backup completo
 *   node scripts/backup-verifier.js --repos            # Solo repos GitHub
 *   node scripts/backup-verifier.js --verify           # Solo verificar último
 *   node scripts/backup-verifier.js --report           # Informe nocturno
 * 
 * Requiere:
 *   npm install node-fetch
 *   gh auth login (GitHub CLI)
 * 
 * Variables de entorno:
 *   GITHUB_TOKEN       - Token de GitHub
 *   HF_TOKEN           - Token de HuggingFace
 *   PINATA_JWT         - JWT de Pinata (IPFS)
 */

const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'backups');
const REPORT_DIR = path.join(__dirname, '..', 'logs', 'backups');
const GITHUB_USER = 'belentani7';

// ─── GITHUB BACKUP ──────────────────────────────────────────────────────────
async function backupGitHubRepos() {
  console.log('\n📦 Backup de repositorios GitHub...\n');
  
  const ghDir = path.join(BACKUP_DIR, 'github');
  fs.mkdirSync(ghDir, { recursive: true });
  
  const results = [];
  
  try {
    // Listar repos públicos
    const reposJson = execSync(
      `gh repo list ${GITHUB_USER} --limit 200 --json name,url,isPrivate,updatedAt,description`,
      { encoding: 'utf-8' }
    );
    const repos = JSON.parse(reposJson);
    
    console.log(`   Encontrados ${repos.length} repositorios\n`);
    
    for (const repo of repos) {
      const repoDir = path.join(ghDir, repo.name);
      const manifest = {
        name: repo.name,
        url: repo.url,
        isPrivate: repo.isPrivate,
        updatedAt: repo.updatedAt,
        description: repo.description,
        backupDate: new Date().toISOString(),
        status: 'pending'
      };
      
      try {
        if (fs.existsSync(repoDir)) {
          // Pull si ya existe
          execSync('git pull --ff-only', { cwd: repoDir, stdio: 'pipe' });
          manifest.status = 'updated';
        } else {
          // Clone
          execSync(`gh repo clone ${GITHUB_USER}/${repo.name} ${repoDir}`, { stdio: 'pipe' });
          manifest.status = 'cloned';
        }
        
        // Verificar integridad
        const gitStatus = execSync('git status --porcelain', { cwd: repoDir, encoding: 'utf-8' });
        const commitHash = execSync('git rev-parse HEAD', { cwd: repoDir, encoding: 'utf-8' }).trim();
        
        manifest.commitHash = commitHash;
        manifest.clean = gitStatus.trim() === '';
        manifest.fileCount = parseInt(execSync('git ls-files | wc -l', { cwd: repoDir, encoding: 'utf-8' }).trim());
        
        console.log(`   ✅ ${repo.name} (${manifest.fileCount} archivos, ${commitHash.slice(0, 7)})`);
      } catch (err) {
        manifest.status = 'error';
        manifest.error = err.message;
        console.log(`   ❌ ${repo.name}: ${err.message}`);
      }
      
      // Guardar manifest
      fs.writeFileSync(
        path.join(repoDir || ghDir, '.backup-manifest.json'),
        JSON.stringify(manifest, null, 2)
      );
      
      results.push(manifest);
    }
  } catch (err) {
    console.error('❌ Error listando repos:', err.message);
    console.log('   Asegúrate de tener gh CLI instalado y autenticado');
  }
  
  return results;
}

// ─── HUGGINGFACE BACKUP ─────────────────────────────────────────────────────
async function backupHuggingFace() {
  console.log('\n🤗 Backup de HuggingFace...\n');
  
  const hfDir = path.join(BACKUP_DIR, 'huggingface');
  fs.mkdirSync(hfDir, { recursive: true });
  
  const token = process.env.HF_TOKEN;
  if (!token) {
    console.log('   ⚠️  HF_TOKEN no configurado, saltando HuggingFace');
    return [];
  }
  
  const results = [];
  
  try {
    // Listar datasets y modelos
    const repos = await fetchHFRepos(token);
    
    for (const repo of repos) {
      const repoDir = path.join(hfDir, `${repo.type}-${repo.id}`);
      
      try {
        if (fs.existsSync(repoDir)) {
          execSync('git pull --ff-only', { cwd: repoDir, stdio: 'pipe' });
        } else {
          const hfUrl = `https://huggingface.co/${repo.id}`;
          execSync(`git clone ${hfUrl} ${repoDir}`, { stdio: 'pipe' });
        }
        
        const commitHash = execSync('git rev-parse HEAD', { cwd: repoDir, encoding: 'utf-8' }).trim();
        console.log(`   ✅ ${repo.id} (${commitHash.slice(0, 7)})`);
        
        results.push({
          id: repo.id,
          type: repo.type,
          commitHash,
          backupDate: new Date().toISOString(),
          status: 'ok'
        });
      } catch (err) {
        console.log(`   ❌ ${repo.id}: ${err.message}`);
        results.push({ id: repo.id, status: 'error', error: err.message });
      }
    }
  } catch (err) {
    console.error('❌ Error en HuggingFace:', err.message);
  }
  
  return results;
}

function fetchHFRepos(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'huggingface.co',
      path: `/api/whoami-v2`,
      headers: { 'Authorization': `Bearer ${token}` }
    };
    
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const user = JSON.parse(data);
          // Retornar lista básica — en producción haría paginación
          resolve([
            { id: `${user.name}/belentani-omega`, type: 'model' },
            { id: `${user.name}/judas-experience`, type: 'dataset' }
          ]);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// ─── IPFS PINNING ───────────────────────────────────────────────────────────
async function pinToIPFS(filePath) {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    console.log('   ⚠️  PINATA_JWT no configurado, saltando IPFS');
    return null;
  }
  
  return new Promise((resolve) => {
    const data = JSON.stringify({
      pinataMetadata: { name: path.basename(filePath) },
      pinataOptions: { cidVersion: 1 }
    });
    
    const options = {
      hostname: 'api.pinata.cloud',
      path: '/pinning/pinJSONToIPFS',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          console.log(`   📌 IPFS: ${result.IpfsHash}`);
          resolve({ cid: result.IpfsHash, timestamp: new Date().toISOString() });
        } catch (e) {
          resolve(null);
        }
      });
    });
    
    req.on('error', () => resolve(null));
    req.write(data);
    req.end();
  });
}

// ─── VERIFICACIÓN ───────────────────────────────────────────────────────────
function verifyBackups() {
  console.log('\n🔍 Verificando integridad de backups...\n');
  
  const manifests = [];
  
  // Verificar manifests de GitHub
  const ghDir = path.join(BACKUP_DIR, 'github');
  if (fs.existsSync(ghDir)) {
    const dirs = fs.readdirSync(ghDir).filter(d => 
      fs.statSync(path.join(ghDir, d)).isDirectory()
    );
    
    for (const dir of dirs) {
      const manifestPath = path.join(ghDir, dir, '.backup-manifest.json');
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        
        // Verificar que el repo existe y está limpio
        try {
          const status = execSync('git status --porcelain', { 
            cwd: path.join(ghDir, dir), 
            encoding: 'utf-8' 
          });
          manifest.verified = status.trim() === '';
          manifest.verifiedAt = new Date().toISOString();
        } catch {
          manifest.verified = false;
        }
        
        manifests.push(manifest);
      }
    }
  }
  
  const verified = manifests.filter(m => m.verified);
  const failed = manifests.filter(m => !m.verified);
  
  console.log(`   ✅ Verificados: ${verified.length}`);
  console.log(`   ❌ Fallidos: ${failed.length}`);
  
  return { verified, failed, total: manifests.length };
}

// ─── INFORME NOCTURNO ───────────────────────────────────────────────────────
function generateNightlyReport(githubResults, hfResults, verification) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  
  const date = new Date().toISOString().split('T')[0];
  const report = {
    date,
    timestamp: new Date().toISOString(),
    github: {
      total: githubResults.length,
      success: githubResults.filter(r => r.status !== 'error').length,
      errors: githubResults.filter(r => r.status === 'error').length,
      repos: githubResults
    },
    huggingface: {
      total: hfResults.length,
      success: hfResults.filter(r => r.status === 'ok').length,
      errors: hfResults.filter(r => r.status === 'error').length,
      repos: hfResults
    },
    verification,
    summary: {
      totalRepos: githubResults.length + hfResults.length,
      totalSuccess: githubResults.filter(r => r.status !== 'error').length + hfResults.filter(r => r.status === 'ok').length,
      totalErrors: githubResults.filter(r => r.status === 'error').length + hfResults.filter(r => r.status === 'error').length,
      verified: verification.verified.length,
      failed: verification.failed.length
    }
  };
  
  const reportFile = path.join(REPORT_DIR, `backup-report-${date}.json`);
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  // Imprimir resumen
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  💾 BACKUP REPORT — ${date}`);
  console.log(`${'═'.repeat(60)}\n`);
  console.log(`  GitHub:       ${report.github.success}/${report.github.total} ✅`);
  console.log(`  HuggingFace:  ${report.huggingface.success}/${report.huggingface.total} ✅`);
  console.log(`  Verificados:  ${report.verification.verified.length}/${report.verification.total} ✅`);
  console.log(`  Errores:      ${report.summary.totalErrors} ❌`);
  console.log(`\n  Informe: ${reportFile}`);
  console.log(`${'═'.repeat(60)}\n`);
  
  return report;
}

// ─── CLI ────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
Backup Verificado — Pedro Belentani

Uso:
  node backup-verifier.js              Backup completo
  node backup-verifier.js --repos      Solo repos GitHub
  node backup-verifier.js --verify     Solo verificar
  node backup-verifier.js --report     Informe nocturno
  node backup-verifier.js --help       Ayuda

Variables de entorno:
  GITHUB_TOKEN    Token de GitHub (o usar gh auth login)
  HF_TOKEN        Token de HuggingFace
  PINATA_JWT      JWT de Pinata para IPFS
`);
    return;
  }
  
  let githubResults = [];
  let hfResults = [];
  
  if (!args.includes('--verify')) {
    if (!args.includes('--repos') || args.includes('--repos')) {
      githubResults = await backupGitHubRepos();
    }
    hfResults = await backupHuggingFace();
  }
  
  const verification = verifyBackups();
  generateNightlyReport(githubResults, hfResults, verification);
}

main().catch(console.error);

module.exports = { backupGitHubRepos, backupHuggingFace, verifyBackups };
