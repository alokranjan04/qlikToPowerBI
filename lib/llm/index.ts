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

export interface ChatOptions {
  temperature?: number; // 0-1
  model?: string;
  files?: Array<{ name: string; type: string; data: string }>;
}

export interface LLMProvider {
  /**
   * Generates a chat response based on the message history and additional context.
   */
  chat(messages: Message[], systemPrompt?: string, options?: ChatOptions): Promise<ChatResponse>;
}

export type ProviderType = 'anthropic' | 'azure' | 'gemini';

export const MODEL_CONFIG: Record<string, { provider: ProviderType; id: string; name: string }> = {
  'gemini-3.1-pro': {
    provider: 'gemini',
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro'
  },
  'gemini-1.5-pro': {
    provider: 'gemini',
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro'
  },
  'gemini-1.5-flash': {
    provider: 'gemini',
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash'
  },
  'claude-3-5-sonnet': {
    provider: 'anthropic',
    id: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet'
  },
  'azure-gpt-4': {
    provider: 'azure',
    id: 'gpt-4',
    name: 'Azure OpenAI GPT-4'
  }
};

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

export function getAvailableModels(): Array<{ id: string; name: string; provider: ProviderType }> {
  return Object.values(MODEL_CONFIG).map(config => ({
    id: config.id,
    name: config.name,
    provider: config.provider
  }));
}

export function getProviderForModel(modelId: string): ProviderType {
  for (const config of Object.values(MODEL_CONFIG)) {
    if (config.id === modelId) {
      return config.provider;
    }
  }
  // Default to gemini
  return 'gemini';
}
