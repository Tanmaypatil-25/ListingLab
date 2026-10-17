import type { GeneratedListing, ListingFormData } from '../types';

/**
 * Demo Mode Listing Generator
 * Used ONLY when user explicitly toggles Demo Mode to test the UI flow
 * without backend AI credentials configured.
 */
export const generateDemoListing = (input: ListingFormData): GeneratedListing => {
  const brandPrefix = input.brandName ? `${input.brandName} ` : '';
  const platform = input.sellingPlatform;

  // Platform-specific title pattern
  let title = `${brandPrefix}${input.productName}`;
  if (platform === 'Amazon') {
    title = `${brandPrefix}${input.productName} - Premium Quality for ${input.targetAudience} - Official Specification`;
  } else if (platform === 'Etsy') {
    title = `Handcrafted ${input.productName} | Custom Artisan Gift for ${input.targetAudience}`;
  } else if (platform === 'Shopify') {
    title = `${brandPrefix}${input.productName} | Elevate Your Everyday`;
  } else if (platform === 'eBay') {
    title = `${brandPrefix}${input.productName} New Condition Premium Fast Dispatch`;
  }

  // Extract key points from provided features
  const featureSnippets = input.features
    .split(/[.\n;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  const bullet1 = featureSnippets[0]
    ? `PREMIUM CONSTRUCTION: ${featureSnippets[0]}`
    : 'VERIFIED MATERIALS: Engineered with high-grade components for long-term durability';

  const bullet2 = featureSnippets[1]
    ? `PURPOSE-BUILT DESIGN: ${featureSnippets[1]}`
    : `OPTIMIZED PERFORMANCE: Tailored specifically to meet the needs of ${input.targetAudience}`;

  const bullet3 = featureSnippets[2]
    ? `SPECIFICATION DETAILS: ${featureSnippets[2]}`
    : 'EVERYDAY UTILITY: Delivers dependable convenience and seamless routine integration';

  const bullet4 = featureSnippets[3]
    ? `AUTHENTIC QUALITY: ${featureSnippets[3]}`
    : 'METICULOUS STANDARDS: Every unit inspected for fit, finish, and structural integrity';

  const bullet5 = input.price
    ? `EXCEPTIONAL VALUE: Available at ${input.price} backed by dedicated customer support`
    : 'SATISFACTION COMMITMENT: Crafted with care for an elevated ownership experience';

  // Keywords
  const baseWords = [
    input.productName.toLowerCase(),
    input.category.toLowerCase(),
    'artisan design',
    'daily essential',
    'high quality',
    'shop small',
    'e-commerce favorite',
  ];

  return {
    productTitle: title.substring(0, 180),
    shortDescription: `Elevate your space with the ${brandPrefix}${input.productName}. Designed for ${input.targetAudience} with verified quality and lasting performance.`,
    detailedDescription: `Upgrade your collection with the ${brandPrefix}${input.productName}. Thoughtfully designed for ${input.targetAudience}, this piece seamlessly balances everyday utility with sophisticated aesthetic appeal.\n\nCrafted according to exact specifications:\n${input.features}\n\nWhether adding to your personal routine or giving as a thoughtful present, this ${input.category.toLowerCase()} delivers uncompromising quality and dependable satisfaction. Order yours today to experience the difference firsthand.`,
    sellingPoints: [bullet1, bullet2, bullet3, bullet4, bullet5],
    searchKeywords: baseWords,
    socialCaption: `Say hello to your new favorite essential ✨ The ${brandPrefix}${input.productName} is officially here. Crafted for ${input.targetAudience}.\n\nTap the link in bio to shop the collection! #${platform}Seller #SmallBusiness #SideHustle #NewRelease`,
  };
};
