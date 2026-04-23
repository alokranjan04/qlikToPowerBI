import { useState } from 'react';
import { ChevronRight, ChevronLeft, Database } from 'lucide-react';

interface ContextPanelProps {
  context: string;
  setContext: (val: string) => void;
}

export function ContextPanel({ context, setContext }: ContextPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div className="h-full border-l border-slate-200 bg-slate-50 flex items-start pt-4 px-2">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
          title="Open Context Panel"
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
          <Database className="w-4 h-4 text-slate-500" />
          Business Context
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="context-input" className="text-[10px] font-bold uppercase text-slate-400 tracking-widest cursor-pointer">
            Schema Context (Pasted)
          </label>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>
        <textarea
          id="context-input"
          className="w-full flex-1 p-3 bg-white border border-slate-200 rounded font-mono text-[11px] text-slate-500 resize-none outline-none shadow-inner focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. Table: Sales&#10;Columns: OrderDate (Date), Amount (Decimal), ProductID (Int)&#10;..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
        <p className="mt-3 text-[10px] text-slate-400 uppercase tracking-widest text-center">
          Security: Internal DLP active
        </p>
      </div>
    </aside>
  );
}
