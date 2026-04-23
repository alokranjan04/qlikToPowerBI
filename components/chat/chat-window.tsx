import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Copy, Check, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { Message } from '@/lib/llm';
import { BIHelperMode } from '../layout/sidebar';

interface ChatWindowProps {
  mode: BIHelperMode;
  contextParams: string;
}

export function ChatWindow({ mode, contextParams }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const STORAGE_KEY = `pbi_assistant_history_${mode.replace(/\s+/g, '_')}`;

  // Load history on mount or mode change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: Message[] = JSON.parse(saved);
        // Retain messages from the last 30 days
        const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const recentMessages = parsed.filter(
          (m) => !m.timestamp || (now - m.timestamp < thirtyDaysMs)
        );
        setMessages(recentMessages);
      } else {
        setMessages([]);
      }
    } catch (e) {
      console.error('Failed to load chat history', e);
      setMessages([]);
    }
  }, [mode, STORAGE_KEY]);

  // Save history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [messages, STORAGE_KEY]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim(), timestamp: Date.now() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: contextParams,
          mode: mode,
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.result, timestamp: Date.now() }]);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Check browser console.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      <header className="h-16 border-b border-slate-200 px-6 flex items-center justify-between shrink-0 bg-white z-10 w-full">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-slate-800">{mode} Mode</h2>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase rounded border border-blue-100">Secure Internal Instance</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={clearChat}
            className="flex items-center justify-center gap-2 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors text-xs"
          >
            <RefreshCw className="w-3 h-3" />
            New Chat
          </button>
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="text-right">
              <p className="text-sm font-medium leading-none text-slate-900">Current User</p>
              <p className="text-[10px] text-slate-400 uppercase mt-1">PBI Developer</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white relative">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">How can I help with Power BI?</h3>
            <p className="text-sm text-slate-500 max-w-sm mt-2">
              Select a mode on the left and start typing below. I can generate DAX, explain measures, and more.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
            <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 text-xs font-bold ${
              msg.role === 'user'
                ? 'bg-slate-100 border border-slate-200 text-slate-600'
                : 'bg-blue-600 border border-blue-700 text-white italic'
            }`}>
              {msg.role === 'user' ? 'US' : 'AI'}
            </div>
            <div
              className={`p-5 rounded-lg border border-slate-200 text-sm relative group ${
                msg.role === 'user'
                  ? 'bg-slate-50 text-slate-900 leading-relaxed text-right'
                  : 'bg-white shadow-sm text-slate-900'
              }`}
            >
              {msg.role === 'assistant' && (
                <button
                  onClick={() => handleCopy(msg.content, idx)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 text-slate-600"
                  title="Copy response"
                >
                  {copiedIndex === idx ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
              {msg.role === 'user' ? (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <div className="markdown-body text-sm overflow-hidden prose-pre:bg-slate-900 prose-pre:text-blue-300 prose-pre:p-4 prose-pre:rounded prose-pre:font-mono prose-pre:text-xs prose-pre:leading-5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4 max-w-3xl mr-auto">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center shrink-0 border border-blue-700 text-white font-bold italic text-xs">
              AI
            </div>
            <div className="p-5 rounded-lg border border-slate-200 bg-white shadow-sm flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
              <span className="text-xs text-slate-400 font-medium">Thinking</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center max-w-4xl mx-auto mt-4">
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3 w-full">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col shrink-0">
        <div className="flex-1 relative max-w-3xl mx-auto w-full">
          <textarea
            className="w-full h-full min-h-[60px] max-h-48 p-3 pr-20 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none shadow-sm resize-none bg-white text-slate-900"
            rows={2}
            placeholder={
              mode === 'DAX Generator' ? 'Describe your request or paste error message...' :
              mode === 'Visualization Recommender' ? 'What data are you trying to show?' :
              'Ask a question...'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className={`absolute bottom-3 right-3 px-4 py-1.5 rounded text-xs font-bold transition-colors ${
              input.trim() && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            disabled={!input.trim() || isLoading}
            onClick={handleSend}
          >
            RUN
          </button>
        </div>
        <div className="text-center mt-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
            Context Memory: 30 Days // Tokens limit approx active // Enterprise Usage
          </span>
        </div>
      </div>
    </div>
  );
}
