import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck, ExternalLink } from 'lucide-react';
import type { ModelStatus } from '../types';

interface SetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ModelStatus | null;
}

export const SetupModal: React.FC<SetupModalProps> = ({ isOpen, onClose, status }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const groqEnvSnippet = `# In .env at project root:
AI_PROVIDER=groq
AI_API_KEY=gsk_your_groq_api_key_here
AI_MODEL=openai/gpt-oss-120b`;

  const ollamaEnvSnippet = `# In .env at project root:
AI_PROVIDER=ollama
AI_BASE_URL=http://localhost:11434/v1
AI_MODEL=llama3.2`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Provider & Inference Setup</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ListingLab runs strictly on open-weight models with no closed-model lock-in.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-slate-700">
          {/* Active Status Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Active Server Configuration
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Provider:</span>
                <span className="font-medium text-slate-800">{status?.provider || 'groq'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Open-Weight Model:</span>
                <span className="font-mono font-medium text-slate-800">{status?.model || 'openai/gpt-oss-120b'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Execution Mode:</span>
                <span className="font-medium text-slate-800">
                  {status?.isLocal ? '100% Local (Private)' : 'Remote Cloud Endpoint'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Endpoint URL:</span>
                <span className="font-mono text-slate-800 truncate block max-w-[200px]" title={status?.endpoint}>
                  {status?.endpoint || 'https://api.groq.com/openai/v1'}
                </span>
              </div>
            </div>
          </div>

          {/* Option 1: Groq Free Tier (Recommended for speed & accuracy) */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h4 className="font-semibold text-slate-900">
                  Option A: Groq Cloud (Free Open-Weight Inference)
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Fastest & Free
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Groq provides free, near-instant inference for top open-weight models including{' '}
              <strong>openai/gpt-oss-120b</strong> and <strong>Llama 3.1 8B Instant</strong>.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 mb-3">
              <li>
                Create a free account and generate an API key at{' '}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
                >
                  console.groq.com/keys <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Add the key to your root <code className="bg-slate-100 px-1 py-0.5 rounded">.env</code> file:</li>
            </ol>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                {groqEnvSnippet}
              </pre>
              <button
                onClick={() => copyToClipboard(groqEnvSnippet, 'groq')}
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs flex items-center gap-1"
              >
                {copiedKey === 'groq' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Option 2: Local Ollama (100% Free, Private, Offline) */}
          <div className="border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h4 className="font-semibold text-slate-900">
                  Option B: Local Ollama (100% Private & Free)
                </h4>
              </div>
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Zero Cloud
              </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Run open-weight models directly on your hardware without transmitting data to any cloud service.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-600 mb-3">
              <li>
                Install Ollama from <a href="https://ollama.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">ollama.com</a>
              </li>
              <li>Run the model locally: <code className="bg-slate-100 px-1 py-0.5 rounded">ollama run llama3.2</code></li>
              <li>Update your <code className="bg-slate-100 px-1 py-0.5 rounded">.env</code> file:</li>
            </ol>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                {ollamaEnvSnippet}
              </pre>
              <button
                onClick={() => copyToClipboard(ollamaEnvSnippet, 'ollama')}
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs flex items-center gap-1"
              >
                {copiedKey === 'ollama' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Privacy & Grounding Notice */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900">Privacy & Data Transmission:</strong>
              <p className="mt-0.5">
                Only the product features, title, category, and platform parameters you enter in the form are sent to the AI endpoint. No personal customer data, payment information, or API credentials are ever exposed to client browsers or third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
