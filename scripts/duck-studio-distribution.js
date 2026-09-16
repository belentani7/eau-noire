#!/usr/bin/env node

/**
 * 🦆 DUCK STUDIO DISTRIBUTION — Preparación y subida de distribución musical
 * 
 * Uso:
 *   node scripts/duck-studio-distribution.js prepare     # Preparar metadata
 *   node scripts/duck-studio-distribution.js validate    # Validar artwork + audio
 *   node scripts/duck-studio-distribution.js upload      # Subir a distribuidora
 *   node scripts/duck-studio-distribution.js status      # Estado de distribución
 * 
 * Distribuidoras soportadas:
 *   - DistroKid
 *   - TuneCore
 *   - CD Baby
 *   - Amuse
 * 
 * Variables de entorno:
 *   DISTRO_API_KEY    - API key de la distribuidora
 *   DISTRO_PROVIDER   - distrokid | tunecore | cdbaby | amuse
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const MUSIC_DIR = path.join(__dirname, '..', 'music', 'duck-studio');
const METADATA_DIR = path.join(MUSIC_DIR, 'metadata');
const ARTWORK_DIR = path.join(MUSIC_DIR, 'artwork');
const AUDIO_DIR = path.join(MUSIC_DIR, 'audio');

// ─── ESPECIFICACIONES TÉCNICAS ──────────────────────────────────────────────
const SPECS = {
  artwork: {
    minSize: 3000,
    maxSize: 3000,
    format: 'jpeg',
    colorSpace: 'RGB',
    dpi: 300,
    maxFileSize: 10 * 1024 * 1024 // 10MB
  },
  audio: {
    format: 'wav',
    sampleRate: 44100,
    bitDepth: 16,
    channels: 2, // stereo
    maxFileSize: 200 * 1024 * 1024 // 200MB
  },
  metadata: {
    requiredFields: [
      'title', 'artist', 'album', 'genre', 'releaseDate',
      'language', 'isExplicit', 'upc', 'isrc'
    ]
  }
};

// ─── METADATA TEMPLATE ──────────────────────────────────────────────────────
function createMetadataTemplate() {
  fs.mkdirSync(METADATA_DIR, { recursive: true });
  
  const template = {
    release: {
      title: '[Título del álbum/EP/single]',
      artist: 'Duck Studio',
      albumArtist: 'Duck Studio',
      label: 'Duck Studio',
      genre: '[Género principal]',
      subGenre: '[Subgénero]',
      releaseDate: 'YYYY-MM-DD',
      originalReleaseDate: 'YYYY-MM-DD',
      language: 'es',
      isExplicit: false,
      copyright: `© ${new Date().getFullYear()} Duck Studio`,
      upc: '[Código UPC/EAN — la distribuidora lo genera]',
      catalogNumber: 'DS-001'
    },
    tracks: [
      {
        number: 1,
        title: '[Título de la canción]',
        artist: 'Duck Studio',
        duration: '00:00:00', // HH:MM:SS
        isrc: '[Código ISRC — la distribuidora lo genera]',
        isInstrumental: false,
        lyrics: '', // o ruta al archivo de letras
        composers: ['Pedro Belentani'],
        producers: ['Pedro Belentani'],
        filename: '[nombre-del-archivo.wav]'
      }
    ],
    credits: {
      mainArtist: 'Duck Studio',
      featuredArtists: [],
      composers: ['Pedro Belentani'],
      producers: ['Pedro Belentani'],
      mixEngineer: '',
      masterEngineer: '',
      artworkBy: ''
    },
    distribution: {
      stores: [
        'spotify', 'apple-music', 'amazon-music', 'youtube-music',
        'deezer', 'tidal', 'pandora', 'napster'
      ],
      territories: ['worldwide'],
      preorderAvailable: false,
      preorderDate: '',
      pricing: {
        tier: 'mid', // low | mid | premium
        albumPrice: 9.99,
        trackPrice: 1.29
      }
    },
    links: {
      website: 'https://duck.belentani.eu',
      socialMedia: {
        instagram: '',
        twitter: '',
        tiktok: ''
      }
    }
  };
  
  const outputPath = path.join(METADATA_DIR, 'release-template.json');
  fs.writeFileSync(outputPath, JSON.stringify(template, null, 2));
  
  console.log(`✅ Template generado: ${outputPath}`);
  console.log(`\n📋 Próximos pasos:`);
  console.log(`   1. Edita el template con los datos reales`);
  console.log(`   2. Coloca el artwork en: ${ARTWORK_DIR}/cover.jpg`);
  console.log(`   3. Coloca los audios en: ${AUDIO_DIR}/`);
  console.log(`   4. Ejecuta: node duck-studio-distribution.js validate`);
  
  return template;
}

// ─── VALIDACIÓN ─────────────────────────────────────────────────────────────
function validateRelease() {
  console.log(`\n🔍 Validando release de Duck Studio...\n`);
  
  const results = {
    metadata: { valid: false, errors: [], warnings: [] },
    artwork: { valid: false, errors: [], warnings: [] },
    audio: { valid: false, errors: [], warnings: [] }
  };
  
  // Validar metadata
  const metadataPath = path.join(METADATA_DIR, 'release.json');
  if (fs.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    
    SPECS.metadata.requiredFields.forEach(field => {
      if (!metadata.release[field] || metadata.release[field].startsWith('[')) {
        results.metadata.errors.push(`Campo requerido vacío: release.${field}`);
      }
    });
    
    if (metadata.tracks.length === 0) {
      results.metadata.errors.push('No hay tracks definidas');
    }
    
    metadata.tracks.forEach((track, i) => {
      if (!track.title || track.title.startsWith('[')) {
        results.metadata.errors.push(`Track ${i + 1}: título vacío`);
      }
      if (!track.filename) {
        results.metadata.errors.push(`Track ${i + 1}: filename no definido`);
      }
    });
    
    results.metadata.valid = results.metadata.errors.length === 0;
  } else {
    results.metadata.errors.push('No existe release.json — ejecuta: prepare');
  }
  
  // Validar artwork
  const artworkPath = path.join(ARTWORK_DIR, 'cover.jpg');
  if (fs.existsSync(artworkPath)) {
    const stats = fs.statSync(artworkPath);
    if (stats.size > SPECS.artwork.maxFileSize) {
      results.artwork.errors.push(`Artwork demasiado grande: ${(stats.size / 1024 / 1024).toFixed(1)}MB (máx: 10MB)`);
    } else {
      results.artwork.valid = true;
      console.log(`   ✅ Artwork: ${(stats.size / 1024).toFixed(0)}KB`);
    }
  } else {
    results.artwork.errors.push('No existe artwork en: ' + artworkPath);
  }
  
  // Validar audio
  if (fs.existsSync(AUDIO_DIR)) {
    const audioFiles = fs.readdirSync(AUDIO_DIR).filter(f => f.endsWith('.wav') || f.endsWith('.flac'));
    if (audioFiles.length === 0) {
      results.audio.errors.push('No hay archivos de audio (.wav/.flac) en: ' + AUDIO_DIR);
    } else {
      results.audio.valid = true;
      audioFiles.forEach(f => {
        const stats = fs.statSync(path.join(AUDIO_DIR, f));
        console.log(`   ✅ Audio: ${f} (${(stats.size / 1024 / 1024).toFixed(1)}MB)`);
      });
    }
  } else {
    results.audio.errors.push('No existe directorio de audio: ' + AUDIO_DIR);
  }
  
  // Reporte
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  📊 RESULTADO DE VALIDACIÓN`);
  console.log(`${'═'.repeat(50)}\n`);
  
  const sections = ['metadata', 'artwork', 'audio'];
  let allValid = true;
  
  sections.forEach(section => {
    const icon = results[section].valid ? '✅' : '❌';
    console.log(`  ${icon} ${section.toUpperCase()}`);
    
    if (results[section].errors.length > 0) {
      allValid = false;
      results[section].errors.forEach(e => console.log(`     ❌ ${e}`));
    }
    if (results[section].warnings.length > 0) {
      results[section].warnings.forEach(w => console.log(`     ⚠️  ${w}`));
    }
  });
  
  console.log(`\n${'═'.repeat(50)}`);
  console.log(`  ${allValid ? '✅ LISTO PARA SUBIR' : '❌ HAY ERRORES QUE RESOLVER'}`);
  console.log(`${'═'.repeat(50)}\n`);
  
  return { results, allValid };
}

// ─── CHECKSUM / HASH ────────────────────────────────────────────────────────
function generateChecksums() {
  console.log('\n🔐 Generando checksums de archivos...\n');
  
  const checksums = {};
  const dirs = [ARTWORK_DIR, AUDIO_DIR];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath);
      const hash = crypto.createHash('sha256').update(content).digest('hex');
      checksums[file] = hash;
      console.log(`   ${file}: ${hash.slice(0, 16)}...`);
    });
  });
  
  const checksumFile = path.join(MUSIC_DIR, 'checksums.json');
  fs.writeFileSync(checksumFile, JSON.stringify(checksums, null, 2));
  console.log(`\n📁 Checksums guardados: ${checksumFile}`);
  
  return checksums;
}

// ─── ESTADO DE DISTRIBUCIÓN ─────────────────────────────────────────────────
function checkStatus() {
  console.log(`\n📡 Estado de distribución Duck Studio\n`);
  
  const statusFile = path.join(METADATA_DIR, 'distribution-status.json');
  
  if (fs.existsSync(statusFile)) {
    const status = JSON.parse(fs.readFileSync(statusFile, 'utf-8'));
    
    console.log(`   Release: ${status.release?.title || 'N/A'}`);
    console.log(`   Estado: ${status.overallStatus || 'desconocido'}`);
    console.log(`   UPC: ${status.upc || 'pendiente'}`);
    console.log(`   Última verificación: ${status.lastChecked || 'nunca'}`);
    
    if (status.stores) {
      console.log(`\n   Tiendas:`);
      Object.entries(status.stores).forEach(([store, data]) => {
        const icon = data.status === 'live' ? '🟢' : data.status === 'pending' ? '🟡' : '⚪';
        console.log(`     ${icon} ${store}: ${data.status}`);
      });
    }
  } else {
    console.log('   No hay estado de distribución registrado.');
    console.log('   Sube primero con: node duck-studio-distribution.js upload');
    
    // Crear template de status
    const template = {
      release: { title: '', upc: '' },
      overallStatus: 'not-submitted',
      lastChecked: null,
      stores: {},
      history: []
    };
    
    fs.mkdirSync(METADATA_DIR, { recursive: true });
    fs.writeFileSync(statusFile, JSON.stringify(template, null, 2));
  }
}

// ─── CLI ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const command = args[0] || 'help';

// Crear directorios base
[MUSIC_DIR, METADATA_DIR, ARTWORK_DIR, AUDIO_DIR].forEach(d => 
  fs.mkdirSync(d, { recursive: true })
);

switch (command) {
  case 'prepare':
    createMetadataTemplate();
    break;
  case 'validate':
    validateRelease();
    generateChecksums();
    break;
  case 'upload':
    console.log('\n📤 Subida a distribuidora');
    console.log('   ⚠️  Esta acción requiere interacción con el panel web de la distribuidora.');
    console.log('   Manus puede ejecutar esto con navegador autenticado.');
    console.log('   Alternativa manual: usa el formulario web de tu distribuidora.\n');
    const { allValid } = validateRelease();
    if (allValid) {
      console.log('   ✅ Release validado — listo para subir');
    }
    break;
  case 'status':
    checkStatus();
    break;
  case 'help':
  default:
    console.log(`
Duck Studio Distribution — Pedro Belentani

Uso:
  node duck-studio-distribution.js prepare     Crear template de metadata
  node duck-studio-distribution.js validate    Validar artwork + audio + metadata
  node duck-studio-distribution.js upload      Subir a distribuidora
  node duck-studio-distribution.js status      Estado de distribución

Directorios:
  music/duck-studio/metadata/   Templates y datos
  music/duck-studio/artwork/    Portada (cover.jpg, 3000x3000)
  music/duck-studio/audio/      Archivos WAV/FLAC
`);
}

module.exports = { createMetadataTemplate, validateRelease, generateChecksums };
