import React from 'react';
import { BookOpen, Sparkles, History, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ historyCount, onOpenHistory }) => {
  return (
    <header className="border-b border-emerald-900/10 bg-white/95 backdrop-blur-sm sticky top-0 z-30 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#0B6B4F] flex items-center justify-center text-white shadow-md shadow-emerald-900/15 ring-2 ring-emerald-600/20">
              <BookOpen className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#0B6B4F] flex items-center gap-1.5">
                  Samajh
                  <span className="text-xl font-normal text-emerald-700/80 font-urdu-clean">سمجھ</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-[#0B6B4F] border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  Pakistan
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium">
                <span>Apni zaban mein samjhein</span>
                <span className="hidden sm:inline text-gray-300"> • </span>
                <span className="hidden sm:inline font-urdu-clean text-emerald-800">اپنی زبان میں سمجھیں</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenHistory}
              aria-label={`View explanation history, ${historyCount} saved`}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-gray-700 hover:text-[#0B6B4F] hover:bg-emerald-50 transition border border-gray-200"
            >
              <History className="w-4 h-4 text-[#0B6B4F]" />
              <span className="hidden xs:inline">History</span>
              {historyCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold rounded-full bg-[#0B6B4F] text-white">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3-Step "How it works" Strip */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 hidden sm:flex items-center justify-between text-xs text-gray-600 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0B6B4F] font-bold flex items-center justify-center text-[11px]">1</span>
            <span><strong>Upload or Paste</strong> / تصویر یا متن لگائیں</span>
          </div>
          <span className="text-gray-300">→</span>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0B6B4F] font-bold flex items-center justify-center text-[11px]">2</span>
            <span><strong>Select Language</strong> / زبان منتخب کریں</span>
          </div>
          <span className="text-gray-300">→</span>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#0B6B4F] font-bold flex items-center justify-center text-[11px]">3</span>
            <span><strong>Get Simple Explanation & Audio</strong> / آسان وضاحت سنیں</span>
          </div>
        </div>
      </div>
    </header>
  );
};
