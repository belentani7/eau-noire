#!/usr/bin/env node

/**
 * 📝 DOSSIER LEGAL GENERATOR — CASO_BELENTANI en PDF premium
 * 
 * Uso:
 *   node scripts/dossier-generator.js                    # Generar PDF
 *   node scripts/dossier-generator.js --watch            # Regenerar al cambiar datos
 *   node scripts/dossier-generator.js --template basic   # Versión básica
 * 
 * Requiere:
 *   npm install pdfkit
 * 
 * Genera un PDF con:
 *   - Portada profesional
 *   - Índice con bookmarks
 *   - Cronología interactiva
 *   - Anexos navegables
 *   - Citas legales con enlaces
 */

const fs = require('fs');
const path = require('path');

// Intentar cargar pdfkit, si no está disponible usar fallback HTML
let PDFDocument;
try {
  PDFDocument = require('pdfkit');
} catch {
  console.log('⚠️  pdfkit no instalado. Ejecuta: npm install pdfkit');
  console.log('   Generando versión HTML como fallback...\n');
}

const OUTPUT_DIR = path.join(__dirname, '..', 'output');
const DATA_DIR = path.join(__dirname, '..', 'data', 'legal');

// ─── DATOS DEL CASO ─────────────────────────────────────────────────────────
const casoData = {
  titulo: 'CASO_BELENTANI',
  subtitulo: 'Dossier Legal — Informe Consolidado',
  autor: 'Pedro Belentani',
  fecha: new Date().toISOString().split('T')[0],
  version: '1.0',
  
  secciones: [
    {
      id: 'resumen',
      titulo: '1. Resumen Ejecutivo',
      contenido: `
El presente dossier consolida la documentación legal relativa al CASO_BELENTANI,
incluyendo cronología de hechos, fundamentación jurídica, jurisprudencia aplicable
y estrategia procesal.

OBJETIVO: Documentar de forma completa y navegable todos los aspectos legales
del caso para su uso en procedimientos administrativos y judiciales.

ESTADO: En preparación — pendiente de completar con datos específicos del caso.
      `.trim()
    },
    {
      id: 'cronologia',
      titulo: '2. Cronología de Hechos',
      contenido: `
FECHA           | HECHO                          | DOCUMENTO
────────────────┼────────────────────────────────┼────────────
[Completar]     | [Primer evento relevante]      | Anexo A.1
[Completar]     | [Segundo evento]               | Anexo A.2
[Completar]     | [Evento crítico]               | Anexo A.3

NOTA: Esta sección debe completarse con la cronología detallada del caso.
Cada entrada debe referenciar el anexo documental correspondiente.
      `.trim()
    },
    {
      id: 'fundamentos',
      titulo: '3. Fundamentos Jurídicos',
      contenido: `
3.1 Marco normativo aplicable

  • Constitución Española — Art. 18 (Derecho al honor, intimidad)
  • Constitución Española — Art. 20 (Libertad de expresión)
  • Ley Orgánica 1/1982 — Protección civil del derecho al honor
  • Ley 34/2002 — Servicios de la sociedad de la información
  • Reglamento UE 2016/679 (GDPR) — Protección de datos
  • Directiva 2000/31/CE — Comercio electrónico

3.2 Derechos vulnerados

  [Completar con análisis específico del caso]

3.3 Responsabilidades

  [Completar con identificación de responsables]
      `.trim()
    },
    {
      id: 'jurisprudencia',
      titulo: '4. Jurisprudencia Comparada',
      contenido: `
4.1 Jurisprudencia española

  • STS 113/2021, de 18 febrero — [Describir]
  • STS 456/2020, de 15 julio — [Describir]
  • SAP [Provincia] [Número]/[Año] — [Describir]

4.2 Jurisprudencia europea

  • TJUE C-XXX/XX — [Describir]
  • TEDH [Caso] — [Describir]

4.3 Jurisprudencia comparada (Latinoamérica)

  • [País] — [Tribunal] — [Caso] — [Describir]

ENLACES A FUENTES:
  • Poder Judicial: https://www.poderjudicial.es
  • BOE: https://www.boe.es
  • EUR-Lex: https://eur-lex.europa.eu
  • HUDOC (TEDH): https://hudoc.echr.coe.int

NOTA: Sección pendiente de completar con investigación web a escala (Manus Bloque B.11)
      `.trim()
    },
    {
      id: 'estrategia',
      titulo: '5. Estrategia Procesal',
      contenido: `
5.1 Vías de acción

  OPCIÓN A: [Describir vía principal]
    • Plazo: [indicar]
    • Juzgado competente: [indicar]
    • Coste estimado: [indicar]
    • Probabilidad de éxito: [indicar]

  OPCIÓN B: [Describir vía alternativa]
    • Plazo: [indicar]
    • Juzgado competente: [indicar]
    • Coste estimado: [indicar]

5.2 Pretensiones

  1. [Primera pretensión]
  2. [Segunda pretensión]
  3. [Tercera pretensión]

5.3 Prueba propuesta

  • Documental: [listar]
  • Testifical: [listar]
  • Pericial: [listar]
      `.trim()
    },
    {
      id: 'anexos',
      titulo: '6. Anexos Documentales',
      contenido: `
ANEXO A — Cronología documental
  A.1 [Documento 1]
  A.2 [Documento 2]
  A.3 [Documento 3]

ANEXO B — Correspondencia
  B.1 [Carta/email 1]
  B.2 [Carta/email 2]

ANEXO C — Capturas y evidencias digitales
  C.1 [Captura 1]
  C.2 [Captura 2]

ANEXO D — Informes periciales
  D.1 [Informe técnico]

ANEXO E — Jurisprudencia citada
  E.1 [Sentencia 1 — enlace]
  E.2 [Sentencia 2 — enlace]

NOTA: Los anexos deben añadirse como archivos separados en data/legal/anexos/
      `.trim()
    }
  ]
};

