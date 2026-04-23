import { LLMProvider, Message, ChatResponse, ChatOptions, squashMessages } from '../index';

/**
 * Implementation for Perplexity AI API
 * Uses OpenAI-compatible API format.
 */
export const perplexityProvider: LLMProvider = {
  async chat(messages: Message[], systemPrompt?: string, options?: ChatOptions): Promise<ChatResponse> {
    const apiKey = process.env.PERPLEXITY_KEY;
    
    if (!apiKey) {
      return { content: '', error: 'Perplexity API key is not configured.' };
    }

    try {
      const squashedMessages = squashMessages(messages);
      const mappedMessages = [];
      
      if (systemPrompt) {
        mappedMessages.push({ role: 'system', content: systemPrompt });
      }

      mappedMessages.push(...squashedMessages.map(m => ({
        role: m.role,
        content: m.content
      })));

      const body: any = {
        model: options?.model || 'sonar-pro',
        messages: mappedMessages,
        temperature: options?.temperature !== undefined ? Math.max(0, Math.min(1, options.temperature)) : 0.2
      };

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Perplexity HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content
      };
    } catch (error: any) {
      console.error('Perplexity Provider Error:', error);
      return {
        content: '',
        error: error.message || 'An error occurred during Perplexity generation.'
      };
    }
  }
};
