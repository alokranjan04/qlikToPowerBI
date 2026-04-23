import { GoogleGenAI } from '@google/genai';
import { LLMProvider, Message, ChatResponse, ChatOptions } from '../index';

/**
 * Implementation for Google Gemini API
 * Uses the official @google/genai SDK.
 */
export const geminiProvider: LLMProvider = {
  async chat(messages: Message[], systemPrompt?: string, options?: ChatOptions): Promise<ChatResponse> {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      return { content: '', error: 'Gemini API key is not configured.' };
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const modelId = options?.model || 'gemini-3.1-pro-preview';
      
      // Combine previous messages into a conversational history for Gemini.
      const filteredMessages = messages.filter(m => m.role !== 'system');
      const contents = filteredMessages.map((m, idx) => {
        const parts: any[] = [{ text: m.content }];
        
        // If this is the last user message, attach any files
        if (idx === filteredMessages.length - 1 && m.role === 'user' && options?.files) {
          options.files.forEach(file => {
            parts.push({
              inlineData: {
                mimeType: file.type || 'application/pdf',
                data: file.data
              }
            });
          });
        }
        
        return {
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: parts
        };
      });

      // In some versions of this SDK, systemInstruction is part of the model config
      // or passed as a separate argument. We'll follow the pattern provided in the file.
      const config: any = {};
      if (options?.temperature !== undefined) {
        config.temperature = Math.max(0, Math.min(1, options.temperature));
      }

      const res = await ai.models.generateContent({
        model: modelId,
        contents: contents,
        config: {
          ...config,
          systemInstruction: systemPrompt
        }
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
