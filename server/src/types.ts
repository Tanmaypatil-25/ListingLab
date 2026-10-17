import { z } from 'zod';

export const SellingPlatformSchema = z.enum([
  'Shopify',
  'Etsy',
  'Amazon',
  'eBay',
  'WooCommerce',
  'General',
]);

export type SellingPlatform = z.infer<typeof SellingPlatformSchema>;

export const ToneSchema = z.enum([
  'Professional',
  'Friendly & Warm',
  'Luxury & Premium',
  'Excited & Urgent',
  'Minimalist & Direct',
  'Storytelling & Artisanal',
]);

export type Tone = z.infer<typeof ToneSchema>;

export const ListingInputSchema = z.object({
  productName: z.string().trim().min(2, 'Product name must be at least 2 characters').max(200, 'Product name cannot exceed 200 characters'),
  category: z.string().trim().min(2, 'Category must be at least 2 characters').max(100, 'Category cannot exceed 100 characters'),
  features: z.string().trim().min(10, 'Please describe key features or materials with at least 10 characters').max(2500, 'Features description cannot exceed 2500 characters'),
  targetAudience: z.string().trim().min(2, 'Target audience must be at least 2 characters').max(200, 'Target audience cannot exceed 200 characters'),
  sellingPlatform: SellingPlatformSchema.default('Shopify'),
  tone: ToneSchema.default('Professional'),
  price: z.string().trim().max(50, 'Price text is too long').optional().or(z.literal('')),
  language: z.string().trim().max(50, 'Language text is too long').optional().default('English'),
  brandName: z.string().trim().max(100, 'Brand name is too long').optional().or(z.literal('')),
});

export type ListingInput = z.infer<typeof ListingInputSchema>;

export const GeneratedListingSchema = z.object({
  productTitle: z.string().min(5, 'Product title is required'),
  shortDescription: z.string().min(10, 'Short description is required'),
  detailedDescription: z.string().min(20, 'Detailed description is required'),
  sellingPoints: z.array(z.string().min(3)).min(3, 'At least 3 selling points required').max(7),
  searchKeywords: z.array(z.string().min(2)).min(3, 'At least 3 keywords required'),
  socialCaption: z.string().min(10, 'Social caption is required'),
});

export type GeneratedListing = z.infer<typeof GeneratedListingSchema>;

export interface AIProviderConfig {
  provider: 'groq' | 'openrouter' | 'huggingface' | 'ollama' | 'custom';
  baseUrl: string;
  apiKey: string;
  model: string;
  isLocal: boolean;
  timeoutMs: number;
}

export interface ModelStatusResponse {
  ready: boolean;
  provider: string;
  model: string;
  endpoint: string;
  isLocal: boolean;
  message: string;
  instructions?: string;
  configured: boolean;
}

export interface GenerateResponse {
  success: boolean;
  data: GeneratedListing;
  metadata: {
    provider: string;
    model: string;
    isLocal: boolean;
    platform: SellingPlatform;
    executionTimeMs: number;
  };
}
