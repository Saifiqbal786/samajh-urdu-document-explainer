import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  Copy,
  Share2,
  Check,
  AlertTriangle,
  Calendar,
  CreditCard,
  HelpCircle,
  ListOrdered,
  Sparkles,
  Info,
  Printer,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { ExplanationResult } from '../types/index.ts';
import { speechService } from '../utils/speech.ts';

interface ResultCardProps {
  result: ExplanationResult;
  onAskQuestion?: (prefill?: string) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onAskQuestion }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const isUrdu = result.targetLanguage === 'Urdu';
  const isRoman = result.targetLanguage === 'Roman Urdu';

  // Stop speech when component unmounts or result changes
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, [result.id]);

  const handleToggleSpeech = () => {
    setSpeechError(null);
    if (isSpeaking) {
      if (isPaused) {
        speechService.resume();
        setIsPaused(false);
      } else {
        speechService.pause();
        setIsPaused(true);
      }
    } else {
      const speechText = speechService.prepareSpeechText(result);
      setIsSpeaking(true);
      setIsPaused(false);
      speechService.speak(
        speechText,
        result.targetLanguage,
        () => {
          setIsSpeaking(true);
          setIsPaused(false);
        },
        () => {
          setIsSpeaking(false);
          setIsPaused(false);
        },
        (err) => {
          setIsSpeaking(false);
          setIsPaused(false);
          setSpeechError('Could not play speech synthesis on this device.');
        }
      );
    }
  };

  const handleStopSpeech = () => {
    speechService.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleCopy = async () => {
    const textToCopy = `[Samajh - AI Document Explainer]
Document: ${result.documentType}
Summary: ${result.summary}

KEY DETAILS:
${result.keyDetails.map((k) => `• ${k.label}: ${k.value}`).join('\n')}

DEADLINES & AMOUNTS:
${result.deadlines.map((d) => `• ${d.what}: ${d.date} ${d.amount ? `(${d.amount})` : ''}`).join('\n')}

WHAT TO DO NEXT:
${result.nextSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

${result.warnings.length ? `WARNINGS:\n${result.warnings.map((w) => `! ${w}`).join('\n')}` : ''}
`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Samajh: ${result.documentType}`,
      text: `${result.documentType}\n${result.summary}\n\nExplained by Samajh: Apni zaban mein samjhein.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="mt-6 bg-white rounded-2xl shadow-sm border border-emerald-900/15 overflow-hidden transition-all"
      data-testid="explanation-result-card"
    >
      {/* Top Banner & Control Bar */}
      <div className="bg-gradient-to-r from-[#0B6B4F] to-[#08523C] text-white p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 backdrop-blur-xs">
              <FileCheck2 className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Detected Document / شناخت شدہ قسم
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className={`text-xl sm:text-2xl font-bold text-white ${isUrdu ? 'font-urdu-clean' : ''}`}>
                  {result.documentType}
                </h2>
                {result.processedWithModel && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-100 bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20">
                    <Sparkles className="w-3 h-3 text-emerald-300" />
                    processed with Gemini Flash
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons (Listen, Copy, Share) */}
          <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
            {/* Listen Button */}
            <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/20">
              <button
                type="button"
                onClick={handleToggleSpeech}
                aria-label={isSpeaking ? (isPaused ? 'Resume speech' : 'Pause speech') : 'Listen to explanation'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white hover:bg-white/20 transition active:scale-95"
              >
                {isSpeaking ? (
                  isPaused ? (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5 text-amber-300" />
                      <span>Pause</span>
                    </>
                  )
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-300" />
                    <span>Listen / سنیں</span>
                  </>
                )}
              </button>

              {isSpeaking && (
                <button
                  type="button"
                  onClick={handleStopSpeech}
                  title="Stop audio"
                  aria-label="Stop audio"
                  className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 ml-1"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy explanation"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied! / کاپی ہو گیا</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Copy / کاپی</span>
                </>
              )}
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share explanation"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition active:scale-95"
            >
              {shared ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Shared!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Share / شیئر</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audio Active Indicator */}
        {isSpeaking && !isPaused && (
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-100 bg-white/10 px-3 py-1.5 rounded-lg animate-pulse">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span>Aawaz parhi ja rahi hai (Playing audio narration)...</span>
          </div>
        )}
      </div>

      {speechError && (
        <div className="px-5 py-2 bg-amber-50 text-amber-800 text-xs flex items-center gap-2 border-b border-amber-200">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`p-5 sm:p-7 space-y-7 ${isUrdu ? 'rtl text-right' : 'ltr text-left'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
        
        {/* Section 1: Summary */}
        <section className="bg-emerald-50/60 rounded-2xl p-4 sm:p-5 border border-emerald-900/10">
          <div className="flex items-center gap-2 mb-2 text-[#0B6B4F]">
            <Info className="w-4 h-4 shrink-0" />
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isUrdu ? 'font-urdu-clean text-base' : ''}`}>
              {isUrdu ? 'آسان خلاصہ (Summary)' : isRoman ? 'Aasan Khulasa (Summary)' : 'Simple Summary'}
            </h3>
          </div>
          <p
            className={`text-gray-900 text-base sm:text-lg font-medium leading-relaxed ${
              isUrdu ? 'font-urdu text-lg sm:text-xl text-emerald-950' : 'text-gray-800'
            }`}
          >
            {result.summary}
          </p>
        </section>

        {/* Section 2: Deadlines and Amounts Due (Highlighted) */}
        {result.deadlines && result.deadlines.length > 0 && (
          <section className="bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-50/80 rounded-2xl p-4 sm:p-5 border-2 border-amber-300/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-amber-900">
              <Calendar className="w-5 h-5 text-amber-700 shrink-0" />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isUrdu ? 'font-urdu-clean text-base' : ''}`}>
                {isUrdu ? 'اہم تاریخ اور واجب الادا رقم (Deadlines & Due Amounts)' : isRoman ? 'Aham Tareekh aur Raqam (Deadlines)' : 'Important Deadlines & Amounts'}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.deadlines.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/95 rounded-xl p-3.5 border border-amber-300 flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <span className={`font-semibold text-gray-900 text-sm ${isUrdu ? 'font-urdu-clean text-base' : ''}`}>
                      {item.what}
                    </span>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-800 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-700" />
                      <span>Date: <strong>{item.date}</strong></span>
                    </div>
                  </div>
                  {item.amount && (
                    <div className="mt-2.5 pt-2 border-t border-amber-100 flex items-center justify-between">
                      <span className="text-xs text-gray-600">Amount Due:</span>
                      <span className="text-sm sm:text-base font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        {item.amount}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: Key Details */}
        {result.keyDetails && result.keyDetails.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3 text-gray-800">
              <CreditCard className="w-4 h-4 text-[#0B6B4F] shrink-0" />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isUrdu ? 'font-urdu-clean text-base' : ''}`}>
                {isUrdu ? 'اہم معلومات (Key Details)' : isRoman ? 'Aham Maloomat (Key Details)' : 'Key Details'}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {result.keyDetails.map((detail, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50/80 rounded-xl p-3 border border-gray-200 hover:border-emerald-300 transition-colors"
                >
                  <span className={`block text-[11px] font-semibold text-gray-500 uppercase tracking-wider ${isUrdu ? 'font-urdu-clean text-xs' : ''}`}>
                    {detail.label}
                  </span>
                  <span className={`block mt-0.5 text-sm sm:text-base font-bold text-gray-900 break-words ${isUrdu ? 'font-urdu-clean' : ''}`}>
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 4: What You Should Do Next (Numbered Steps) */}
        {result.nextSteps && result.nextSteps.length > 0 && (
          <section className="bg-emerald-50/40 rounded-2xl p-4 sm:p-5 border border-emerald-900/10">
            <div className="flex items-center gap-2 mb-3 text-[#0B6B4F]">
              <ListOrdered className="w-4 h-4 shrink-0" />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isUrdu ? 'font-urdu-clean text-base' : ''}`}>
                {isUrdu ? 'اب آپ کو کیا کرنا ہے (What you should do next)' : isRoman ? 'Ab Aap Ko Kya Karna Hai (Next Steps)' : 'What You Should Do Next'}
              </h3>
            </div>
            <ol className="space-y-2.5">
              {result.nextSteps.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs"
                >
                  <span className="w-6 h-6 rounded-full bg-[#0B6B4F] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className={`text-sm sm:text-base font-medium text-gray-800 ${isUrdu ? 'font-urdu text-base sm:text-lg leading-loose' : ''}`}>
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Section 5: Difficult Terms Explained */}
        {result.difficultTerms && result.difficultTerms.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3 text-gray-800">
              <HelpCircle className="w-4 h-4 text-[#0B6B4F] shrink-0" />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isUrdu ? 'font-urdu-clean text-base' : ''}`}>
                {isUrdu ? 'مشکل الفاظ کا آسان مطلب (Difficult Terms Explained)' : isRoman ? 'Mushkil Alfaz Ka Matlab (Difficult Terms)' : 'Difficult Terms Explained in Plain Language'}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.difficultTerms.map((termItem, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50/70 rounded-xl p-3.5 border border-gray-200"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100/60 px-2 py-0.5 rounded-md inline-block">
                    <span>{termItem.term}</span>
                  </div>
                  <p className={`mt-2 text-xs sm:text-sm text-gray-700 font-medium ${isUrdu ? 'font-urdu text-sm sm:text-base' : ''}`}>
                    {termItem.meaning}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 6: Warnings and Risks */}
        {result.warnings && result.warnings.length > 0 && (
          <section className="bg-red-50/70 rounded-2xl p-4 sm:p-5 border border-red-300">
            <div className="flex items-center gap-2 mb-2 text-red-900">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isUrdu ? 'font-urdu-clean text-base' : ''}`}>
                {isUrdu ? 'ضروری تنبیہ اور خطرات (Important Warnings)' : isRoman ? 'Zaroori Tanbih (Warnings & Risks)' : 'Important Warnings & Risks'}
              </h3>
            </div>
            <ul className="space-y-2">
              {result.warnings.map((warn, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-red-950"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1.5"></span>
                  <span className={isUrdu ? 'font-urdu text-sm sm:text-base leading-loose' : ''}>
                    {warn}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
};
