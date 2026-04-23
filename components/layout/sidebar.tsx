import { Code, BookOpen, Lightbulb, FileText, BarChart } from 'lucide-react';

export type BIHelperMode = 
  | 'General Assistant'
  | 'DAX Generator'
  | 'DAX Explainer'
  | 'Visualization Recommender'
  | 'Dashboard Documentation Writer'
  | 'Insight Summary Generator';

interface SidebarProps {
  currentMode: BIHelperMode;
  onModeChange: (mode: BIHelperMode) => void;
}

export function Sidebar({ currentMode, onModeChange }: SidebarProps) {
  const modes: { name: BIHelperMode; icon: React.ReactNode; desc: string }[] = [
    { name: 'General Assistant', icon: <BookOpen className="w-4 h-4" />, desc: 'Standard Q&A' },
    { name: 'DAX Generator', icon: <Code className="w-4 h-4" />, desc: 'Write optimized DAX' },
    { name: 'DAX Explainer', icon: <BookOpen className="w-4 h-4" />, desc: 'Explain complex measures' },
    { name: 'Visualization Recommender', icon: <BarChart className="w-4 h-4" />, desc: 'Best viz charts' },
    { name: 'Dashboard Documentation Writer', icon: <FileText className="w-4 h-4" />, desc: 'Generate reports' },
    { name: 'Insight Summary Generator', icon: <Lightbulb className="w-4 h-4" />, desc: 'Summarize context' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 h-full flex-shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">P</div>
        <span className="text-white font-semibold tracking-tight text-lg">BI-Assistant</span>
      </div>
      <nav className="px-4 flex-1 overflow-y-auto">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-2">Assistant Modes</p>
          <ul className="space-y-1">
            {modes.map((mode) => (
              <li key={mode.name}>
                <button
                  onClick={() => onModeChange(mode.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded cursor-pointer transition-colors ${
                    currentMode === mode.name
                      ? 'bg-slate-800 text-white'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className={`mt-0.5 ${currentMode === mode.name ? 'text-blue-400' : 'text-slate-400'}`}>
                    {mode.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{mode.name}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="p-4 border-t border-slate-800 text-xs flex flex-col gap-2">
        <div className="flex justify-between">
          <span>Environment:</span>
          <span className="text-blue-400 font-mono">PROD-ENT</span>
        </div>
        <div className="flex justify-between">
          <span>Provider:</span>
          <span className="text-green-400 font-mono">Secure API</span>
        </div>
      </div>
    </aside>
  );
}
