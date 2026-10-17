import { describe, it, expect, vi } from 'vitest';
import { getDefaultsForProvider } from '../src/config.js';
import { OpenAICompatibleProvider } from '../src/ai/openaiCompatibleProvider.js';
import { ListingInput } from '../src/types.js';

describe('Model Configuration & Error Handling', () => {
  it('defaults Groq provider model to openai/gpt-oss-120b', () => {
    const defaults = getDefaultsForProvider('groq');
    expect(defaults.model).toBe('openai/gpt-oss-120b');
    expect(defaults.baseUrl).toBe('https://api.groq.com/openai/v1');
    expect(defaults.isLocal).toBe(false);
  });

  it('produces actionable message on 404 Model Not Found without leaking credentials', async () => {
    const provider = new OpenAICompatibleProvider({
      provider: 'groq',
      baseUrl: 'https://api.groq.com/openai/v1',
      apiKey: 'gsk_mock_test_secret_key_12345',
      model: 'deprecated-model-id',
      isLocal: false,
      timeoutMs: 5000,
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => JSON.stringify({ error: { message: "Model 'deprecated-model-id' does not exist" } }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const input: ListingInput = {
      productName: 'Handmade Wooden Tray',
      category: 'Home Goods',
      features: 'Solid acacia wood with food-safe oil finish, recessed handles, 16x12 inches.',
      targetAudience: 'Home entertainers',
      sellingPlatform: 'Etsy',
      tone: 'Friendly & Warm',
      language: 'English',
    };

    await expect(provider.generateListing(input)).rejects.toThrowError(
      /Model 'deprecated-model-id' was not found/
    );

    try {
      await provider.generateListing(input);
    } catch (err: any) {
      expect(err.message).toContain('openai/gpt-oss-120b');
      expect(err.message).not.toContain('gsk_mock_test_secret_key_12345');
    }

    vi.unstubAllGlobals();
  });

  it('produces actionable message on 401 Authentication Failure without leaking credentials', async () => {
    const provider = new OpenAICompatibleProvider({
      provider: 'groq',
      baseUrl: 'https://api.groq.com/openai/v1',
      apiKey: 'gsk_invalid_test_key_abcde',
      model: 'openai/gpt-oss-120b',
      isLocal: false,
      timeoutMs: 5000,
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ error: { message: 'Invalid API Key provided' } }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const input: ListingInput = {
      productName: 'Handmade Wooden Tray',
      category: 'Home Goods',
      features: 'Solid acacia wood with food-safe oil finish, recessed handles, 16x12 inches.',
      targetAudience: 'Home entertainers',
      sellingPlatform: 'Shopify',
      tone: 'Professional',
      language: 'English',
    };

    try {
      await provider.generateListing(input);
      expect.fail('Should have thrown an authentication error');
    } catch (err: any) {
      expect(err.message).toContain('Authentication failed');
      expect(err.message).toContain('AI_API_KEY');
      expect(err.message).not.toContain('gsk_invalid_test_key_abcde');
    }

    vi.unstubAllGlobals();
  });

  it('produces actionable message on 429 Rate Limit', async () => {
    const provider = new OpenAICompatibleProvider({
      provider: 'groq',
      baseUrl: 'https://api.groq.com/openai/v1',
      apiKey: 'gsk_test_key_rate_limit',
      model: 'openai/gpt-oss-120b',
      isLocal: false,
      timeoutMs: 5000,
    });

    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      text: async () => JSON.stringify({ error: { message: 'Rate limit reached for requests' } }),
    });
    vi.stubGlobal('fetch', mockFetch);

    const input: ListingInput = {
      productName: 'Handmade Wooden Tray',
      category: 'Home Goods',
      features: 'Solid acacia wood with food-safe oil finish, recessed handles, 16x12 inches.',
      targetAudience: 'Home entertainers',
      sellingPlatform: 'Amazon',
      tone: 'Professional',
      language: 'English',
    };

    try {
      await provider.generateListing(input);
      expect.fail('Should have thrown a rate limit error');
    } catch (err: any) {
      expect(err.message).toContain('Rate limit exceeded');
      expect(err.message).not.toContain('gsk_test_key_rate_limit');
    }

    vi.unstubAllGlobals();
  });
});