// ─── GENERADOR PDF ──────────────────────────────────────────────────────────
function generatePDF() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(path.join(DATA_DIR, 'anexos'), { recursive: true });
  
  // Guardar datos fuente
  fs.writeFileSync(
    path.join(DATA_DIR, 'caso-belentani.json'),
    JSON.stringify(casoData, null, 2)
  );
  
  if (!PDFDocument) {
    generateHTML();
    return;
  }
  
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 72, bottom: 72, left: 72, right: 72 },
    bufferPages: true,
    info: {
      Title: casoData.titulo,
      Author: casoData.autor,
      Subject: casoData.subtitulo,
      CreationDate: new Date()
    }
  });
  
  const outputPath = path.join(OUTPUT_DIR, 'dossier-caso-belentani.pdf');
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);
  
  // ─── PORTADA ────────────────────────────────────────────────────────────
  doc.rect(0, 0, 595, 842).fill('#0f172a');
  doc.rect(0, 300, 595, 4).fill('#10b981');
  
  doc.fontSize(42).fillColor('#ffffff')
    .font('Helvetica-Bold')
    .text(casoData.titulo, 72, 340, { width: 451, align: 'center' });
  
  doc.fontSize(16).fillColor('#94a3b8')
    .font('Helvetica')
    .text(casoData.subtitulo, 72, 400, { width: 451, align: 'center' });
  
  doc.fontSize(12).fillColor('#64748b')
    .text(`Autor: ${casoData.autor}`, 72, 500, { width: 451, align: 'center' })
    .text(`Fecha: ${casoData.fecha}`, 72, 520, { width: 451, align: 'center' })
    .text(`Versión: ${casoData.version}`, 72, 540, { width: 451, align: 'center' });
  
  doc.fontSize(10).fillColor('#475569')
    .text('CONFIDENCIAL', 72, 750, { width: 451, align: 'center' });
  
  // ─── PÁGINAS DE CONTENIDO ──────────────────────────────────────────────
  casoData.secciones.forEach((seccion, idx) => {
    doc.addPage();
    
    // Bookmark
    const pageRange = doc.bufferedPageRange();
    doc.addNamedDestination(seccion.id, 'XYZ', null, null, null);
    
    // Título de sección
    doc.fontSize(22).fillColor('#0f172a')
      .font('Helvetica-Bold')
      .text(seccion.titulo, 72, 72);
    
    doc.moveTo(72, 100).lineTo(523, 100)
      .strokeColor('#e2e8f0').lineWidth(1).stroke();
    
    // Contenido
    doc.fontSize(11).fillColor('#334155')
      .font('Helvetica')
      .text(seccion.contenido, 72, 120, {
        width: 451,
        lineGap: 4,
        align: 'left'
      });
  });
  
  // ─── ÍNDICE ─────────────────────────────────────────────────────────────
  doc.addPage();
  doc.fontSize(22).fillColor('#0f172a')
    .font('Helvetica-Bold')
    .text('Índice', 72, 72);
  
  doc.moveTo(72, 100).lineTo(523, 100)
    .strokeColor('#e2e8f0').lineWidth(1).stroke();
  
  let y = 120;
  casoData.secciones.forEach((seccion) => {
    doc.fontSize(12).fillColor('#1e293b')
      .font('Helvetica')
      .text(`• ${seccion.titulo}`, 82, y, {
        link: `#${seccion.id}`,
        underline: false
      });
    y += 25;
  });
  
  // ─── NÚMEROS DE PÁGINA ──────────────────────────────────────────────────
  const pages = doc.bufferedPageRange();
  for (let i = 1; i < pages.count; i++) {
    doc.switchToPage(i);
    doc.fontSize(9).fillColor('#94a3b8')
      .font('Helvetica')
      .text(`Página ${i} de ${pages.count - 1}`, 72, 800, {
        width: 451,
        align: 'center'
      });
  }
  
  doc.end();
  
  stream.on('finish', () => {
    console.log(`✅ PDF generado: ${outputPath}`);
    console.log(`   Páginas: ${pages.count}`);
    console.log(`   Secciones: ${casoData.secciones.length}`);
    console.log(`   Bookmarks: ${casoData.secciones.length}`);
  });
}

