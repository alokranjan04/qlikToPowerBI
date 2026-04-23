import { Code, BookOpen, Lightbulb, FileText, BarChart, MessageSquare, Plus, Trash2 } from 'lucide-react';
import { Chat } from '@/app/page';

interface SidebarProps {
  currentMode: BIHelperMode;
  onModeChange: (mode: BIHelperMode) => void;
  chats: Chat[];
  currentChatId: string | null;
  onChatSelect: (id: string) => void;
  onChatDelete: (id: string) => void;
  onNewChat: () => void;
}

export type BIHelperMode = 
  | 'General Assistant'
  | 'DAX Generator'
  | 'DAX Explainer'
  | 'Visualization Recommender'
  | 'Dashboard Documentation Writer'
  | 'Insight Summary Generator';

export function Sidebar({ 
  currentMode, 
  onModeChange, 
  chats, 
  currentChatId, 
  onChatSelect, 
  onChatDelete,
  onNewChat 
}: SidebarProps) {
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

      <div className="px-4 mb-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          NEW CHAT
        </button>
      </div>

      <nav className="px-4 flex-1 overflow-y-auto">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 px-2">Assistant Modes</p>
          <ul className="space-y-1">
            {modes.map((mode) => (
              <li key={mode.name}>
                <button
                  onClick={() => onModeChange(mode.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg cursor-pointer transition-all ${
                    currentMode === mode.name
                      ? 'bg-slate-800 text-white shadow-inner'
                      : 'hover:bg-slate-800/50 text-slate-400'
                  }`}
                >
                  <div className={`shrink-0 ${currentMode === mode.name ? 'text-blue-400' : 'text-slate-600'}`}>
                    {mode.icon}
                  </div>
                  <div className="text-[13px] font-medium truncate">{mode.name}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 px-2">Recent Chats</p>
          <ul className="space-y-1">
            {chats.length === 0 && (
              <li className="px-3 py-4 text-[11px] text-slate-600 italic text-center bg-slate-800/20 rounded-lg border border-slate-800/50">
                No history yet
              </li>
            )}
            {chats.map((chat) => (
              <li key={chat.id} className="relative group">
                <button
                  onClick={() => onChatSelect(chat.id)}
                  className={`w-full flex flex-col gap-1 px-3 py-2.5 text-left rounded-lg transition-all ${
                    currentChatId === chat.id
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'hover:bg-slate-800/30 text-slate-400 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden pr-6">
                    <MessageSquare className={`w-3 h-3 shrink-0 ${currentChatId === chat.id ? 'text-blue-400' : 'text-slate-600'}`} />
                    <div className="text-[12px] font-medium truncate flex-1">{chat.title}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-5">
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-700/50 text-slate-500 rounded uppercase font-bold tracking-wider">
                      {chat.mode.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-slate-600 font-mono">
                      {new Date(chat.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChatDelete(chat.id);
                  }}
                  className="absolute right-2 top-3 p-1.5 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded"
                  title="Delete Chat"
                >
                  <Trash2 className="w-3 h-3" />
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
