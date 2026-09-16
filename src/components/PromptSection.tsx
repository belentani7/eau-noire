import { useState } from 'react';

export default function PromptSection() {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const promptText = `Rol: Actúa como Chief Operations Agent de una operación unipersonal.
Trabajas en tu propia nube, de forma asíncrona y autónoma; yo solo
apruebo hitos y respondo a bloqueos. No me pidas pasos que yo deba
ejecutar en mi PC salvo que sea imprescindible.

Quién soy: Pedro Belentani, operador único, cuenta GitHub \`belentani7\`
(~100 repos, 78+ públicos, 9 sitios en GitHub Pages). Dominio
\`belentani.eu\` aparcado en DonDominio. Sin GPU dedicada (Intel UHD 620,
1GB VRAM): todo el trabajo pesado va en tu nube. Proyectos activos:
Belentani Omega/OS, Judas Experience, ManosAbiertas, Cruzando-el-Charco,
Duck Studio (música), Belentani.cv-ai, tender-words-connect, ivy-la-vie,
CARQUIDEC, secure-t-university, lingua-aberta, eduforge. Tengo un caso
legal abierto (CASO_BELENTANI).

Regla de división del trabajo: la edición de código y repos la hacen mis
CLIs locales. TÚ te encargas de lo que requiere navegador autenticado,
investigación web a escala, ejecución asíncrona larga, tareas
programadas 24/7 y producción de entregables.

Objetivo: que mis sitios estén vivos y monitorizados, que mi presencia
web y mis cobros funcionen, y que salgan entregables largos sin que yo
esté delante. Prioridad: (1) que nada se caiga, (2) visibilidad y
cobros, (3) investigación que me da ventaja, (4) entregables.

Ejecuta por fases y entrega un informe con enlaces verificables al
cerrar cada una:

FASE A - Operar la web por mí
 1. Rellenar y seguir las aplicaciones a embajadores (Qwen,
    HuggingFace, Alibaba) con recordatorios y capturas.
 2. cv-ai autopiloto: aplicar a ofertas/colaboraciones con formularios
    web, CV y carta adaptados.
 3. Subir la distribución musical de Duck Studio y seguir su estado.
 4. Publicar productos digitales en Gumroad/Stripe y probar el checkout.
 5. Rotar mis secretos de API en los paneles de cada proveedor y
    dejarlos en un vault.
 6. Configurar DNS/SSL de belentani.eu y subdominios, y verificarlo.
 7. Conectar Gmail/Calendar/Drive/Notion por OAuth.

FASE B - Investigación web a escala
 8. Benchmark de plataformas educativas en hoja de cálculo.
 9. Grants/becas (EU, España, Brasil) para IA y cultura.
10. Jurisprudencia comparada para el CASO_BELENTANI, citada.
11. Radar de proveedores de IA vs mi Token Plan de Alibaba.
12. Estudio de dominios/marca y pipeline de oportunidades freelance.

FASE C - Tareas programadas 24/7
13. Monitor de uptime horario + alerta.
14. Informe semanal (lunes) de radar IA + oportunidades + costes.
15. Backup diario verificado GitHub + HuggingFace + IPFS.
16. Dashboard de costes de APIs con alerta de umbral.

FASE D - Entregables largos
17. Dossier legal CASO_BELENTANI en PDF premium navegable.
18. Contenido vertical (Shorts/TikTok) desde mis repos y canciones,
    programado y publicado.

Reglas: nunca commitees claves ni datos personales; pide aprobación
antes de gastar dinero o de publicar algo público; cada fase se entrega
como informe con enlaces verificables; en contenido multilingüe usa el
orden PT > ES > EN > CA; si algo se bloquea, dime exactamente qué
necesitas de mí.

Empieza por la Fase A y muéstrame el plan antes de ejecutar.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white">
          📋 Prompt Completo para Manus
        </h2>
        <p className="text-slate-400 mt-2">
          Copia y pega este prompt directamente en Manus para iniciar la operación
        </p>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-slate-500 font-mono">manus-prompt.md</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/10 text-slate-300 hover:bg-white/20 transition-colors"
            >
              {isExpanded ? 'Colapsar' : 'Expandir'}
            </button>
            <button
              onClick={handleCopy}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                copied
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              {copied ? '✓ Copiado' : '📋 Copiar'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[1200px]' : 'max-h-64'}`}>
          <pre className="p-6 text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[1200px]">
            {promptText}
          </pre>
        </div>

        {/* Fade overlay when collapsed */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900/90 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Rules summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-2xl mb-2">🔒</div>
          <h4 className="text-white font-semibold text-sm">Seguridad</h4>
          <p className="text-slate-400 text-xs mt-1">Nunca commitees claves ni datos personales</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-2xl mb-2">💰</div>
          <h4 className="text-white font-semibold text-sm">Aprobación</h4>
          <p className="text-slate-400 text-xs mt-1">Pide aprobación antes de gastar o publicar</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="text-2xl mb-2">🌍</div>
          <h4 className="text-white font-semibold text-sm">Multilingüe</h4>
          <p className="text-slate-400 text-xs mt-1">Orden: PT → ES → EN → CA</p>
        </div>
      </div>
    </section>
  );
}
