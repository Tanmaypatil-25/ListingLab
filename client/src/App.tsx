import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ModelStatusBanner } from './components/ModelStatusBanner';
import { PresetsSelector } from './components/PresetsSelector';
import { ListingForm } from './components/ListingForm';
import { ResultsPanel } from './components/ResultsPanel';
import { SetupModal } from './components/SetupModal';
import type { GeneratedListing, ListingFormData, ModelStatus } from './types';
import { fetchModelStatus, generateListing, ApiError } from './services/api';
import { generateDemoListing } from './data/mockGenerator';
import type { PresetItem } from './data/presets';
import { ShieldCheck } from 'lucide-react';

const INITIAL_FORM_DATA: ListingFormData = {
  productName: '',
  brandName: '',
  category: '',
  sellingPlatform: 'Shopify',
  tone: 'Professional',
  price: '',
  language: 'English',
  targetAudience: '',
  features: '',
};

export const App: React.FC = () => {
  const [formData, setFormData] = useState<ListingFormData>(INITIAL_FORM_DATA);
  const [listing, setListing] = useState<GeneratedListing | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<{ message: string; instructions?: string[] } | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(false);
  const [mockMode, setMockMode] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<{
    model?: string;
    provider?: string;
    isLocal?: boolean;
    executionTimeMs?: number;
  }>({});

  // Fetch model status on component mount
  useEffect(() => {
    fetchModelStatus().then((status) => {
      setModelStatus(status);
      // If the backend has no API key and is not ready, start with mock mode available
      if (!status.ready && !status.configured) {
        setMockMode(true);
      }
    });
  }, []);

  const handleSelectPreset = (preset: PresetItem) => {
    setFormData(preset.data);
    setError(null);
  };

  const handleClearForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setListing(null);
    setError(null);
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError(null);

    // If Demo Mode is explicitly active, run simulated generation
    if (mockMode) {
      const startTime = Date.now();
      setTimeout(() => {
        const demo = generateDemoListing(formData);
        setListing(demo);
        setMetadata({
          model: 'demo-mode (simulated open-weight)',
          provider: 'ListingLab Demo Engine',
          isLocal: true,
          executionTimeMs: Date.now() - startTime,
        });
        setIsLoading(false);
      }, 1200);
      return;
    }

    // Live AI Generation via server
    const startTime = Date.now();
    try {
      const response = await generateListing(formData);
      setListing(response.data);
      setMetadata({
        model: response.metadata.model,
        provider: response.metadata.provider,
        isLocal: response.metadata.isLocal,
        executionTimeMs: response.metadata.executionTimeMs || Date.now() - startTime,
      });
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError({
          message: err.message,
          instructions: err.instructions || (err.status === 503 ? [
            'Click "Setup Guide" at the top to configure your free Groq API key.',
            'Or enable "Demo Mode" in the banner above to preview all editing & export features immediately.',
          ] : undefined),
        });
      } else {
        setError({
          message: err.message || 'An unexpected error occurred during generation.',
          instructions: ['Verify that the server is running on port 3001 and check network connectivity.'],
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasInput = Boolean(
    formData.productName || formData.features || formData.category || formData.targetAudience
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header
        modelStatus={modelStatus}
        onOpenSetupModal={() => setIsSetupModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Model Status & Alert Banner */}
        <ModelStatusBanner
          status={modelStatus}
          onOpenSetupModal={() => setIsSetupModalOpen(true)}
          mockMode={mockMode}
          onToggleMockMode={(val) => setMockMode(val)}
        />

        {/* Preset Selector */}
        <PresetsSelector
          onSelectPreset={handleSelectPreset}
          onClear={handleClearForm}
          hasInput={hasInput}
        />

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Inputs (5 cols on lg) */}
          <section className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Product Specifications</h2>
                <p className="text-xs text-slate-500">
                  Input details to craft your platform-optimized listing.
                </p>
              </div>
            </div>

            <ListingForm
              formData={formData}
              onChange={setFormData}
              onSubmit={handleGenerate}
              isLoading={isLoading}
            />
          </section>

          {/* Right Column: Results & Export Workspace (7 cols on lg) */}
          <section className="lg:col-span-7">
            <ResultsPanel
              listing={listing}
              onUpdateListing={setListing}
              isLoading={isLoading}
              error={error}
              onRegenerate={() => handleGenerate()}
              platform={formData.sellingPlatform}
              metadata={metadata}
            />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
              L
            </div>
            <span className="font-semibold text-slate-800">ListingLab</span>
            <span>—</span>
            <span>Built for the DEV Challenge: Hacktoberfest 2026 (Side Hustle)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Open-Weight AI (Llama 3.3 / Mistral / Qwen)</span>
            </span>
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="text-emerald-700 hover:text-emerald-900 underline font-medium"
            >
              Configure Model
            </button>
          </div>
        </div>
      </footer>

      {/* Setup Guide Modal */}
      <SetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        status={modelStatus}
      />
    </div>
  );
};

export default App;
