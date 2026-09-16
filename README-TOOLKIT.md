# 🛠️ Manus Operations Toolkit — Pedro Belentani

Herramientas construidas para que Manus (o tú) ejecute las 20 tareas operativas.

## 📁 Estructura

```
scripts/
├── uptime-monitor.js          # Monitor horario de 9 sitios + alertas
├── backup-verifier.js         # Backup verificado GitHub + HF + IPFS
├── api-costs-dashboard.js     # Dashboard de costes APIs con alertas
├── secret-rotator.js          # Rotación de secretos API (vault cifrado)
├── dossier-generator.js       # Dossier legal CASO_BELENTANI en PDF
├── ai-providers-radar.js      # Radar comparativo de proveedores IA
├── duck-studio-distribution.js # Distribución musical Duck Studio
├── cv-autopilot.js            # CV autopiloto para ofertas
└── edu-benchmark.js           # Benchmark plataformas educativas

data/
├── legal/                     # Datos del caso legal
├── radar/                     # Datos del radar IA
└── benchmark/                 # Datos del benchmark educativo

vault/
└── secrets.enc                # Vault cifrado AES-256-GCM

logs/
├── uptime/                    # Historial de uptime
├── costs/                     # Historial de costes
└── backups/                   # Informes de backup

output/
├── dossier-caso-belentani.pdf # Dossier legal
├── dossier-caso-belentani.html # Fallback HTML
└── edu-benchmark.csv          # Hoja de cálculo benchmark

music/duck-studio/
├── metadata/                  # Templates y datos de release
├── artwork/                   # Portada (3000x3000 JPEG)
└── audio/                     # Archivos WAV/FLAC

cv/
├── applications/              # CVs y cartas adaptadas por oferta
└── pipeline.json              # Estado de todas las aplicaciones
```

## 🚀 Uso Rápido

### 1. Monitor de Uptime
```bash
# Una vez
node scripts/uptime-monitor.js

# Daemon (cada hora)
node scripts/uptime-monitor.js --daemon

# Con alertas Telegram
TELEGRAM_BOT_TOKEN=xxx TELEGRAM_CHAT_ID=xxx node scripts/uptime-monitor.js --daemon
```

### 2. Backup Verificado
```bash
# Requiere: gh auth login
node scripts/backup-verifier.js

# Con HuggingFace
HF_TOKEN=xxx node scripts/backup-verifier.js

# Con IPFS
PINATA_JWT=xxx node scripts/backup-verifier.js
```

### 3. Dashboard de Costes
```bash
node scripts/api-costs-dashboard.js

# Con todas las APIs
ALIBABA_API_KEY=xxx HF_TOKEN=xxx OPENROUTER_API_KEY=xxx GROQ_API_KEY=xxx \
  node scripts/api-costs-dashboard.js --alert
```

### 4. Vault de Secretos
```bash
# Configurar
export VAULT_PASSPHRASE="tu-passphrase-segura"

# Guardar secreto
node scripts/secret-rotator.js set alibaba_key sk-xxxxx

# Listar
node scripts/secret-rotator.js list

# Rotar
node scripts/secret-rotator.js rotate alibaba

# Exportar .env
node scripts/secret-rotator.js export --env
```

### 5. Dossier Legal
```bash
# Generar PDF (requiere: npm install pdfkit)
node scripts/dossier-generator.js

# Si no hay pdfkit, genera HTML automáticamente
```

### 6. Radar Proveedores IA
```bash
node scripts/ai-providers-radar.js
node scripts/ai-providers-radar.js --compare alibaba
```

### 7. Duck Studio
```bash
# Preparar metadata
node scripts/duck-studio-distribution.js prepare

# Validar
node scripts/duck-studio-distribution.js validate

# Estado
node scripts/duck-studio-distribution.js status
```

### 8. CV Autopiloto
```bash
# Ver portales
node scripts/cv-autopilot.js scan

# Aplicar a oferta
node scripts/cv-autopilot.js apply https://linkedin.com/jobs/123 "AI Engineer" "Google" ai automation

# Ver pipeline
node scripts/cv-autopilot.js pipeline
```

### 9. Benchmark Educativo
```bash
node scripts/edu-benchmark.js
node scripts/edu-benchmark.js --compare
node scripts/edu-benchmark.js --export csv
```

## 🔐 Seguridad

- El vault usa **AES-256-GCM** con derivación PBKDF2 (100K iteraciones)
- Nunca commitees `vault/`, `logs/`, `.env.generated`
- El `.gitignore` ya excluye estos directorios
- Las API keys solo viven en el vault cifrado o en variables de entorno

## 🤖 Integración con Manus

Cada script está diseñado para que Manus pueda:
1. Ejecutarlo en su VM en la nube
2. Usar el navegador autenticado para tareas web
3. Programar ejecución recurrente (cron)
4. Generar entregables (PDFs, CSVs, informes)

El prompt completo para Manus está en el dashboard web (`src/components/PromptSection.tsx`).

## 📋 Checklist de Ejecución

### Fase A — Operar la web
- [ ] Configurar DNS/SSL (`scripts/dns-config.js`)
- [ ] Rotar secretos API (`scripts/secret-rotator.js`)
- [ ] Conectar OAuth (requiere navegador Manus)
- [ ] Subir Duck Studio (`scripts/duck-studio-distribution.js`)
- [ ] cv-ai autopiloto (`scripts/cv-autopilot.js`)

### Fase B — Investigación
- [ ] Benchmark educativo (`scripts/edu-benchmark.js`)
- [ ] Radar proveedores IA (`scripts/ai-providers-radar.js`)
- [ ] Grants/becas (requiere scraping web)
- [ ] Jurisprudencia (requiere scraping web)

### Fase C — 24/7
- [ ] Monitor uptime (`scripts/uptime-monitor.js --daemon`)
- [ ] Backup diario (`scripts/backup-verifier.js`)
- [ ] Dashboard costes (`scripts/api-costs-dashboard.js`)

### Fase D — Entregables
- [ ] Dossier legal (`scripts/dossier-generator.js`)
- [ ] Contenido vertical (requiere generación de video)
