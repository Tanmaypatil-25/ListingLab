import { GeneratedListing, ListingInput } from '../types.js';

export interface GenerateResult {
  listing: GeneratedListing;
  rawResponse?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface IAIProvider {
  name: string;
  isLocal: boolean;
  generateListing(input: ListingInput): Promise<GenerateResult>;
  checkHealth(): Promise<{ healthy: boolean; message: string; details?: any }>;
}
