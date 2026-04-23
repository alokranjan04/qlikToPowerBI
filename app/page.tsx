'use client';

import { useState, useEffect } from 'react';
import { BIHelperMode, Sidebar } from '@/components/layout/sidebar';
import { ContextPanel } from '@/components/chat/context-panel';
import { ChatWindow } from '@/components/chat/chat-window';
import { Message } from '@/lib/llm';

export interface Chat {
  id: string;
  title: string;
  mode: BIHelperMode;
  messages: Message[];
  timestamp: number;
}

export default function Home() {
  const [mode, setMode] = useState<BIHelperMode>('General Assistant');
  const [contextText, setContextText] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [selectedModel, setSelectedModel] = useState('gemini-3.1-pro-preview');
  
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  // Load chats on mount
  useEffect(() => {
    const saved = localStorage.getItem('pbi_assistant_chats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          setChats(parsed);
          setCurrentChatId(parsed[0].id);
          setMode(parsed[0].mode);
        } else {
          createNewChat();
        }
      } catch (e) {
        console.error('Failed to parse chats', e);
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, []);

  // Ensure at least one chat exists
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, [chats]);

  // Save chats on change
  useEffect(() => {
    localStorage.setItem('pbi_assistant_chats', JSON.stringify(chats));
  }, [chats]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Math.random().toString(36).substring(7),
      title: 'New Chat',
      mode: 'General Assistant',
      messages: [],
      timestamp: Date.now()
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setMode('General Assistant');
  };

  const updateChatMessages = (chatId: string, messages: Message[]) => {
    setChats(prev => prev.map(c => {
      if (c.id === chatId) {
        // Generate title from first message if it's "New Chat"
        let title = c.title;
        if (title === 'New Chat' && messages.length > 0) {
          title = messages[0].content.substring(0, 30) + (messages[0].content.length > 30 ? '...' : '');
        }
        return { ...c, messages, title, timestamp: Date.now() };
      }
      return c;
    }));
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== chatId);
      if (chatId === currentChatId) {
        if (filtered.length > 0) {
          setCurrentChatId(filtered[0].id);
          setMode(filtered[0].mode);
        } else {
          // No chats left, will be handled by the next cycle creating a default
          setCurrentChatId(null);
        }
      }
      return filtered;
    });
  };

  const currentChat = chats.find(c => c.id === currentChatId);

  return (
    <div className="bg-slate-50 flex h-screen w-full font-sans text-slate-900 overflow-hidden">
      <Sidebar 
        currentMode={mode} 
        onModeChange={(m) => {
          setMode(m);
        }} 
        chats={chats}
        currentChatId={currentChatId}
        onChatSelect={(id) => {
          setCurrentChatId(id);
          const chat = chats.find(c => c.id === id);
          if (chat) setMode(chat.mode);
        }}
        onChatDelete={deleteChat}
        onNewChat={createNewChat}
      />
      
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        <ChatWindow 
          mode={mode} 
          contextParams={contextText} 
          temperature={temperature}
          selectedModel={selectedModel}
          messages={currentChat?.messages || []}
          onMessagesChange={(msgs) => currentChatId && updateChatMessages(currentChatId, msgs)}
          onNewChat={createNewChat}
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
