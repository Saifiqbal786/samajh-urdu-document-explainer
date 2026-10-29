export type OutputLanguage = 'Urdu' | 'Roman Urdu' | 'English';

export type DocumentTypeOption =
  | 'auto'
  | 'prescription'
  | 'utility_bill'
  | 'legal_notice'
  | 'bank_letter'
  | 'government_form'
  | 'school_fee'
  | 'other';

export interface KeyDetail {
  label: string;
  value: string;
}

export interface DeadlineItem {
  what: string;
  date: string;
  amount?: string;
}

export interface DifficultTerm {
  term: string;
  meaning: string;
}

export interface ExplanationResult {
  id: string;
  timestamp: number;
  documentType: string;
  summary: string;
  keyDetails: KeyDetail[];
  deadlines: DeadlineItem[];
  difficultTerms: DifficultTerm[];
  nextSteps: string[];
  warnings: string[];
  targetLanguage: OutputLanguage;
  inputSnippet: string;
  hasImage?: boolean;
  processedWithModel?: string;
  modelUsed?: string;
  rawModelOutput?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

export interface SensitiveMatch {
  type: 'cnic' | 'bank_card';
  matchedText: string;
}
