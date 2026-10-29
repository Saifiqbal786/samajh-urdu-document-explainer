import React, { useRef, useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  AlertTriangle,
  ShieldAlert,
  Zap,
  Pill,
  Scale,
  Landmark,
  Camera,
  Check,
  Eye,
  Info
} from 'lucide-react';
import { SAMPLE_DOCUMENTS, SampleDoc } from '../data/sampleDocuments.ts';
import { detectSensitiveInfo } from '../utils/security.ts';
import { SensitiveMatch, DocumentTypeOption } from '../types/index.ts';

interface UploadPanelProps {
  documentText: string;
  setDocumentText: (val: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  imageBase64: string | null;
  setImageBase64: (val: string | null) => void;
  onSelectSampleCategory?: (category: DocumentTypeOption) => void;
  selectedSampleId: string | null;
  setSelectedSampleId: (id: string | null) => void;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({
  documentText,
  setDocumentText,
  imageFile,
  setImageFile,
  imageBase64,
  setImageBase64,
  onSelectSampleCategory,
  selectedSampleId,
  setSelectedSampleId,
}) => {
  const [activeTab, setActiveTab] = useState<'both' | 'text' | 'image'>('both');
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [sensitiveMatches, setSensitiveMatches] = useState<SensitiveMatch[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Check for sensitive CNIC or bank card patterns whenever pasted text changes
  useEffect(() => {
    if (documentText) {
      const matches = detectSensitiveInfo(documentText);
      setSensitiveMatches(matches);
    } else {
      setSensitiveMatches([]);
    }
  }, [documentText]);

  const handleFileProcess = (file: File) => {
    setFileError(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setFileError('Please upload a JPG, PNG, or WEBP image file.');
      return;
    }

    // Validate size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds 5 MB. Please upload a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageBase64(result);
      setImageFile(file);
      setSelectedSampleId(null);
    };
    reader.onerror = () => {
      setFileError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImageBase64(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleLoadSample = (sample: SampleDoc) => {
    setDocumentText(sample.text);
    clearImage();
    setSelectedSampleId(sample.id);
    if (onSelectSampleCategory) {
      onSelectSampleCategory(sample.category as DocumentTypeOption);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-900/10 p-4 sm:p-6 transition-all">
      {/* Sample Document Quick Pills */}
      <div className="mb-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <label className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0B6B4F]"></span>
            <span>Try an example</span>
            <span className="text-gray-400 font-normal">/ مثال آزمائیں:</span>
          </label>
          <span className="text-[11px] text-gray-500 hidden sm:inline">Click to test instantly without uploading</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_DOCUMENTS.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between gap-1 group ${
                  isSelected
                    ? 'border-[#0B6B4F] bg-emerald-50/80 shadow-xs ring-1 ring-[#0B6B4F]'
                    : 'border-gray-200 bg-gray-50/60 hover:bg-emerald-50/40 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-gray-800 group-hover:text-[#0B6B4F] truncate">
                    {sample.title}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#0B6B4F] shrink-0" />}
                </div>
                <span className="text-[10px] text-emerald-800 font-urdu-clean truncate">{sample.titleUrdu}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sensitive Data Warning Banner */}
      {sensitiveMatches.length > 0 && (
        <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 text-xs sm:text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-950 flex items-center gap-1">
              <span>Privacy Alert: Possible CNIC or Bank Card detected</span>
              <span className="font-urdu-clean text-xs">/ شناختی کارڈ یا بینک کارڈ کا نمبر</span>
            </p>
            <p className="mt-1 text-amber-800 text-xs">
              For your safety, do <strong>not</strong> paste real CNIC numbers or bank card details. Please remove or replace digits with 'X' before proceeding.
            </p>
          </div>
        </div>
      )}

      {/* Input Options Layout (Image Upload + Paste Text) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Image Upload */}
        <div className="flex flex-col">
          <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#0B6B4F]" />
              Upload Document Photo
            </span>
            <span className="text-[11px] font-normal text-emerald-800 font-urdu-clean">تصویر اپلوڈ کریں</span>
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            id="document-file-input"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
            id="document-camera-input"
          />

          {!imageBase64 ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`flex-1 min-h-[190px] border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                isDragging
                  ? 'border-[#0B6B4F] bg-emerald-50'
                  : 'border-gray-300 hover:border-emerald-500 bg-gray-50/50 hover:bg-emerald-50/20'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#0B6B4F] flex items-center justify-center mb-2 shadow-xs">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-700">
                Drag & drop or <span className="text-[#0B6B4F] underline font-semibold">browse photo</span>
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                JPG, PNG, WEBP (Max 5 MB)
              </p>

              {/* Mobile Camera Option */}
              <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-700 font-medium hover:bg-emerald-50 hover:text-[#0B6B4F] shadow-2xs"
                >
                  <Camera className="w-3.5 h-3.5 text-[#0B6B4F]" />
                  Take Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-[190px] border border-emerald-200 rounded-xl p-3 bg-emerald-50/40 flex flex-col justify-between">
              <div className="relative rounded-lg overflow-hidden border border-emerald-300 bg-black/5 aspect-video sm:aspect-auto sm:h-36 flex items-center justify-center">
                <img
                  src={imageBase64}
                  alt="Uploaded document preview"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  aria-label="Remove uploaded image"
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                <span className="truncate max-w-[200px] font-medium text-emerald-900">
                  {imageFile?.name || 'Uploaded photo'}
                </span>
                <button
                  type="button"
                  onClick={clearImage}
                  className="text-red-600 hover:text-red-700 font-medium text-xs underline"
                >
                  Remove / ہٹائیں
                </button>
              </div>
            </div>
          )}

          {fileError && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {fileError}
            </p>
          )}
        </div>

        {/* Right Column: Paste Text */}
        <div className="flex flex-col">
          <label className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#0B6B4F]" />
              Paste Document Text
            </span>
            <span className="text-[11px] font-normal text-emerald-800 font-urdu-clean">متن یہاں لکھیں یا پیسٹ کریں</span>
          </label>
          <div className="flex-1 flex flex-col">
            <textarea
              value={documentText}
              onChange={(e) => {
                setDocumentText(e.target.value);
                if (selectedSampleId) setSelectedSampleId(null);
              }}
              placeholder="Paste prescription, utility bill lines, court notice, or letter text here... (مثال: بجلی کا بل، ڈاکٹر کا نسخہ، یا عدالتی سمن)"
              rows={7}
              className="w-full flex-1 p-3 text-xs sm:text-sm rounded-xl border border-gray-300 focus:border-[#0B6B4F] focus:ring-2 focus:ring-emerald-600/20 outline-none resize-none bg-white text-gray-800 placeholder-gray-400 font-sans"
            />
            {documentText && (
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-gray-500">
                <span>{documentText.length} characters</span>
                <button
                  type="button"
                  onClick={() => {
                    setDocumentText('');
                    setSelectedSampleId(null);
                  }}
                  className="text-gray-500 hover:text-red-600 underline font-medium"
                >
                  Clear text / مٹائیں
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-[11px] text-gray-500">
        <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span>
          <strong>Privacy Guaranteed:</strong> Documents are processed in-memory for explanation and never stored on any external database.
        </span>
      </div>
    </div>
  );
};
