/**
 * Robust JSON extraction and validation for model responses
 */

import { ExplanationResult, OutputLanguage } from '../types/index.ts';

export function parseExplanationResponse(
  rawText: string,
  targetLanguage: OutputLanguage = 'Urdu',
  inputSnippet: string = '',
  hasImage: boolean = false,
  modelUsed?: string
): ExplanationResult {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    throw new Error('Empty response received from the AI model.');
  }

  // 1. Strip markdown code fences if present (```json ... ``` or ``` ...)
  let cleaned = rawText.trim();
  const jsonFenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonFenceMatch && jsonFenceMatch[1]) {
    cleaned = jsonFenceMatch[1].trim();
  }

  // 2. Extract content between first "{" and last "}"
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error(`Model response did not contain a valid JSON object. Raw response snippet: "${rawText.slice(0, 150)}..."`);
  }

  const jsonSubstring = cleaned.slice(firstBrace, lastBrace + 1);

  let parsed: any;
  try {
    parsed = JSON.parse(jsonSubstring);
  } catch (err: any) {
    throw new Error(`Failed to parse JSON from AI model response (${err?.message || 'Syntax error'}). Raw snippet: "${jsonSubstring.slice(0, 150)}..."`);
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('AI response was not a valid object structure.');
  }

  // Validate presence of core fields
  if (!parsed.documentType || !parsed.summary) {
    throw new Error('AI response missing required documentType or summary fields.');
  }

  const documentType = String(parsed.documentType).trim();
  const summary = String(parsed.summary).trim();

  const keyDetails = Array.isArray(parsed.keyDetails)
    ? parsed.keyDetails
        .filter((item: any) => item && (item.label || item.value))
        .map((item: any) => ({
          label: String(item.label || '').trim(),
          value: String(item.value || '').trim(),
        }))
    : [];

  const deadlines = Array.isArray(parsed.deadlines)
    ? parsed.deadlines
        .filter((item: any) => item && (item.what || item.date || item.amount))
        .map((item: any) => ({
          what: String(item.what || '').trim(),
          date: String(item.date || '').trim(),
          amount: item.amount ? String(item.amount).trim() : undefined,
        }))
    : [];

  const difficultTerms = Array.isArray(parsed.difficultTerms)
    ? parsed.difficultTerms
        .filter((item: any) => item && (item.term || item.meaning))
        .map((item: any) => ({
          term: String(item.term || '').trim(),
          meaning: String(item.meaning || '').trim(),
        }))
    : [];

  const nextSteps = Array.isArray(parsed.nextSteps)
    ? parsed.nextSteps.map((s: any) => String(s).trim()).filter(Boolean)
    : [];

  const warnings = Array.isArray(parsed.warnings)
    ? parsed.warnings.map((w: any) => String(w).trim()).filter(Boolean)
    : [];

  return {
    id: 'exp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    timestamp: Date.now(),
    documentType,
    summary,
    keyDetails,
    deadlines,
    difficultTerms,
    nextSteps,
    warnings,
    targetLanguage,
    inputSnippet: inputSnippet.slice(0, 160),
    hasImage,
    modelUsed,
    rawModelOutput: rawText,
  };
}
