import { describe, it, expect } from 'vitest';
import { buildListingPrompt } from '../src/ai/promptBuilder.js';
import { ListingInput } from '../src/types.js';

describe('buildListingPrompt', () => {
  const baseInput: ListingInput = {
    productName: 'EcoBamboo Fast Wireless Charger',
    category: 'Electronics & Mobile Accessories',
    features: 'Natural bamboo wood top surface with brushed aluminum alloy casing. 15W fast wireless charging with smart heat dissipation. USB-C input cable included.',
    targetAudience: 'Eco-conscious tech professionals and minimalist home office setups',
    sellingPlatform: 'Amazon',
    tone: 'Professional',
    price: '$29.99',
    language: 'English',
    brandName: 'EcoVolt',
  };

  it('contains strict anti-hallucination instruction in system prompt', () => {
    const { systemPrompt } = buildListingPrompt(baseInput);
    expect(systemPrompt).toContain('CRITICAL ANTI-HALLUCINATION');
    expect(systemPrompt).toContain('NEVER invent specifications');
  });

  it('includes platform-specific guidance for Amazon', () => {
    const { userPrompt } = buildListingPrompt(baseInput);
    expect(userPrompt).toContain('Amazon');
    expect(userPrompt).toContain('EcoBamboo Fast Wireless Charger');
    expect(userPrompt).toContain('EcoVolt');
    expect(userPrompt).toContain('15W fast wireless charging');
  });

  it('adapts guidelines when Etsy is chosen', () => {
    const etsyInput = { ...baseInput, sellingPlatform: 'Etsy' as const };
    const { userPrompt } = buildListingPrompt(etsyInput);
    expect(userPrompt).toContain('Etsy');
    expect(userPrompt).toContain('craftsmanship');
  });
});
