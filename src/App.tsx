/**
 * Samajh - AI Document Explainer for Pakistan
 * Main Application Component
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { UploadPanel } from './components/UploadPanel.tsx';
import { OptionsBar } from './components/OptionsBar.tsx';
import { ResultCard } from './components/ResultCard.tsx';
import { LoadingSkeleton } from './components/LoadingSkeleton.tsx';
import { FollowUpChat } from './components/FollowUpChat.tsx';
import { HistoryPanel } from './components/HistoryPanel.tsx';
import { DebugPanel } from './components/DebugPanel.tsx';
import { Footer } from './components/Footer.tsx';
import { OutputLanguage, DocumentTypeOption, ExplanationResult } from './types/index.ts';
import { explainDocument } from './services/ai.ts';
import { AlertCircle, RefreshCw, Terminal, Bug } from 'lucide-react';

const STORAGE_KEY = 'samajh_explanations_v1';

export default function App() {
  const [documentText, setDocumentText] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<OutputLanguage>('Urdu');
  const [documentType, setDocumentType] = useState<DocumentTypeOption>('auto');
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [result, setResult] = useState<ExplanationResult | null>(null);

  // Raw debug state per requirement 6
  const [rawModelOutput, setRawModelOutput] = useState<string | undefined>(undefined);
  const [modelUsed, setModelUsed] = useState<string | undefined>(undefined);
  const [isDebugOpen, setIsDebugOpen] = useState<boolean>(false);

  const [history, setHistory] = useState<ExplanationResult[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const resultRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, 5));
        }
      }
    } catch (e) {
      console.warn('Could not read explanation history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newResult: ExplanationResult) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== newResult.id);
      const updated = [newResult, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      // ignore
    }
  };

  const handleExplain = async () => {
    setValidationError(null);
    setErrorMessage(null);

    // Validation
    if (!documentText.trim() && !imageBase64) {
      setValidationError('Please upload a document image or paste text to explain / براہ کرم تصویر اپلوڈ کریں یا متن لکھیں۔');
      return;
    }

    setIsLoading(true);

    try {
      const res = await explainDocument({
        text: documentText.trim() || undefined,
        imageBase64: imageBase64 || undefined,
        mimeType: imageFile?.type || 'image/jpeg',
        targetLanguage,
        documentTypeHint: documentType !== 'auto' ? documentType : undefined,
      });

      // Update state with actual AI response
      setResult(res);
      setRawModelOutput(res.rawModelOutput);
      setModelUsed(res.modelUsed);
      saveToHistory(res);

      // Smooth scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('[Samajh] Explanation failed:', err);
      // Requirement 1: Show visible error message with real error text and a Retry button. Never show a fake summary.
      setResult(null);
      setErrorMessage(
        err.message || 'We encountered an error while analyzing this document. Please check your connection or retry.'
      );
      if (err.rawModelOutput) {
        setRawModelOutput(err.rawModelOutput);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: ExplanationResult) => {
    setResult(item);
    setTargetLanguage(item.targetLanguage);
    setRawModelOutput(item.rawModelOutput);
    setModelUsed(item.modelUsed);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const canSubmit = Boolean(documentText.trim() || imageBase64);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6 pb-12">
        {/* Intro Tagline & Quick Purpose */}
        <div className="mb-6 text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Simplify Pakistani Documents in Plain Language
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Prescriptions, utility bills, legal notices, bank letters, and government forms explained warmly in Urdu, Roman Urdu, or simple English.
          </p>
        </div>

        {/* Input Panel */}
        <UploadPanel
          documentText={documentText}
          setDocumentText={setDocumentText}
          imageFile={imageFile}
          setImageFile={setImageFile}
          imageBase64={imageBase64}
          setImageBase64={setImageBase64}
          onSelectSampleCategory={(category) => setDocumentType(category)}
          selectedSampleId={selectedSampleId}
          setSelectedSampleId={setSelectedSampleId}
        />

        {/* Options Bar & Explain Button */}
        <OptionsBar
          targetLanguage={targetLanguage}
          setTargetLanguage={setTargetLanguage}
          documentType={documentType}
          setDocumentType={setDocumentType}
          onExplain={handleExplain}
          isLoading={isLoading}
          canSubmit={canSubmit}
        />

        {/* Validation Error Message */}
        {validationError && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Visible Error State with Real Error Text and Retry Button (Requirement 1) */}
        {errorMessage && !isLoading && (
          <div className="mt-6 p-5 rounded-2xl bg-red-50 border-2 border-red-300 text-red-950 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0 text-red-700 mt-0.5">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-red-900">
                    Analysis Error / تجزیہ کے دوران خرابی
                  </h4>
                  <p className="text-xs sm:text-sm text-red-800 mt-1 font-mono break-words bg-white/70 p-2.5 rounded-lg border border-red-200">
                    {errorMessage}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {rawModelOutput && (
                  <button
                    type="button"
                    onClick={() => setIsDebugOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-red-300 text-red-800 font-medium text-xs hover:bg-red-100/50 transition cursor-pointer"
                  >
                    <Bug className="w-3.5 h-3.5" />
                    <span>View Debug</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleExplain}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Retry / دوبارہ کوشش کریں</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && <LoadingSkeleton />}

        {/* Structured Result Display */}
        {result && !isLoading && (
          <div ref={resultRef}>
            <ResultCard result={result} />
            <FollowUpChat result={result} targetLanguage={targetLanguage} />
          </div>
        )}
      </main>

      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistoryItem}
        onClearHistory={handleClearHistory}
      />

      {/* Debug Modal Toggleable from Footer */}
      <DebugPanel
        isOpen={isDebugOpen}
        onClose={() => setIsDebugOpen(false)}
        rawModelOutput={rawModelOutput || result?.rawModelOutput}
        modelUsed={modelUsed || result?.modelUsed}
        processedWithModel={result?.processedWithModel}
        lastError={errorMessage}
      />

      <Footer
        isDebugOpen={isDebugOpen}
        onToggleDebug={() => setIsDebugOpen(!isDebugOpen)}
        hasRawOutput={Boolean(rawModelOutput || result?.rawModelOutput)}
      />
    </div>
  );
}
