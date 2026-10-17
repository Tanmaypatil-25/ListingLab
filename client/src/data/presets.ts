import type { ListingFormData } from '../types';

export interface PresetItem {
  id: string;
  label: string;
  platform: string;
  data: ListingFormData;
}

export const PRESETS: PresetItem[] = [
  {
    id: 'ceramic-mug',
    label: 'Artisan Ceramic Mug (Etsy)',
    platform: 'Etsy',
    data: {
      productName: 'Hand-Thrown Speckled Ceramic Coffee Mug',
      brandName: 'TerraCraft Ceramics',
      category: 'Home & Kitchen / Drinkware',
      sellingPlatform: 'Etsy',
      tone: 'Storytelling & Artisanal',
      price: '$34.00',
      language: 'English',
      targetAudience: 'Specialty coffee lovers, handmade pottery collectors, thoughtful gift givers',
      features:
        'Individually wheel-thrown using durable stoneware clay. Finished with an organic matte speckle glaze with a natural raw unglazed clay foot. 14 oz (415 ml) capacity. Wide ergonomic loop handle for a comfortable, balanced grip. Microwave and dishwasher safe, lead-free food-safe glaze.',
    },
  },
  {
    id: 'wireless-charger',
    label: 'Eco Bamboo Charger (Amazon)',
    platform: 'Amazon',
    data: {
      productName: 'EcoBamboo 15W Fast Wireless Charging Pad',
      brandName: 'NordicVolt',
      category: 'Electronics / Cell Phone Accessories',
      sellingPlatform: 'Amazon',
      tone: 'Professional',
      price: '$28.99',
      language: 'English',
      targetAudience: 'Eco-conscious remote workers, minimalists, modern desk setup enthusiasts',
      features:
        'Sustainably harvested natural bamboo top surface with CNC-machined recycled aluminum alloy base. Up to 15W high-speed wireless charging output compatible with all Qi-enabled smartphones and wireless earbuds. Built-in smart temperature sensor prevents overheating. Includes 4ft braided USB-C cable and anti-slip silicone base feet. Dimensions: 98mm diameter x 8mm ultra-thin thickness.',
    },
  },
  {
    id: 'leather-wallet',
    label: 'Slim Leather Cardholder (Shopify)',
    platform: 'Shopify',
    data: {
      productName: 'The Apex Slim Front Pocket Leather Cardholder',
      brandName: 'Kinsman Leather Co.',
      category: 'Accessories / Wallets',
      sellingPlatform: 'Shopify',
      tone: 'Luxury & Premium',
      price: '$45.00',
      language: 'English',
      targetAudience: 'Minimalist everyday carry (EDC) enthusiasts, modern professionals looking to ditch bulky bifolds',
      features:
        'Handcrafted from 100% full-grain vegetable-tanned Italian leather. Saddle-stitched by hand with waxed poly cord for lifetime seam durability. Holds up to 6 cards plus folded cash in central cash pocket. Built-in RFID blocking liner protects against digital skim theft. Compact footprint measuring 4.0 x 2.8 inches and only 0.25 inches thick. Ages with a rich, unique patina over time.',
    },
  },
];
