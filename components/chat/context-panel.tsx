import { useState } from 'react';
import { ChevronRight, ChevronLeft, Database, Settings, Sliders } from 'lucide-react';
import { getAvailableModels } from '@/lib/llm';

interface ContextPanelProps {
  context: string;
  setContext: (val: string) => void;
  temperature: number;
  setTemperature: (val: number) => void;
  selectedModel: string;
  setSelectedModel: (val: string) => void;
}

export function ContextPanel({ 
  context, 
  setContext, 
  temperature, 
  setTemperature, 
  selectedModel, 
  setSelectedModel 
}: ContextPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const models = getAvailableModels();

  if (!isOpen) {
    return (
      <div className="h-full border-l border-slate-200 bg-slate-50 flex items-start pt-4 px-2">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
          title="Open Settings"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <aside className="w-80 bg-slate-50 border-l border-slate-200 h-full flex flex-col flex-shrink-0 transition-all">
      <div className="h-16 border-b border-slate-200 px-6 flex justify-between items-center bg-slate-50 shrink-0">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
          <Settings className="w-4 h-4 text-slate-500" />
          Configuration
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Model Section */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
              Model Selection
            </label>
          </div>
          <select 
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2.5 bg-white border border-slate-200 rounded text-sm text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
          >
            {models.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Temperature Section */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-4">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
              <Sliders className="w-3 h-3" />
              Temperature
            </label>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {temperature.toFixed(1)}
            </span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between mt-2">
            <span className="text-[9px] text-slate-400 font-medium">PRECISE</span>
            <span className="text-[9px] text-slate-400 font-medium">CREATIVE</span>
          </div>
        </div>

        {/* Context Section */}
        <div className="p-6 flex flex-col h-[300px]">
          <div className="flex items-center gap-2 mb-3">
            <label htmlFor="context-input" className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-1.5">
              <Database className="w-3 h-3" />
              Schema Context
            </label>
          </div>
          <textarea
            id="context-input"
            className="w-full flex-1 p-3 bg-white border border-slate-200 rounded font-mono text-[11px] text-slate-500 resize-none outline-none shadow-inner focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. Table: Sales&#10;Columns: OrderDate (Date), Amount (Decimal), ProductID (Int)&#10;..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6 border-t border-slate-200 bg-slate-50 shrink-0">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest text-center">
          Security: Internal DLP active
        </p>
      </div>
    </aside>
  );
}
