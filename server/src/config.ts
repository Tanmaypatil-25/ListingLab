import dotenv from 'dotenv';
import path from 'path';
import { AIProviderConfig } from './types.js';

// Load .env from workspace or server directory
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const providerEnv = (process.env.AI_PROVIDER || 'groq').toLowerCase() as
  | 'groq'
  | 'openrouter'
  | 'huggingface'
  | 'ollama'
  | 'custom';

export const getDefaultsForProvider = (provider: string) => {
  switch (provider) {
    case 'openrouter':
      return {
        baseUrl: 'https://openrouter.ai/api/v1',
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        isLocal: false,
      };
    case 'huggingface':
      return {
        baseUrl: 'https://api-inference.huggingface.co/v1',
        model: 'meta-llama/Llama-3.2-3B-Instruct',
        isLocal: false,
      };
    case 'ollama':
      return {
        baseUrl: 'http://localhost:11434/v1',
        model: 'llama3.2',
        isLocal: true,
      };
    case 'custom':
      return {
        baseUrl: process.env.AI_BASE_URL || 'http://localhost:11434/v1',
        model: process.env.AI_MODEL || 'openai/gpt-oss-120b',
        isLocal: (process.env.AI_BASE_URL || '').includes('localhost') || (process.env.AI_BASE_URL || '').includes('127.0.0.1'),
      };
    case 'groq':
    default:
      return {
        baseUrl: 'https://api.groq.com/openai/v1',
        model: 'openai/gpt-oss-120b',
        isLocal: false,
      };
  }
};

const providerDefaults = getDefaultsForProvider(providerEnv);

let activeModel = process.env.AI_MODEL?.trim() || providerDefaults.model;

// Graceful fallback if legacy deprecated model is passed for Groq
if (providerEnv === 'groq' && activeModel === 'llama-3.3-70b-versatile') {
  console.warn(
    '[ListingLab Config Warning]: Model llama-3.3-70b-versatile was deprecated by Groq. Automatically routing to recommended openai/gpt-oss-120b.'
  );
  activeModel = 'openai/gpt-oss-120b';
}

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  ai: {
    provider: providerEnv,
    baseUrl: process.env.AI_BASE_URL || providerDefaults.baseUrl,
    apiKey: process.env.AI_API_KEY || (providerEnv === 'ollama' ? 'ollama' : ''),
    model: activeModel,
    isLocal: providerDefaults.isLocal,
    timeoutMs: parseInt(process.env.AI_TIMEOUT_MS || '45000', 10),
  } as AIProviderConfig,
};

export const hasValidCredentials = (): boolean => {
  if (config.ai.isLocal) return true;
  return Boolean(config.ai.apiKey && config.ai.apiKey.trim().length > 0);
};
