export type SellingPlatform =
  | 'Shopify'
  | 'Etsy'
  | 'Amazon'
  | 'eBay'
  | 'WooCommerce'
  | 'General';

export type Tone =
  | 'Professional'
  | 'Friendly & Warm'
  | 'Luxury & Premium'
  | 'Excited & Urgent'
  | 'Minimalist & Direct'
  | 'Storytelling & Artisanal';

export interface ListingFormData {
  productName: string;
  category: string;
  features: string;
  targetAudience: string;
  sellingPlatform: SellingPlatform;
  tone: Tone;
  price?: string;
  language?: string;
  brandName?: string;
}

export interface GeneratedListing {
  productTitle: string;
  shortDescription: string;
  detailedDescription: string;
  sellingPoints: string[];
  searchKeywords: string[];
  socialCaption: string;
}

export interface ModelStatus {
  ready: boolean;
  configured: boolean;
  provider: string;
  model: string;
  endpoint: string;
  isLocal: boolean;
  message: string;
  instructions?: string;
}

export interface GenerateApiResponse {
  success: boolean;
  data: GeneratedListing;
  metadata: {
    provider: string;
    model: string;
    isLocal: boolean;
    platform: SellingPlatform;
    executionTimeMs: number;
    usage?: {
      promptTokens?: number;
      completionTokens?: number;
      totalTokens?: number;
    };
  };
}
