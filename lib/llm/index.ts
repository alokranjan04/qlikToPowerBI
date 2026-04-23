export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  role: Role;
  content: string;
  timestamp?: number;
}

export interface ChatResponse {
  content: string;
  error?: string;
}

export interface LLMProvider {
  /**
   * Generates a chat response based on the message history and additional context.
   */
  chat(messages: Message[], systemPrompt?: string): Promise<ChatResponse>;
}

export type ProviderType = 'anthropic' | 'azure' | 'gemini';

export function getProvider(type: ProviderType): LLMProvider {
  switch (type) {
    case 'anthropic':
      return require('./providers/anthropic').anthropicProvider;
    case 'azure':
      return require('./providers/azure-openai').azureOpenAIProvider;
    case 'gemini':
      return require('./providers/gemini').geminiProvider;
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}
