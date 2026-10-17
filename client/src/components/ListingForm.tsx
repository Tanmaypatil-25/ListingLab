import React, { useState } from 'react';
import { Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import type { ListingFormData, SellingPlatform, Tone } from '../types';
import { PlatformTips } from './PlatformTips';

interface ListingFormProps {
  formData: ListingFormData;
  onChange: (data: ListingFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const PLATFORMS: SellingPlatform[] = ['Shopify', 'Etsy', 'Amazon', 'eBay', 'WooCommerce', 'General'];

const TONES: Tone[] = [
  'Professional',
  'Friendly & Warm',
  'Luxury & Premium',
  'Excited & Urgent',
  'Minimalist & Direct',
  'Storytelling & Artisanal',
];

export const ListingForm: React.FC<ListingFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const updateField = (field: keyof ListingFormData, value: any) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation
  const errors: Record<string, string> = {};
  if (!formData.productName.trim()) {
    errors.productName = 'Product name is required';
  } else if (formData.productName.trim().length < 2) {
    errors.productName = 'Product name must be at least 2 characters';
  }

  if (!formData.category.trim()) {
    errors.category = 'Category is required';
  }

  if (!formData.features.trim()) {
    errors.features = 'Please describe features and materials';
  } else if (formData.features.trim().length < 10) {
    errors.features = 'Please provide at least 10 characters of features/materials';
  }

  if (!formData.targetAudience.trim()) {
    errors.targetAudience = 'Target audience is required';
  }

  const isValid = Object.keys(errors).length === 0;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Platform Selector Segmented Control */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <span>Target Selling Platform</span>
          <span className="text-[11px] font-normal text-slate-400">Optimizes format & rules</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200">
          {PLATFORMS.map((platform) => {
            const isSelected = formData.sellingPlatform === platform;
            return (
              <button
                key={platform}
                type="button"
                onClick={() => updateField('sellingPlatform', platform)}
                className={`py-1.5 text-xs font-medium rounded-lg transition-all text-center ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {platform}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Platform Strategy Helper Card */}
      <PlatformTips platform={formData.sellingPlatform} />

      {/* Product Name & Brand Name */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="productName" className="block text-xs font-semibold text-slate-700">
              Product Name <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {formData.productName.length}/200
            </span>
          </div>
          <input
            id="productName"
            type="text"
            value={formData.productName}
            onChange={(e) => updateField('productName', e.target.value)}
            onBlur={() => markTouched('productName')}
            placeholder="e.g. Hand-Thrown Speckled Ceramic Coffee Mug"
            maxLength={200}
            className={`w-full px-3 py-2 text-xs rounded-xl border bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all ${
              touched.productName && errors.productName
                ? 'border-red-400 bg-red-50/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          />
          {touched.productName && errors.productName && (
            <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.productName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="brandName" className="block text-xs font-semibold text-slate-700 mb-1">
            Brand Name <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="brandName"
            type="text"
            value={formData.brandName || ''}
            onChange={(e) => updateField('brandName', e.target.value)}
            placeholder="e.g. TerraCraft"
            maxLength={100}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 hover:border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
      </div>

      {/* Category & Tone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="category" className="block text-xs font-semibold text-slate-700 mb-1">
            Product Category <span className="text-red-500">*</span>
          </label>
          <input
            id="category"
            type="text"
            value={formData.category}
            onChange={(e) => updateField('category', e.target.value)}
            onBlur={() => markTouched('category')}
            placeholder="e.g. Home & Kitchen / Drinkware"
            maxLength={100}
            className={`w-full px-3 py-2 text-xs rounded-xl border bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all ${
              touched.category && errors.category
                ? 'border-red-400 bg-red-50/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          />
          {touched.category && errors.category && (
            <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.category}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="tone" className="block text-xs font-semibold text-slate-700 mb-1">
            Preferred Copywriting Tone
          </label>
          <select
            id="tone"
            value={formData.tone}
            onChange={(e) => updateField('tone', e.target.value as Tone)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 hover:border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all text-slate-800"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <label htmlFor="targetAudience" className="block text-xs font-semibold text-slate-700 mb-1">
          Target Audience & Buyer Persona <span className="text-red-500">*</span>
        </label>
        <input
          id="targetAudience"
          type="text"
          value={formData.targetAudience}
          onChange={(e) => updateField('targetAudience', e.target.value)}
          onBlur={() => markTouched('targetAudience')}
          placeholder="e.g. Specialty coffee lovers, minimalist home decor collectors, artisan gift seekers"
          maxLength={200}
          className={`w-full px-3 py-2 text-xs rounded-xl border bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all ${
            touched.targetAudience && errors.targetAudience
              ? 'border-red-400 bg-red-50/20'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        />
        {touched.targetAudience && errors.targetAudience && (
          <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.targetAudience}
          </p>
        )}
      </div>

      {/* Key Features & Materials Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label htmlFor="features" className="block text-xs font-semibold text-slate-700">
            Key Features, Materials & Dimensions <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {formData.features.length}/2500
          </span>
        </div>
        <textarea
          id="features"
          rows={4}
          value={formData.features}
          onChange={(e) => updateField('features', e.target.value)}
          onBlur={() => markTouched('features')}
          placeholder="Describe verified details: materials (e.g. stoneware, bamboo, full-grain leather), exact dimensions, capacities, care instructions, compatibility, or package contents..."
          maxLength={2500}
          className={`w-full px-3 py-2 text-xs rounded-xl border bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all leading-relaxed ${
            touched.features && errors.features
              ? 'border-red-400 bg-red-50/20'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        />
        <div className="flex items-start justify-between gap-2 mt-1">
          {touched.features && errors.features ? (
            <p className="text-[11px] text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.features}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span>
                <strong>Grounding rule:</strong> ListingLab strictly adheres to provided details and never invents unverified specifications.
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Optional Price and Language */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div>
          <label htmlFor="price" className="block text-xs font-semibold text-slate-700 mb-1">
            Listing Price <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="price"
            type="text"
            value={formData.price || ''}
            onChange={(e) => updateField('price', e.target.value)}
            placeholder="e.g. $34.00"
            maxLength={50}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 hover:border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>

        <div>
          <label htmlFor="language" className="block text-xs font-semibold text-slate-700 mb-1">
            Output Language <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="language"
            type="text"
            value={formData.language || 'English'}
            onChange={(e) => updateField('language', e.target.value)}
            placeholder="e.g. English, Spanish, German"
            maxLength={50}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 hover:border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || !isValid}
          className={`w-full py-3 px-4 rounded-xl text-xs font-semibold text-white shadow-sm flex items-center justify-center gap-2 transition-all ${
            isLoading || !isValid
              ? 'bg-slate-300 cursor-not-allowed text-slate-500'
              : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] shadow-emerald-700/20'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating Optimized Listing with Open-Weight AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Generate Professional Listing</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
