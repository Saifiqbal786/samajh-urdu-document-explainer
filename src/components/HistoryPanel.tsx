import React from 'react';
import { History, Trash2, X, Clock, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { ExplanationResult } from '../types/index.ts';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: ExplanationResult[];
  onSelectHistory: (item: ExplanationResult) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-gray-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0B6B4F] text-white flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">Explanation History</h3>
              <p className="text-[11px] text-gray-500">Last 5 analyzed documents</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close history drawer"
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Privacy Warning Note */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#0B6B4F] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-950">Local Device Storage</p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Your past explanations are stored only on this browser device. They are not uploaded to any external database or cloud storage.
              </p>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="py-12 text-center text-gray-500 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-gray-300" />
              <p className="text-sm font-medium">No explanations saved yet.</p>
              <p className="text-xs text-gray-400">
                Explain a bill, prescription, or notice to see it here.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const dateStr = new Date(item.timestamp).toLocaleString('en-PK', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectHistory(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-[#0B6B4F] bg-gray-50/50 hover:bg-emerald-50/30 transition-all cursor-pointer group flex flex-col justify-between gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-[#0B6B4F] line-clamp-1">
                      {item.documentType}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                      {item.targetLanguage}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2">
                    {item.summary}
                  </p>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                    <span>{dateStr}</span>
                    <span className="text-[#0B6B4F] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      View / کھولیں <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Clear all explanation history on this device?')) {
                  onClearHistory();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History / تاریخ صاف کریں
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
