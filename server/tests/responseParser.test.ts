import { describe, it, expect } from 'vitest';
import { parseAIResponse, extractJsonString } from '../src/ai/responseParser.js';

describe('responseParser', () => {
  it('parses valid raw JSON string', () => {
    const raw = JSON.stringify({
      productTitle: 'Handcrafted Ceramic Stoneware Mug - 14oz Speckled Coffee Cup',
      shortDescription: 'Elevate your morning routine with our wheel-thrown ceramic stoneware mug.',
      detailedDescription: 'Each piece is individually wheel-thrown from durable stoneware clay and finished with an organic matte speckle glaze. Featuring an ergonomic wide loop handle for comfortable holding and a generous 14oz capacity for your favorite brews.',
      sellingPoints: [
        'ARTISAN CRAFTED: Hand-thrown stoneware clay with one-of-a-kind speckled glaze variations',
        'GENEROUS CAPACITY: 14oz volume ideal for pour-overs, lattes, and herbal teas',
        'ERGONOMIC COMFORT: Wide handle designed for a balanced, heat-safe grip',
        'DURABLE EVERYDAY USE: Fired at high temperatures for chip resistance',
        'KITCHEN SAFE: Microwave and dishwasher safe for effortless daily convenience'
      ],
      searchKeywords: ['ceramic mug', 'stoneware coffee cup', 'handmade pottery', 'artisan gift', 'earthy kitchen'],
      socialCaption: 'Morning rituals just got an upgrade ☕ Hand-thrown, speckle-glazed, and ready for your favorite roast. Link in bio to shop small. #HandmadePottery #CoffeeLovers #ShopSmall'
    });

    const parsed = parseAIResponse(raw);
    expect(parsed.productTitle).toContain('Ceramic Stoneware Mug');
    expect(parsed.sellingPoints).toHaveLength(5);
    expect(parsed.searchKeywords).toContain('ceramic mug');
  });

  it('strips markdown code blocks correctly', () => {
    const fenced = `
Here is the generated product listing in JSON format:

\`\`\`json
{
  "productTitle": "Bamboo Wireless Fast Charger 15W",
  "shortDescription": "Sleek eco-friendly charging for your desktop.",
  "detailedDescription": "Experience fast 15W charging with authentic bamboo wood and aluminum construction.",
  "sellingPoints": [
    "Eco Material: Genuine natural bamboo face",
    "Fast Charging: Up to 15W quick charging",
    "Sleek Profile: Ultra-thin desk aesthetic",
    "Heat Dissipation: Brushed aluminum casing",
    "Universal Support: Qi-compatible devices"
  ],
  "searchKeywords": ["bamboo charger", "wireless charger", "desk tech", "eco gadget"],
  "socialCaption": "Power up naturally. Sustainable desktop tech you will love! #CleanDesk #EcoFriendly"
}
\`\`\`
Hope this helps your business!
`;

    const parsed = parseAIResponse(fenced);
    expect(parsed.productTitle).toBe('Bamboo Wireless Fast Charger 15W');
    expect(parsed.sellingPoints).toHaveLength(5);
    expect(parsed.searchKeywords.length).toBeGreaterThanOrEqual(4);
  });

  it('normalizes selling points to exactly 5 when fewer or more are provided', () => {
    const raw = JSON.stringify({
      productTitle: 'Leather Journal Notebook',
      shortDescription: 'Vintage refillable genuine leather notebook.',
      detailedDescription: 'Hand-stitched full-grain leather that develops a unique patina over time. Includes 200 pages of bleed-resistant paper.',
      sellingPoints: [
        'Full Grain Leather: Ages beautifully with use',
        'Thick Paper: 120gsm bleed-proof sheets'
      ],
      searchKeywords: 'leather journal, travel notebook, diary, sketchpad',
      socialCaption: 'Capture every idea in timeless leather. #Journaling'
    });

    const parsed = parseAIResponse(raw);
    expect(parsed.sellingPoints).toHaveLength(5);
    expect(parsed.sellingPoints[0]).toContain('Full Grain Leather');
    expect(parsed.searchKeywords).toContain('leather journal');
  });

  it('falls back gracefully to structured text extractor if JSON is malformed', () => {
    const nonJson = `
Product Title: Organic Linen Throw Blanket - Breathable Home Accent
Short Description: Soft pre-washed European flax linen throw for cozy living spaces.
Detailed Description: Lovingly woven from 100% natural flax linen, offering year-round breathability, textured softness, and relaxed drape.
Selling Points:
- 100% European Flax Linen
- Naturally Hypoallergenic & Breathable
- Pre-washed For Cloud-like Softness
- Generous 50x70 Inch Coverage
- Machine Washable & Durable
Keywords: linen throw, organic blanket, home decor, couch throw, linen bedding
Social Media Caption: Upgrade your lounge space with pure natural linen comfort. #LinenHome #NaturalLiving
`;

    const parsed = parseAIResponse(nonJson);
    expect(parsed.productTitle).toContain('Organic Linen Throw Blanket');
    expect(parsed.sellingPoints).toHaveLength(5);
    expect(parsed.searchKeywords.length).toBeGreaterThan(0);
  });
});
