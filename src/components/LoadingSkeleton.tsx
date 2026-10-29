import React from 'react';
import { Sparkles, FileSearch } from 'lucide-react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="mt-6 bg-white rounded-2xl shadow-sm border border-emerald-900/10 p-6 sm:p-8 animate-pulse">
      {/* Friendly Loading Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0B6B4F] flex items-center justify-center shrink-0">
            <FileSearch className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0B6B4F] flex items-center gap-2">
              <span>Document parh raha hun...</span>
              <span className="font-urdu-clean text-base">دستاویز پڑھی جا رہی ہے...</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Simplifying legal and technical wording into clear everyday language...
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-[#0B6B4F] text-xs font-semibold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          <span>Gemma & Gemini AI</span>
        </div>
      </div>

      {/* Summary Skeleton */}
      <div className="mt-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded-md w-1/4"></div>
        <div className="h-4 bg-emerald-50 rounded-md w-full"></div>
        <div className="h-4 bg-emerald-50 rounded-md w-5/6"></div>
      </div>

      {/* Details Grid Skeleton */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 space-y-2">
            <div className="h-3 bg-gray-200 rounded-md w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded-md w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Deadlines Skeleton */}
      <div className="mt-8 p-4 rounded-xl border border-amber-200/60 bg-amber-50/40 space-y-3">
        <div className="h-4 bg-amber-200/70 rounded-md w-1/4"></div>
        <div className="h-4 bg-amber-100 rounded-md w-3/4"></div>
      </div>

      {/* Next Steps Skeleton */}
      <div className="mt-8 space-y-2.5">
        <div className="h-4 bg-gray-200 rounded-md w-1/4 mb-3"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 shrink-0"></div>
            <div className="h-4 bg-gray-100 rounded-md w-4/5"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
