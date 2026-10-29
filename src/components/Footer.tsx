import React from 'react';
import { AlertCircle, Shield, Bug, Terminal } from 'lucide-react';

interface FooterProps {
  isDebugOpen: boolean;
  onToggleDebug: () => void;
  hasRawOutput: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDebugOpen, onToggleDebug, hasRawOutput }) => {
  return (
    <footer className="mt-16 border-t border-emerald-900/10 bg-white/80 py-8 text-gray-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
        {/* Persistent Legal & Health Disclaimer */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="text-xs leading-relaxed">
            <p className="font-semibold text-amber-900">
              Important Disclaimer / ضروری قانونی و طبی وضاحت:
            </p>
            <p className="mt-0.5 text-amber-800">
              Samajh is an AI helper, not a doctor, lawyer, or financial advisor. Please verify important matters with a professional.
              (سمجھ ایک اے آئی مددگار ہے، یہ کسی ڈاکٹر، وکیل یا مالیاتی مشیر کا متبادل نہیں ہے۔ اہم معاملات کی تصدیق متعلقہ ماہر سے ضرور کریں۔)
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#0B6B4F]">Samajh (سمجھ)</span>
            <span>•</span>
            <span>AI Document Explainer for Pakistan</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-800 font-medium hidden sm:inline-flex">
              <Shield className="w-3.5 h-3.5 text-[#0B6B4F]" />
              In-Memory Processing • No Server Storage
            </span>

            {/* Debug Toggle per requirement 6 */}
            <button
              type="button"
              onClick={onToggleDebug}
              aria-label="Toggle Debug mode to inspect raw model output"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition cursor-pointer ${
                isDebugOpen
                  ? 'bg-gray-900 text-white border-gray-900 shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>Debug</span>
              {hasRawOutput && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
