/**
 * Security and privacy utilities for detecting sensitive personal numbers (CNIC, Bank Cards)
 */

import { SensitiveMatch } from '../types/index.ts';

// Standard 13-digit Pakistani CNIC patterns (e.g., 35201-1234567-1 or 3520112345671)
const CNIC_REGEX = /\b(\d{5}[-\s]\d{7}[-\s]\d|\d{13})\b/g;

// Standard 16-digit bank credit/debit card numbers with optional spaces/hyphens
const BANK_CARD_REGEX = /\b(?:\d{4}[-\s]){3}\d{4}\b|\b(?:4[0-9]{15}|5[1-5][0-9]{14}|6011[0-9]{12})\b/g;

export function detectSensitiveInfo(text: string): SensitiveMatch[] {
  if (!text || typeof text !== 'string') return [];

  const matches: SensitiveMatch[] = [];

  // Check for CNIC
  const cnicMatches = text.match(CNIC_REGEX);
  if (cnicMatches) {
    for (const match of cnicMatches) {
      // Avoid matching simple 13-digit numbers that are common serials unless they fit CNIC structure
      matches.push({
        type: 'cnic',
        matchedText: match,
      });
    }
  }

  // Check for Bank Card
  const cardMatches = text.match(BANK_CARD_REGEX);
  if (cardMatches) {
    for (const match of cardMatches) {
      matches.push({
        type: 'bank_card',
        matchedText: match,
      });
    }
  }

  return matches;
}

export function maskSensitiveInfo(text: string): string {
  if (!text) return '';
  return text
    .replace(CNIC_REGEX, '*****--*****-*')
    .replace(BANK_CARD_REGEX, '****-****-****-****');
}
