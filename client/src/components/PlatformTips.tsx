import React from 'react';
import { Tag, ShoppingBag, Box, Award, Shield } from 'lucide-react';
import type { SellingPlatform } from '../types';

interface PlatformTipsProps {
  platform: SellingPlatform;
}

export const PlatformTips: React.FC<PlatformTipsProps> = ({ platform }) => {
  const getTips = (p: SellingPlatform) => {
    switch (p) {
      case 'Amazon':
        return {
          title: 'Amazon Listing Optimization',
          icon: <Box className="w-4 h-4 text-amber-600" />,
          bgColor: 'bg-amber-50/60',
          borderColor: 'border-amber-200/80',
          badgeColor: 'text-amber-800 bg-amber-100',
          bullets: [
            'Title includes brand, main feature, and high-volume search term (up to 200 chars).',
            '5 bullet points begin with capitalized benefit headers (e.g. ULTRA-DURABLE MATERIAL:).',
            'Strict adherence to Amazon TOS: No promotional phrases or unsubstantiated guarantees.',
          ],
        };
      case 'Etsy':
        return {
          title: 'Etsy Maker & Craft Optimization',
          icon: <Award className="w-4 h-4 text-orange-600" />,
          bgColor: 'bg-orange-50/60',
          borderColor: 'border-orange-200/80',
          badgeColor: 'text-orange-800 bg-orange-100',
          bullets: [
            'Descriptive, aesthetic title highlighting artisanal craftsmanship and materials.',
            'Warm, evocative narrative copy that connects the buyer with the maker process.',
            'Long-tail search tags designed for Etsy search discovery and gift shoppers.',
          ],
        };
      case 'Shopify':
        return {
          title: 'Shopify Direct-to-Consumer (DTC) Optimization',
          icon: <ShoppingBag className="w-4 h-4 text-emerald-600" />,
          bgColor: 'bg-emerald-50/60',
          borderColor: 'border-emerald-200/80',
          badgeColor: 'text-emerald-800 bg-emerald-100',
          bullets: [
            'Modern, uncluttered title tailored for clean storefront branding.',
            'Conversion-focused description highlighting lifestyle improvement and user benefits.',
            'Engaging social media caption formatted with hashtags for Instagram/TikTok marketing.',
          ],
        };
      case 'eBay':
        return {
          title: 'eBay Marketplace Optimization',
          icon: <Tag className="w-4 h-4 text-blue-600" />,
          bgColor: 'bg-blue-50/60',
          borderColor: 'border-blue-200/80',
          badgeColor: 'text-blue-800 bg-blue-100',
          bullets: [
            'Search-heavy 80-character title packed with keywords, model, and item specs.',
            'Clear item bullet points emphasizing condition, dimensions, and included accessories.',
            'Honest, straightforward copy that minimizes buyer returns and builds credibility.',
          ],
        };
      case 'WooCommerce':
      case 'General':
      default:
        return {
          title: 'Standard E-Commerce Optimization',
          icon: <Shield className="w-4 h-4 text-indigo-600" />,
          bgColor: 'bg-indigo-50/60',
          borderColor: 'border-indigo-200/80',
          badgeColor: 'text-indigo-800 bg-indigo-100',
          bullets: [
            'SEO-structured headings and balanced keyword density.',
            '5 bullet points balancing technical specifications with customer advantages.',
            'High-converting call to action and organic search keywords.',
          ],
        };
    }
  };

  const current = getTips(platform);

  return (
    <div className={`rounded-xl p-3.5 border text-xs ${current.bgColor} ${current.borderColor}`}>
      <div className="flex items-center gap-2 mb-2">
        {current.icon}
        <span className="font-semibold text-slate-800">{current.title}</span>
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ml-auto ${current.badgeColor}`}>
          {platform}
        </span>
      </div>
      <ul className="space-y-1 text-slate-600 pl-4 list-disc">
        {current.bullets.map((b, idx) => (
          <li key={idx}>{b}</li>
        ))}
      </ul>
    </div>
  );
};
