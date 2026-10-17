import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { PRESETS } from '../data/presets';
import type { PresetItem } from '../data/presets';

interface PresetsSelectorProps {
  onSelectPreset: (preset: PresetItem) => void;
  onClear: () => void;
  hasInput: boolean;
}

export const PresetsSelector: React.FC<PresetsSelectorProps> = ({
  onSelectPreset,
  onClear,
  hasInput,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Load Example Preset:</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all shadow-2xs font-medium"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {hasInput && (
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
          title="Clear form inputs"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear form</span>
        </button>
      )}
    </div>
  );
};
