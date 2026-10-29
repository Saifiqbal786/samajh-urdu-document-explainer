import React from 'react';
import { Sparkles, Globe, Filter, ArrowRight, Loader2 } from 'lucide-react';
import { OutputLanguage, DocumentTypeOption } from '../types/index.ts';

interface OptionsBarProps {
  targetLanguage: OutputLanguage;
  setTargetLanguage: (lang: OutputLanguage) => void;
  documentType: DocumentTypeOption;
  setDocumentType: (type: DocumentTypeOption) => void;
  onExplain: () => void;
  isLoading: boolean;
  canSubmit: boolean;
}

const DOCUMENT_CATEGORIES: { id: DocumentTypeOption; labelEn: string; labelUr: string }[] = [
  { id: 'auto', labelEn: 'Auto-detect', labelUr: 'خودکار شناخت' },
  { id: 'prescription', labelEn: 'Medical Prescription', labelUr: 'ڈاکٹر کا نسخہ' },
  { id: 'utility_bill', labelEn: 'Utility Bill', labelUr: 'بجلی / گیس بل' },
  { id: 'legal_notice', labelEn: 'Legal / Court Notice', labelUr: 'عدالتی نوٹس' },
  { id: 'bank_letter', labelEn: 'Bank Letter', labelUr: 'بینک کا خط' },
  { id: 'government_form', labelEn: 'Govt Form / Notice', labelUr: 'سرکاری فارم' },
  { id: 'school_fee', labelEn: 'School Fee Notice', labelUr: 'اسکول فیس نوٹس' },
  { id: 'other', labelEn: 'Other Document', labelUr: 'دیگر دستاویز' },
];

export const OptionsBar: React.FC<OptionsBarProps> = ({
  targetLanguage,
  setTargetLanguage,
  documentType,
  setDocumentType,
  onExplain,
  isLoading,
  canSubmit,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-900/10 p-4 sm:p-5 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Output Language Selector */}
        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#0B6B4F]" />
              Explain In Language:
            </span>
            <span className="font-urdu-clean text-[11px] text-emerald-800">وضاحتی زبان</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100/90 rounded-xl">
            <button
              type="button"
              onClick={() => setTargetLanguage('Urdu')}
              className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center gap-0.5 ${
                targetLanguage === 'Urdu'
                  ? 'bg-[#0B6B4F] text-white shadow-xs font-semibold'
                  : 'text-gray-700 hover:text-black hover:bg-white/60'
              }`}
            >
              <span className="font-urdu-clean text-xs sm:text-sm">اردو</span>
              <span className="text-[10px] opacity-80">(Urdu Script)</span>
            </button>

            <button
              type="button"
              onClick={() => setTargetLanguage('Roman Urdu')}
              className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center gap-0.5 ${
                targetLanguage === 'Roman Urdu'
                  ? 'bg-[#0B6B4F] text-white shadow-xs font-semibold'
                  : 'text-gray-700 hover:text-black hover:bg-white/60'
              }`}
            >
              <span className="font-semibold text-xs sm:text-sm">Roman</span>
              <span className="text-[10px] opacity-80">Urdu</span>
            </button>

            <button
              type="button"
              onClick={() => setTargetLanguage('English')}
              className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center gap-0.5 ${
                targetLanguage === 'English'
                  ? 'bg-[#0B6B4F] text-white shadow-xs font-semibold'
                  : 'text-gray-700 hover:text-black hover:bg-white/60'
              }`}
            >
              <span className="font-semibold text-xs sm:text-sm">English</span>
              <span className="text-[10px] opacity-80">Simple</span>
            </button>
          </div>
        </div>

        {/* Document Type Selector */}
        <div className="md:col-span-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#0B6B4F]" />
              Document Category:
            </span>
            <span className="font-urdu-clean text-[11px] text-emerald-800">دستاویز کی قسم</span>
          </label>
          <div className="relative">
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentTypeOption)}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-800 focus:border-[#0B6B4F] focus:ring-2 focus:ring-emerald-600/20 outline-none appearance-none cursor-pointer"
            >
              {DOCUMENT_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.labelEn} — {cat.labelUr}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Primary Explain Button */}
        <div className="md:col-span-4 flex flex-col justify-end">
          <button
            type="button"
            onClick={onExplain}
            disabled={!canSubmit || isLoading}
            className={`w-full py-3 px-5 rounded-xl font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 group ${
              canSubmit && !isLoading
                ? 'bg-[#0B6B4F] hover:bg-[#074B37] hover:shadow-lg shadow-emerald-900/20 cursor-pointer active:scale-[0.99]'
                : 'bg-gray-300 cursor-not-allowed text-gray-500 shadow-none'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Analyzing document...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-emerald-200 group-hover:rotate-12 transition-transform" />
                <div className="flex flex-col items-center">
                  <span className="text-sm sm:text-base leading-tight">Explain Document</span>
                  <span className="font-urdu-clean text-[11px] text-emerald-100 font-normal leading-tight">
                    دستاویز سمجھیں
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-200 ml-1 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
