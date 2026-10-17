import { GeneratedListing, GeneratedListingSchema } from '../types.js';

export class ResponseParseError extends Error {
  constructor(message: string, public readonly rawContent?: string) {
    super(message);
    this.name = 'ResponseParseError';
  }
}

/**
 * Extracts and cleans JSON string from raw model text output
 */
export const extractJsonString = (raw: string): string => {
  let cleaned = raw.trim();

  // Strip markdown code fences (```json ... ``` or ``` ...)
  const fenceRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const matchFence = cleaned.match(fenceRegex);
  if (matchFence && matchFence[1]) {
    cleaned = matchFence[1].trim();
  }

  // If text has pre/post-ambles, find outermost curly braces
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
};

/**
 * Fallback parser for non-JSON formatted text output from smaller open-weight models
 */
export const fallbackTextExtractor = (raw: string): GeneratedListing => {
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);

  let productTitle = 'Generated Product Listing';
  let shortDescription = '';
  let detailedDescription = '';
  const sellingPoints: string[] = [];
  const searchKeywords: string[] = [];
  let socialCaption = '';

  let currentSection = '';

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes('title') && (lower.startsWith('product') || lower.startsWith('title') || lower.startsWith('**title'))) {
      currentSection = 'title';
      productTitle = line.replace(/^[#*\s]*product\s*title:?\s*/i, '').replace(/^[#*\s]*title:?\s*/i, '').trim();
      continue;
    }
    if (lower.includes('short description') || lower.includes('hook')) {
      currentSection = 'short';
      const content = line.replace(/^[#*\s]*short\s*description:?\s*/i, '').trim();
      if (content) shortDescription += (shortDescription ? ' ' : '') + content;
      continue;
    }
    if (lower.includes('detailed description') || lower.includes('long description') || lower.includes('body')) {
      currentSection = 'detailed';
      const content = line.replace(/^[#*\s]*detailed\s*description:?\s*/i, '').trim();
      if (content) detailedDescription += (detailedDescription ? '\n\n' : '') + content;
      continue;
    }
    if (lower.includes('selling point') || lower.includes('bullet point') || lower.includes('key feature')) {
      currentSection = 'bullets';
      continue;
    }
    if (lower.includes('keyword') || lower.includes('tags') || lower.includes('search term')) {
      currentSection = 'keywords';
      const content = line.replace(/^[#*\s]*keywords?:?\s*/i, '').trim();
      if (content) {
        content.split(/[,;\n]+/).forEach((k) => {
          const trimmed = k.trim().replace(/^[-*•]\s*/, '');
          if (trimmed) searchKeywords.push(trimmed);
        });
      }
      continue;
    }
    if (lower.includes('social') || lower.includes('caption') || lower.includes('instagram')) {
      currentSection = 'social';
      const content = line.replace(/^[#*\s]*social\s*(media)?\s*caption:?\s*/i, '').trim();
      if (content) socialCaption += (socialCaption ? ' ' : '') + content;
      continue;
    }

    // Accumulate under current section
    if (currentSection === 'bullets' && (line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))) {
      sellingPoints.push(line.replace(/^[-*•\d.]+\s*/, '').trim());
    } else if (currentSection === 'keywords') {
      line.split(/[,;\n]+/).forEach((k) => {
        const trimmed = k.trim().replace(/^[-*•]\s*/, '');
        if (trimmed) searchKeywords.push(trimmed);
      });
    } else if (currentSection === 'short') {
      shortDescription += (shortDescription ? ' ' : '') + line;
    } else if (currentSection === 'detailed') {
      detailedDescription += '\n\n' + line;
    } else if (currentSection === 'social') {
      socialCaption += '\n' + line;
    }
  }

  // Ensure minimum valid structure
  return sanitizeAndNormalize({
    productTitle: productTitle || 'High Quality Product Listing',
    shortDescription: shortDescription || (detailedDescription ? detailedDescription.substring(0, 150) : 'Premium quality crafted to elevate your daily routine.'),
    detailedDescription: detailedDescription || shortDescription || 'Designed with premium materials to provide optimal performance, longevity, and everyday style.',
    sellingPoints: sellingPoints.length >= 3 ? sellingPoints : [
      'Quality Craftsmanship: Built with carefully selected materials',
      'Versatile Utility: Tailored for seamless everyday performance',
      'Thoughtful Design: Engineered for comfort and style',
      'Customer Confidence: Backed by dependable quality standards',
      'Ready to Enjoy: An ideal addition to your home or workspace'
    ],
    searchKeywords: searchKeywords.length >= 3 ? searchKeywords : ['quality product', 'online shopping', 'everyday essential', 'premium design', 'gift idea'],
    socialCaption: socialCaption || 'Discover your new favorite essential! Crafted for style, performance, and everyday living. Link in bio to shop now. #Ecommerce #NewArrival #ShopSmall #SideHustle'
  });
};

/**
 * Normalizes and guarantees 5 selling points and clean keyword lists
 */
export const sanitizeAndNormalize = (rawObj: any): GeneratedListing => {
  const productTitle = String(rawObj.productTitle || '').trim();
  const shortDescription = String(rawObj.shortDescription || '').trim();
  const detailedDescription = String(rawObj.detailedDescription || '').trim();

  // Normalize selling points to an array of strings
  let sellingPoints: string[] = [];
  if (Array.isArray(rawObj.sellingPoints)) {
    sellingPoints = rawObj.sellingPoints
      .map((p: any) => String(p || '').trim())
      .filter((p: string) => p.length > 0);
  } else if (typeof rawObj.sellingPoints === 'string') {
    sellingPoints = rawObj.sellingPoints
      .split(/\n+/)
      .map((p: string) => p.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter((p: string) => p.length > 0);
  }

  // Ensure exactly 5 concise selling points
  if (sellingPoints.length > 5) {
    sellingPoints = sellingPoints.slice(0, 5);
  } else if (sellingPoints.length < 5) {
    const fallbacks = [
      'Premium Material Selection: Engineered for durability and reliable daily use',
      'Precision Design: Thoughtfully tailored to elevate user experience and aesthetics',
      'Versatile Utility: Suitable for diverse applications and lifestyle routines',
      'Effortless Integration: Seamlessly fits into your existing collection or workflow',
      'Outstanding Value: Quality craftsmanship that exceeds expectations',
    ];
    for (const fb of fallbacks) {
      if (sellingPoints.length >= 5) break;
      if (!sellingPoints.includes(fb)) {
        sellingPoints.push(fb);
      }
    }
  }

  // Normalize keywords
  let searchKeywords: string[] = [];
  if (Array.isArray(rawObj.searchKeywords)) {
    for (const item of rawObj.searchKeywords) {
      if (typeof item === 'string') {
        item.split(/[,]+/).forEach((k) => {
          const t = k.trim();
          if (t && !searchKeywords.includes(t)) searchKeywords.push(t);
        });
      }
    }
  } else if (typeof rawObj.searchKeywords === 'string') {
    searchKeywords = rawObj.searchKeywords
      .split(/[,;\n]+/)
      .map((k: string) => k.trim())
      .filter(Boolean);
  }

  if (searchKeywords.length === 0) {
    searchKeywords = ['quality goods', 'e-commerce', 'must-have', 'artisan', 'trending'];
  }

  const socialCaption = String(rawObj.socialCaption || '').trim();

  const candidate: GeneratedListing = {
    productTitle: productTitle || 'Premium Product Listing',
    shortDescription: shortDescription || 'Crafted with attention to detail for an elevated customer experience.',
    detailedDescription: detailedDescription || 'Engineered with quality materials to provide superior durability, timeless aesthetic appeal, and dependable daily performance.',
    sellingPoints,
    searchKeywords,
    socialCaption: socialCaption || 'Elevate your routine with our latest arrival. Handpicked quality designed for you. Tap the link in bio to explore more! #NewRelease #ShopSmall #SideHustle',
  };

  // Validate with Zod
  const validated = GeneratedListingSchema.safeParse(candidate);
  if (!validated.success) {
    throw new ResponseParseError(
      `Schema validation failed: ${validated.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`,
      JSON.stringify(rawObj)
    );
  }

  return validated.data;
};

/**
 * Main parser entrypoint
 */
export const parseAIResponse = (rawText: string): GeneratedListing => {
  if (!rawText || rawText.trim().length === 0) {
    throw new ResponseParseError('Empty response received from AI model');
  }

  const jsonCandidate = extractJsonString(rawText);

  try {
    const parsed = JSON.parse(jsonCandidate);
    return sanitizeAndNormalize(parsed);
  } catch (jsonErr) {
    // If strict JSON parse failed, try the structured fallback text extractor
    try {
      return fallbackTextExtractor(rawText);
    } catch (fallbackErr) {
      throw new ResponseParseError(
        `Failed to parse model output into listing structure: ${(jsonErr as Error).message}`,
        rawText
      );
    }
  }
};
