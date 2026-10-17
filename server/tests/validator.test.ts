import { describe, it, expect } from 'vitest';
import { ListingInputSchema } from '../src/types.js';

describe('ListingInputSchema Validation', () => {
  it('accepts valid product input', () => {
    const valid = {
      productName: 'Handcrafted Ceramic Coffee Mug',
      category: 'Home & Kitchen',
      features: 'Wheel-thrown stoneware clay with matte earthy speckle glaze, 14oz capacity, ergonomic loop handle, microwave and dishwasher safe.',
      targetAudience: 'Specialty coffee lovers and handmade pottery collectors',
      sellingPlatform: 'Etsy',
      tone: 'Friendly & Warm',
      price: '$34.00',
      language: 'English',
      brandName: 'TerraCraft Studio',
    };

    const result = ListingInputSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.productName).toBe('Handcrafted Ceramic Coffee Mug');
      expect(result.data.sellingPlatform).toBe('Etsy');
    }
  });

  it('rejects product name that is too short', () => {
    const invalid = {
      productName: 'A',
      category: 'Home',
      features: 'Handmade item with good quality features and materials for everyday usage.',
      targetAudience: 'Coffee enthusiasts',
    };

    const result = ListingInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects features description that is too short', () => {
    const invalid = {
      productName: 'Ceramic Mug',
      category: 'Home',
      features: 'Mug',
      targetAudience: 'Coffee drinkers',
    };

    const result = ListingInputSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('applies defaults for platform and tone when omitted', () => {
    const minimal = {
      productName: 'Minimalist Desk Mat',
      category: 'Office',
      features: 'Water-resistant vegan PU leather, non-slip suede base, 80x40cm large surface area.',
      targetAudience: 'Remote workers, desk setup enthusiasts',
    };

    const result = ListingInputSchema.safeParse(minimal);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.sellingPlatform).toBe('Shopify');
      expect(result.data.tone).toBe('Professional');
      expect(result.data.language).toBe('English');
    }
  });
});
