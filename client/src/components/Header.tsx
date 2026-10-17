import React from 'react';
import { Sparkles, Cpu, ExternalLink } from 'lucide-react';
import type { ModelStatus } from '../types';

interface HeaderProps {
  modelStatus: ModelStatus | null;
  onOpenSetupModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ modelStatus, onOpenSetupModal }) => {
  const isReady = modelStatus?.ready;
  const isConfigured = modelStatus?.configured;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">ListingLab</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Side Hustle AI
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  Hacktoberfest 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                E-commerce listing generator powered by open-weight AI
              </p>
            </div>
          </div>

          {/* Model Status Pill & Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSetupModal}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isReady
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  : isConfigured
                  ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                  : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
              }`}
              title="Click to view AI Provider & Model Configuration"
            >
              <Cpu className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-mono truncate max-w-[150px] sm:max-w-[220px]">
                {modelStatus?.model || 'Open-Weight Model'}
              </span>
              {isReady ? (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              ) : (
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              )}
            </button>

            <button
              onClick={onOpenSetupModal}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100 hidden md:flex items-center gap-1"
            >
              <span>Setup Guide</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
