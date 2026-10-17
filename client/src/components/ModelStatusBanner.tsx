import React from 'react';
import { AlertCircle, CheckCircle, ShieldAlert } from 'lucide-react';
import type { ModelStatus } from '../types';

interface ModelStatusBannerProps {
  status: ModelStatus | null;
  onOpenSetupModal: () => void;
  mockMode: boolean;
  onToggleMockMode: (val: boolean) => void;
}

export const ModelStatusBanner: React.FC<ModelStatusBannerProps> = ({
  status,
  onOpenSetupModal,
  mockMode,
  onToggleMockMode,
}) => {
  if (!status) return null;

  if (status.ready && !mockMode) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between gap-4 text-xs text-emerald-900 mb-6">
        <div className="flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            Connected to <strong>{status.provider}</strong> running open-weight model{' '}
            <code className="font-mono bg-emerald-100/60 px-1.5 py-0.5 rounded text-emerald-800">
              {status.model}
            </code>
            {status.isLocal ? ' (Local Endpoint)' : ' (Cloud Inference)'}.
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenSetupModal}
            className="text-emerald-700 hover:text-emerald-900 underline font-medium"
          >
            Provider info
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-950 flex items-center gap-2">
              <span>AI Provider Status: {status.configured ? 'Endpoint Check Pending' : 'Credentials Not Configured'}</span>
              <span className="font-mono text-[11px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                {status.model}
              </span>
            </div>
            <p className="mt-0.5 text-amber-800">
              {status.message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
          <button
            onClick={() => onToggleMockMode(!mockMode)}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs border transition-colors ${
              mockMode
                ? 'bg-amber-200 border-amber-300 text-amber-900 font-semibold'
                : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-50'
            }`}
          >
            {mockMode ? '✓ Demo Mode Active' : 'Enable Demo Mode'}
          </button>
          <button
            onClick={onOpenSetupModal}
            className="bg-amber-800 hover:bg-amber-900 text-white px-3 py-1.5 rounded-lg font-medium text-xs transition-colors"
          >
            Setup Guide
          </button>
        </div>
      </div>

      {mockMode && (
        <div className="mt-3 pt-3 border-t border-amber-200/60 text-amber-900/90 flex items-center gap-2 text-[11px]">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
          <span>
            <strong>Demo Mode:</strong> Simulating open-weight responses for instant interface testing while you obtain an API key or start local Ollama. Real generation requires valid backend configuration.
          </span>
        </div>
      )}
    </div>
  );
};