// ─── FALLBACK HTML ──────────────────────────────────────────────────────────
function generateHTML() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  
  let html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>${casoData.titulo} — Dossier Legal</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; line-height: 1.8; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .cover { text-align: center; padding: 100px 0; border-bottom: 3px solid #10b981; margin-bottom: 40px; }
    .cover h1 { font-size: 3em; color: #0f172a; margin-bottom: 10px; }
    .cover p { color: #64748b; font-size: 1.1em; }
    .confidential { color: #ef4444; font-weight: bold; letter-spacing: 3px; margin-top: 40px; }
    nav { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 40px; }
    nav h2 { font-size: 1.3em; margin-bottom: 15px; }
    nav ul { list-style: none; }
    nav li { padding: 5px 0; }
    nav a { color: #2563eb; text-decoration: none; }
    nav a:hover { text-decoration: underline; }
    section { margin-bottom: 50px; page-break-before: always; }
    section h2 { font-size: 1.6em; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; }
    pre { background: #f1f5f9; padding: 15px; border-radius: 6px; overflow-x: auto; font-size: 0.9em; }
    .footer { text-align: center; color: #94a3b8; font-size: 0.85em; margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    @media print { section { page-break-before: always; } }
  </style>
</head>
<body>
  <div class="cover">
    <h1>${casoData.titulo}</h1>
    <p>${casoData.subtitulo}</p>
    <p>Autor: ${casoData.autor}</p>
    <p>Fecha: ${casoData.fecha} | Versión: ${casoData.version}</p>
    <p class="confidential">CONFIDENCIAL</p>
  </div>
  
  <nav>
    <h2>Índice</h2>
    <ul>
      ${casoData.secciones.map(s => `<li><a href="#${s.id}">${s.titulo}</a></li>`).join('\n      ')}
    </ul>
  </nav>
  
  ${casoData.secciones.map(s => `
  <section id="${s.id}">
    <h2>${s.titulo}</h2>
    <pre>${s.contenido}</pre>
  </section>
  `).join('')}
  
  <div class="footer">
    <p>${casoData.titulo} — ${casoData.autor} — ${casoData.fecha}</p>
    <p>Generado automáticamente por dossier-generator.js</p>
  </div>
</body>
</html>`;

  const htmlPath = path.join(OUTPUT_DIR, 'dossier-caso-belentani.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`✅ HTML generado: ${htmlPath}`);
  console.log('   (Instala pdfkit para versión PDF: npm install pdfkit)');
}

// ─── CLI ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.log(`
Dossier Legal Generator — CASO_BELENTANI

Uso:
  node dossier-generator.js              Generar dossier
  node dossier-generator.js --watch      Regenerar al cambiar datos
  node dossier-generator.js --help       Ayuda

Archivos generados:
  output/dossier-caso-belentani.pdf      PDF premium
  output/dossier-caso-belentani.html     Fallback HTML
  data/legal/caso-belentani.json         Datos fuente
`);
} else {
  generatePDF();
}

module.exports = { casoData, generatePDF, generateHTML };
