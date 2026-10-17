import React, { useState, useEffect } from 'react';
import { Copy, Check, Edit2, X } from 'lucide-react';

interface EditableFieldProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  multiline?: boolean;
  rows?: number;
  tagline?: string;
  badge?: string;
  id?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  tagline,
  badge,
  id,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onChange(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div id={id} className="bg-white border border-slate-200 rounded-xl p-4 transition-all hover:border-slate-300 shadow-2xs group">
      {/* Field Header */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-800 tracking-tight">{label}</span>
          {badge && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            {charCount} chars • {wordCount} words
          </span>

          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-xs flex items-center gap-1"
                title="Edit this section"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className={`p-1 px-2 rounded text-xs font-medium flex items-center gap-1 transition-all ${
                  copied
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Copy section to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleSave}
                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Check className="w-3 h-3" />
                <span>Done</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xs"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {tagline && <p className="text-[11px] text-slate-400 mb-2 italic">{tagline}</p>}

      {/* Field Content / Editor */}
      {isEditing ? (
        <div>
          {multiline ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={rows}
              className="w-full text-xs font-normal text-slate-800 p-2.5 rounded-lg border border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 bg-slate-50/50 leading-relaxed"
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full text-xs font-medium text-slate-800 p-2 rounded-lg border border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 bg-slate-50/50"
              autoFocus
            />
          )}
          <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
            <span>Press Done when finished editing</span>
            <span>{draft.length} chars</span>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="text-xs text-slate-800 leading-relaxed cursor-pointer rounded p-1 -m-1 hover:bg-slate-50/80 transition-colors"
          title="Click to edit"
        >
          {multiline ? (
            <div className="whitespace-pre-line space-y-2">{value}</div>
          ) : (
            <p className="font-medium text-slate-900">{value}</p>
          )}
        </div>
      )}
    </div>
  );
};
