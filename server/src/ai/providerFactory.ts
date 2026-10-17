import { config } from '../config.js';
import { IAIProvider } from './providerInterface.js';
import { OpenAICompatibleProvider } from './openaiCompatibleProvider.js';

let cachedProvider: IAIProvider | null = null;

export const getAIProvider = (): IAIProvider => {
  if (!cachedProvider) {
    cachedProvider = new OpenAICompatibleProvider(config.ai);
  }
  return cachedProvider;
};

export const resetAIProvider = (): void => {
  cachedProvider = null;
};
