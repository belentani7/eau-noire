import { useState } from 'react';
import Hero from './components/Hero';
import BlockSection from './components/BlockSection';
import ProjectsSection from './components/ProjectsSection';
import ToolsSection from './components/ToolsSection';
import PromptSection from './components/PromptSection';
import Footer from './components/Footer';
import { blocks } from './data/blocks';

function App() {
  const [activeBlock, setActiveBlock] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      <Hero />
      
      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-emerald-400">20</div>
            <div className="text-sm text-slate-400 mt-1">Tareas exclusivas</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">4</div>
            <div className="text-sm text-slate-400 mt-1">Bloques operativos</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-amber-400">24/7</div>
            <div className="text-sm text-slate-400 mt-1">Ejecución asincrónica</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">∞</div>
            <div className="text-sm text-slate-400 mt-1">Nube dedicada</div>
          </div>
        </div>
      </div>

      {/* Blocks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {blocks.map((block) => (
          <BlockSection
            key={block.id}
            block={block}
            isExpanded={activeBlock === block.id}
            onToggle={() => setActiveBlock(activeBlock === block.id ? null : block.id)}
          />
        ))}
      </div>

      {/* Projects Section */}
      <ProjectsSection />

      {/* Tools Section */}
      <ToolsSection />

      {/* Prompt Section */}
      <PromptSection />
      
      <Footer />
    </div>
  );
}

export default App;
