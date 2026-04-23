'use client';

import { useState } from 'react';
import { BIHelperMode, Sidebar } from '@/components/layout/sidebar';
import { ContextPanel } from '@/components/chat/context-panel';
import { ChatWindow } from '@/components/chat/chat-window';

export default function Home() {
  const [mode, setMode] = useState<BIHelperMode>('General Assistant');
  const [contextText, setContextText] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [selectedModel, setSelectedModel] = useState('gemini-3.1-pro-preview');

  return (
    <div className="bg-slate-50 flex h-screen w-full font-sans text-slate-900 overflow-hidden">
      <Sidebar currentMode={mode} onModeChange={setMode} />
      
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        <ChatWindow 
          mode={mode} 
          contextParams={contextText} 
          temperature={temperature}
          selectedModel={selectedModel}
        />
      </main>

      <ContextPanel 
        context={contextText} 
        setContext={setContextText}
        temperature={temperature}
        setTemperature={setTemperature}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
    </div>
  );
}
