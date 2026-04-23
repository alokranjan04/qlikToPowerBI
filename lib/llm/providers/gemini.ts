import { GoogleGenAI } from '@google/genai';
import { LLMProvider, Message, ChatResponse } from '../index';

/**
 * Implementation for Google Gemini API
 * Uses the official @google/genai SDK.
 */
export const geminiProvider: LLMProvider = {
  async chat(messages: Message[], systemPrompt?: string): Promise<ChatResponse> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      return { content: '', error: 'Gemini API key is not configured.' };
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      // Combine previous messages into a conversational history for Gemini.
      // Next.js AI SDK or manual formatting can be used. For simplicity, we create a single prompt or use multi-turn chat format.
      const chat = ai.chats.create({
        model: 'gemini-3.1-pro-preview',
        config: systemPrompt ? { systemInstruction: systemPrompt } : undefined
      });
      
      // We must construct the history. The latest message is sent via sendMessage.
      const previousMessages = messages.slice(0, -1);
      const latestMessage = messages[messages.length - 1];

      // Assuming we could pass history to the construct, however @google/genai format for sending history can be complex.
      // Alternatively, we use generateContent directly if we don't need persistent chat session reference.
      
      const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const res = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: contents, // Sending all messages
        config: systemPrompt ? { systemInstruction: systemPrompt } : undefined
      });

      return {
        content: res.text || ''
      };
    } catch (error: any) {
      console.error('Gemini Provider Error:', error);
      return {
        content: '',
        error: error.message || 'An error occurred during Gemini generation.'
      };
    }
  }
};
