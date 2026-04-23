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

/**
 * Ensures that messages alternate between 'user' and 'assistant' roles.
 * Merges consecutive messages of the same role and ensures the history starts with 'user'.
 */
export function squashMessages(messages: Message[]): Message[] {
  if (messages.length === 0) return [];

  const squashed: Message[] = [];
  
  // Filter out system messages as they are handled separately by providers
  const filtered = messages.filter(m => m.role !== 'system');

  for (const msg of filtered) {
    if (!msg.content.trim()) continue; // Skip empty messages

    const last = squashed[squashed.length - 1];
    if (last && last.role === msg.role) {
      // Merge consecutive messages of the same role
      last.content += "\n\n" + msg.content;
    } else {
      squashed.push({ ...msg });
    }
  }

  // Anthropic/Gemini/Perplexity often require starting with a 'user' message
  while (squashed.length > 0 && squashed[0].role === 'assistant') {
    squashed.shift();
  }

  return squashed;
}
