import { LLMProvider, Message, ChatResponse, ChatOptions } from '../index';

/**
 * Example Implementation for Anthropic API (Claude)
 * Uses native fetch instead of an SDK to keep dependencies light, fitting enterprise environments
 * that might require specific proxy or TLS settings.
 */
export const anthropicProvider: LLMProvider = {
  async chat(messages: Message[], systemPrompt?: string, options?: ChatOptions): Promise<ChatResponse> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return { content: '', error: 'Anthropic API key is not configured on the server.' };
    }

    try {
      // Map generic messages to Anthropic's expected format
      // Note: Anthropic extracts system prompt separately from the messages array
      const mappedMessages = messages.filter(m => m.role !== 'system').map(m => ({
        role: m.role,
        content: m.content
      }));

      const body: any = {
        model: 'claude-3-5-sonnet-20241022', // Company approved model version
        max_tokens: 4096,
        system: systemPrompt || undefined,
        messages: mappedMessages,
      };

      // Add temperature if specified
      if (options?.temperature !== undefined) {
        body.temperature = Math.max(0, Math.min(1, options.temperature)); // Clamp 0-1
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Anthropic HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      return {
        content: data.content[0].text
      };
    } catch (error: any) {
      console.error('Anthropic Provider Error:', error);
      return {
        content: '',
        error: error.message || 'An error occurred during generation.'
      };
    }
  }
};
