import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCw,
  Sparkles,
  FileText,
  Tag,
  ListOrdered,
  Layers,
  ShieldCheck,
  AlertTriangle,
  FileJson,
  FileCode,
  Plus,
  Trash2,
} from 'lucide-react';
import type { GeneratedListing, SellingPlatform } from '../types';
import { EditableField } from './EditableField';

interface ResultsPanelProps {
  listing: GeneratedListing | null;
  onUpdateListing: (updated: GeneratedListing) => void;
  isLoading: boolean;
  error: { message: string; instructions?: string[] } | null;
  onRegenerate: () => void;
  platform: SellingPlatform;
  metadata?: {
    model?: string;
    provider?: string;
    isLocal?: boolean;
    executionTimeMs?: number;
  };
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  listing,
  onUpdateListing,
  isLoading,
  error,
  onRegenerate,
  platform,
  metadata,
}) => {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [isAddingKeyword, setIsAddingKeyword] = useState(false);
  const [downloadDropdown, setDownloadDropdown] = useState(false);

  // Field updater helpers
  const handleUpdateField = (field: keyof GeneratedListing, val: any) => {
    if (!listing) return;
    onUpdateListing({
      ...listing,
      [field]: val,
    });
  };

  const handleUpdateSellingPoint = (index: number, newText: string) => {
    if (!listing) return;
    const updated = [...listing.sellingPoints];
    updated[index] = newText;
    handleUpdateField('sellingPoints', updated);
  };

  const handleDeleteSellingPoint = (index: number) => {
    if (!listing || listing.sellingPoints.length <= 1) return;
    const updated = listing.sellingPoints.filter((_, i) => i !== index);
    handleUpdateField('sellingPoints', updated);
  };

  const handleAddSellingPoint = () => {
    if (!listing) return;
    const updated = [...listing.sellingPoints, 'New Benefit: Feature description'];
    handleUpdateField('sellingPoints', updated);
  };

  const handleRemoveKeyword = (index: number) => {
    if (!listing) return;
    const updated = listing.searchKeywords.filter((_, i) => i !== index);
    handleUpdateField('searchKeywords', updated);
  };

  const handleAddKeyword = () => {
    if (!listing || !newKeywordInput.trim()) return;
    const updated = [...listing.searchKeywords, newKeywordInput.trim()];
    handleUpdateField('searchKeywords', updated);
    setNewKeywordInput('');
    setIsAddingKeyword(false);
  };

  // Export Formats
  const generateMarkdownExport = (): string => {
    if (!listing) return '';
    return `# ${listing.productTitle}

**Platform Target:** ${platform}
${metadata?.model ? `**Model:** ${metadata.model} via ${metadata.provider}` : ''}

## Short Description
${listing.shortDescription}

## Key Selling Points
${listing.sellingPoints.map((p) => `- ${p}`).join('\n')}

## Detailed Description
${listing.detailedDescription}

## Search Keywords / Tags
${listing.searchKeywords.join(', ')}

## Social Media Caption
${listing.socialCaption}
`;
  };

  const handleCopyAll = () => {
    const md = generateMarkdownExport();
    navigator.clipboard.writeText(md);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyKeywords = () => {
    if (!listing) return;
    navigator.clipboard.writeText(listing.searchKeywords.join(', '));
    setCopiedKeywords(true);
    setTimeout(() => setCopiedKeywords(false), 2000);
  };

  const handleDownload = (format: 'markdown' | 'json') => {
    if (!listing) return;
    setDownloadDropdown(false);

    let content = '';
    let filename = '';
    let mimeType = '';

    const sanitizedTitle = listing.productTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 30) || 'product-listing';

    if (format === 'markdown') {
      content = generateMarkdownExport();
      filename = `${sanitizedTitle}-${platform.toLowerCase()}.md`;
      mimeType = 'text/markdown';
    } else {
      content = JSON.stringify(
        {
          metadata: {
            platform,
            ...metadata,
            exportedAt: new Date().toISOString(),
          },
          listing,
        },
        null,
        2
      );
      filename = `${sanitizedTitle}-${platform.toLowerCase()}.json`;
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // State 1: Loading
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center shadow-xs">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-emerald-500/10 -z-10 animate-ping"></div>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2">
          Generating Your {platform} Product Listing
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mb-6">
          Querying open-weight AI model with strict anti-hallucination constraints and platform-tailored copywriting rules...
        </p>

        {/* Dynamic Progress Indicator */}
        <div className="w-full max-w-xs space-y-2.5 text-left text-xs font-medium text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
          <div className="flex items-center gap-2 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Parsing verified product features...</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Enforcing zero-fabrication claim rules...</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-semibold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Writing SEO title & 5 benefit bullets for {platform}...</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            <span>Validating output structure & keywords...</span>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Error
  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-8 min-h-[500px] flex flex-col items-center justify-center text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-red-600" />
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2">Generation Request Failed</h3>
        <p className="text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-200 max-w-md mb-4 text-left leading-relaxed">
          {error.message}
        </p>

        {error.instructions && error.instructions.length > 0 && (
          <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-200 max-w-md w-full mb-6">
            <span className="text-xs font-semibold text-slate-700 block mb-2">How to resolve:</span>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              {error.instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onRegenerate}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // State 3: Empty
  if (!listing) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 min-h-[550px] flex flex-col items-center justify-center text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 text-slate-400">
          <FileText className="w-8 h-8" />
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2">Your Listing Workspace</h3>
        <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
          Enter your product details on the left, or choose an example preset above to generate an optimized, ready-to-sell listing for Shopify, Etsy, Amazon, or eBay.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg w-full text-left text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Fabrication</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Only claims and materials you specify are included.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Editing</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Every title, bullet, and description field is fully editable.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Instant Export</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Copy-all to clipboard or download as Markdown or JSON.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // State 4: Generated Results View
  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {platform} Listing
          </span>
          {metadata?.executionTimeMs && (
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Generated in {(metadata.executionTimeMs / 1000).toFixed(2)}s
            </span>
          )}
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRegenerate}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Regenerate listing with current inputs"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          {/* Download Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDownloadDropdown(!downloadDropdown)}
              className="p-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>

            {downloadDropdown && (
              <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-20 text-xs text-slate-700 animate-fade-in">
                <button
                  type="button"
                  onClick={() => handleDownload('markdown')}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileCode className="w-4 h-4 text-emerald-600" />
                  <span>Download Markdown (.md)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload('json')}
                  className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileJson className="w-4 h-4 text-amber-600" />
                  <span>Download JSON (.json)</span>
                </button>
              </div>
            )}
          </div>

          {/* Copy All Button */}
          <button
            type="button"
            onClick={handleCopyAll}
            className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              copiedAll
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Anti-Hallucination & Grounding Note */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            <strong>Grounded Output:</strong> Generated content strictly reflects only the verified specifications you entered.
          </span>
        </span>
        <span className="font-mono text-slate-400 hidden md:inline">
          {metadata?.model || 'Open-Weight Model'}
        </span>
      </div>

      {/* 1. Product Title */}
      <EditableField
        id="section-title"
        label="Product Title"
        badge={`${platform} Optimized`}
        value={listing.productTitle}
        onChange={(val) => handleUpdateField('productTitle', val)}
        tagline="Primary title tailored for platform search algorithm and customer click-through"
      />

      {/* 2. Short Description / Hook */}
      <EditableField
        id="section-short"
        label="Short Description / Hook"
        value={listing.shortDescription}
        onChange={(val) => handleUpdateField('shortDescription', val)}
        multiline
        rows={2}
        tagline="Quick 1-2 sentence hook for search snippets, mobile views, or buy-box overview"
      />

      {/* 3. Five Concise Selling Points */}
      <div id="section-bullets" className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">5 Key Selling Points</span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {listing.sellingPoints.length} Points
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddSellingPoint}
              className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100"
              title="Add bullet point"
            >
              <Plus className="w-3 h-3" />
              <span>Add Point</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const text = listing.sellingPoints.map((p) => `• ${p}`).join('\n');
                navigator.clipboard.writeText(text);
                setCopiedKeywords(true);
                setTimeout(() => setCopiedKeywords(false), 2000);
              }}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Bullets</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {listing.sellingPoints.map((point, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 group/item p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
            >
              <span className="text-xs font-bold text-slate-400 mt-1 min-w-[20px] font-mono">
                #{idx + 1}
              </span>
              <input
                type="text"
                value={point}
                onChange={(e) => handleUpdateSellingPoint(idx, e.target.value)}
                className="w-full text-xs text-slate-800 bg-transparent border-b border-transparent focus:border-emerald-500 focus:outline-hidden py-0.5"
              />
              <button
                type="button"
                onClick={() => handleDeleteSellingPoint(idx)}
                className="opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 p-1 transition-opacity"
                title="Delete point"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Detailed Description */}
      <EditableField
        id="section-detailed"
        label="Detailed Description"
        value={listing.detailedDescription}
        onChange={(val) => handleUpdateField('detailedDescription', val)}
        multiline
        rows={6}
        tagline="Comprehensive product narrative highlighting materials, user experience, care, and value"
      />

      {/* 5. Search Keywords */}
      <div id="section-keywords" className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">Search Keywords & Tags</span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {listing.searchKeywords.length} tags
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddingKeyword(true)}
              className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100"
            >
              <Plus className="w-3 h-3" />
              <span>Add Tag</span>
            </button>

            <button
              type="button"
              onClick={handleCopyKeywords}
              className={`p-1 px-2 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                copiedKeywords
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {copiedKeywords ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied Tags!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All Tags</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Interactive Keyword Tags */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {listing.searchKeywords.map((kw, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 group/tag hover:bg-slate-200 transition-colors"
            >
              <span>{kw}</span>
              <button
                type="button"
                onClick={() => handleRemoveKeyword(idx)}
                className="text-slate-400 hover:text-red-600 ml-0.5"
                title="Remove tag"
              >
                &times;
              </button>
            </span>
          ))}

          {isAddingKeyword && (
            <div className="inline-flex items-center gap-1">
              <input
                type="text"
                value={newKeywordInput}
                onChange={(e) => setNewKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddKeyword();
                  if (e.key === 'Escape') setIsAddingKeyword(false);
                }}
                placeholder="New keyword..."
                className="text-xs px-2 py-1 rounded border border-emerald-500 focus:outline-hidden w-28 bg-white"
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingKeyword(false)}
                className="text-xs px-1 text-slate-400 hover:text-slate-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 6. Social Media Caption */}
      <EditableField
        id="section-social"
        label="Social Media Caption"
        badge="Instagram / TikTok / Pinterest"
        value={listing.socialCaption}
        onChange={(val) => handleUpdateField('socialCaption', val)}
        multiline
        rows={3}
        tagline="Social-ready promotional copy formatted with hook, call to action, and targeted hashtags"
      />
    </div>
  );
};
