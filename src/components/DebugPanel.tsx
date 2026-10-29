import React, { useState } from 'react';
import { Terminal, Copy, Check, X, Bug, Sparkles, AlertTriangle } from 'lucide-react';

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
  rawModelOutput?: string;
  modelUsed?: string;
  processedWithModel?: string;
  lastError?: string | null;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  isOpen,
  onClose,
  rawModelOutput,
  modelUsed,
  processedWithModel,
  lastError,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!rawModelOutput) return;
    try {
      await navigator.clipboard.writeText(rawModelOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-gray-950 text-gray-100 w-full max-w-3xl rounded-2xl border border-gray-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>Model Raw Output Debugger</span>
                {modelUsed && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {modelUsed}
                  </span>
                )}
                {processedWithModel && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                    {processedWithModel}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-gray-400">Verifying actual model responses without mock fallbacks</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {rawModelOutput && (
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Raw</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close debug modal"
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto font-mono text-xs space-y-4">
          {lastError && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200">
              <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Last Error:</span>
              </div>
              <p className="text-red-300 whitespace-pre-wrap">{lastError}</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1.5 text-gray-400 text-[11px]">
              <span className="flex items-center gap-1.5 uppercase font-semibold tracking-wider">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Raw Model String Output:
              </span>
              <span>{rawModelOutput ? `${rawModelOutput.length} characters` : 'No response yet'}</span>
            </div>

            {rawModelOutput ? (
              <pre className="p-4 rounded-xl bg-black/70 border border-gray-800/80 text-emerald-300 overflow-x-auto whitespace-pre-wrap text-[11px] leading-relaxed selection:bg-emerald-900 selection:text-white max-h-[380px]">
                {rawModelOutput}
              </pre>
            ) : (
              <div className="p-8 rounded-xl bg-black/40 border border-gray-800/60 text-center text-gray-500">
                <p>No model request has completed yet.</p>
                <p className="text-[11px] text-gray-600 mt-1">
                  Click "Explain Document" or ask a follow-up question to see the unedited raw model payload here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-800 bg-gray-900/60 flex items-center justify-between text-[11px] text-gray-400">
          <span>Gemma & Gemini Flash AI Studio Client</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
