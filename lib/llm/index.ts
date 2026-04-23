import { geminiProvider } from './providers/gemini';
import { anthropicProvider } from './providers/anthropic';
import { azureOpenAIProvider } from './providers/azure-openai';
import { perplexityProvider } from './providers/perplexity';

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

export type ProviderType = 'anthropic' | 'azure' | 'gemini' | 'perplexity';

export const MODEL_CONFIG: Record<string, { provider: ProviderType; id: string; name: string }> = {
  'gemini-3.1-pro': {
    provider: 'gemini',
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro'
  },
  'claude-3-7-sonnet': {
    provider: 'anthropic',
    id: 'claude-3-7-sonnet-20250219',
    name: 'Claude 3.7 Sonnet'
  },
  'perplexity-sonar-pro': {
    provider: 'perplexity',
    id: 'sonar-pro',
    name: 'Perplexity Sonar Pro'
  },
  'perplexity-sonar-reasoning': {
    provider: 'perplexity',
    id: 'sonar-reasoning-pro',
    name: 'Perplexity Sonar Reasoning'
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
      return anthropicProvider;
    case 'azure':
      return azureOpenAIProvider;
    case 'gemini':
      return geminiProvider;
    case 'perplexity':
      return perplexityProvider;
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
