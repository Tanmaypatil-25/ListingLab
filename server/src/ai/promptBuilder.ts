import { ListingInput } from '../types.js';

export const buildListingPrompt = (input: ListingInput): { systemPrompt: string; userPrompt: string } => {
  const platformGuidelines: Record<string, string> = {
    Amazon: `
- Title: Keyword-rich (around 120-180 chars) including Brand (if provided), Product Name, key materials/features.
- Selling points: Exactly 5 bullet points. Each starts with a 2-4 word capitalized BENEFIT HEADER followed by the verified feature explanation.
- Descriptions: High clarity, focused on utility, dimensions, and customer use-cases.
- Keywords: High-intent backend search terms (comma separated concepts).`,
    Etsy: `
- Title: Warm, descriptive, artisanal phrasing prioritizing craftsmanship, materials, and aesthetic appeal.
- Selling points: Exactly 5 bullet points highlighting material quality, tactile details, gifting appeal, and care instructions.
- Descriptions: Story-driven, evocative narrative connecting maker dedication with customer appreciation.
- Keywords: Long-tail tags common on Etsy (e.g. handmade gift, minimalist home decor).`,
    Shopify: `
- Title: Clean, modern brand-focused title without clutter.
- Selling points: Exactly 5 punchy value propositions emphasizing lifestyle enhancement and problem-solving.
- Descriptions: Engaging direct-to-consumer copywriting with strong paragraphs and persuasive call to action.
- Keywords: Search-engine optimized e-commerce product keywords.`,
    eBay: `
- Title: Clear, search-focused title (up to 80 chars) highlighting essential specs, brand, model, and primary material.
- Selling points: Exactly 5 straightforward item specifics, verified features, compatibility, and contents.
- Descriptions: Transparent, accurate details emphasizing condition, specifications, and buyer reassurance.
- Keywords: Common buyer search queries and part/item descriptors.`,
    WooCommerce: `
- Title: Balanced SEO-friendly title suitable for independent e-commerce stores.
- Selling points: Exactly 5 structured benefit-driven bullet points.
- Descriptions: Comprehensive product copy balancing storytelling with technical specs.
- Keywords: Organic search keywords for web indexing.`,
    General: `
- Title: Clean, clear, professional e-commerce product title.
- Selling points: Exactly 5 concise benefit-oriented bullet points.
- Descriptions: Informative, polished product copy.
- Keywords: Core product search terms.`,
  };

  const selectedPlatform = input.sellingPlatform || 'Shopify';
  const guidelines = platformGuidelines[selectedPlatform] || platformGuidelines.General;

  const systemPrompt = `You are ListingLab, an expert e-commerce copywriter specializing in converting product details into high-converting listings.
You write for the selling platform: ${selectedPlatform}.
Target Tone: ${input.tone}.
Language: ${input.language || 'English'}.

CRITICAL ANTI-HALLUCINATION & TRUTHFULNESS RULE:
- NEVER invent specifications, measurements, certifications, medical/environmental claims, warranty periods, or materials that were not explicitly provided in the user's input.
- If a detail (such as waterproof rating, organic certification, battery life, or origin) is not mentioned in the user input, DO NOT ASSUME OR CLAIM IT.
- Stick strictly to verifiable benefits derived from the provided materials and features.
- If information is sparse, craft compelling copy around what IS known, without fabricating unsubstantiated claims.

OUTPUT FORMAT REQUIREMENTS:
You MUST respond with valid JSON ONLY (no markdown fences, no conversational text before or after).
The JSON object must match this exact structure:
{
  "productTitle": "A compelling title tailored for ${selectedPlatform}",
  "shortDescription": "A concise 1-2 sentence hook highlighting primary benefit",
  "detailedDescription": "A comprehensive 2-3 paragraph product description highlighting features, benefits, and usage instructions",
  "sellingPoints": [
    "Benefit 1: Concise explanation",
    "Benefit 2: Concise explanation",
    "Benefit 3: Concise explanation",
    "Benefit 4: Concise explanation",
    "Benefit 5: Concise explanation"
  ],
  "searchKeywords": [
    "keyword 1",
    "keyword 2",
    "keyword 3",
    "keyword 4",
    "keyword 5",
    "keyword 6",
    "keyword 7"
  ],
  "socialCaption": "An engaging social media post (for Instagram/TikTok/Pinterest) with a hook, product highlight, call to action, and 4-6 relevant hashtags"
}`;

  const userPromptParts = [
    `Product Name: ${input.productName}`,
    input.brandName ? `Brand: ${input.brandName}` : null,
    `Category: ${input.category}`,
    `Selling Platform: ${selectedPlatform}`,
    `Target Audience: ${input.targetAudience}`,
    `Preferred Tone: ${input.tone}`,
    input.price ? `Price: ${input.price}` : null,
    `Language: ${input.language || 'English'}`,
    `\nProvided Key Features & Materials:\n${input.features}`,
    `\nPlatform Guidelines:\n${guidelines}`,
    `\nReminder: Return ONLY valid JSON with keys productTitle, shortDescription, detailedDescription, sellingPoints (exactly 5 items), searchKeywords (array of strings), and socialCaption. Strictly ground all claims in the provided product details.`
  ].filter(Boolean);

  return {
    systemPrompt,
    userPrompt: userPromptParts.join('\n'),
  };
};
