#!/usr/bin/env node
/**
 * 🛒 GUMROAD PUBLISHER — Publicación de productos digitales en Gumroad/Stripe
 * Tarea #4 del plan Manus — Noiacore Lab
 */
const fs = require('fs');
const path = require('path');
const PRODUCTS_DIR = path.join(__dirname, '..', 'data', 'products');

const productTemplate = {
  name: '', type: 'digital', // digital | course | bundle | membership
  price: 0, currency: 'USD',
  description: '', shortDescription: '',
  coverImage: '', previewUrl: '',
  files: [], tags: [], category: 'technology',
  customFields: [], maxPurchaseCount: null,
  requireShipping: false, isPayWhatYouWant: false,
  suggestedAmount: null, refundPolicy: '30-day',
  status: 'draft' // draft | published | archived
};

function createProduct(name, type = 'digital') {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const product = { ...productTemplate, name, type, id: slug, createdAt: new Date().toISOString() };
  const filePath = path.join(PRODUCTS_DIR, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(product, null, 2));
  console.log(`✅ Producto creado: ${filePath}`);
  console.log(`   Edita el archivo para completar los detalles.`);
  return product;
}

function listProducts() {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  const files = fs.readdirSync(PRODUCTS_DIR).filter(f => f.endsWith('.json'));
  if (files.length === 0) { console.log('   No hay productos. Usa: create <nombre>'); return; }
  console.log(`\n🛒 Productos (${files.length})\n`);
  files.forEach(f => {
    const p = JSON.parse(fs.readFileSync(path.join(PRODUCTS_DIR, f), 'utf-8'));
    const icon = p.status === 'published' ? '🟢' : '🟡';
    console.log(`  ${icon} ${p.name} — $${p.price || 0} ${p.currency} (${p.status})`);
  });
}

function validateProduct(slug) {
  const filePath = path.join(PRODUCTS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) { console.log(`❌ Producto no encontrado: ${slug}`); return; }
  const product = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const errors = [];
  if (!product.name) errors.push('Falta nombre');
  if (!product.description) errors.push('Falta descripción');
  if (product.price <= 0 && !product.isPayWhatYouWant) errors.push('Precio debe ser > 0 o pay-what-you-want');
  if (product.files.length === 0 && product.type === 'digital') errors.push('Faltan archivos descargables');
  if (errors.length === 0) {
    console.log(`✅ ${product.name} está listo para publicar`);
    console.log(`   → Requiere navegador autenticado para publicar en Gumroad/Stripe`);
  } else {
    console.log(`❌ Errores en ${product.name}:`);
    errors.forEach(e => console.log(`   • ${e}`));
  }
}

function generateCheckoutTest(slug) {
  console.log(`\n🧪 Test de checkout para: ${slug}`);
  console.log(`   1. Publica el producto en modo test/sandbox`);
  console.log(`   2. Usa tarjeta de test: 4242 4242 4242 4242`);
  console.log(`   3. Verifica email de confirmación`);
  console.log(`   4. Verifica descarga del archivo`);
  console.log(`   5. Verifica webhook de pago`);
  console.log(`   ⚠️  Requiere navegador autenticado (Manus)`);
}

const args = process.argv.slice(2);
switch (args[0]) {
  case 'create': createProduct(args[1], args[2]); break;
  case 'list': listProducts(); break;
  case 'validate': validateProduct(args[1]); break;
  case 'test-checkout': generateCheckoutTest(args[1]); break;
  default:
    console.log(`
Gumroad Publisher — Noiacore Lab

Uso:
  node gumroad-publisher.js create <nombre> [tipo]   Crear producto
  node gumroad-publisher.js list                     Listar productos
  node gumroad-publisher.js validate <slug>          Validar producto
  node gumroad-publisher.js test-checkout <slug>     Test de checkout
`);
}
