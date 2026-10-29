/**
 * Client-side AI service that proxies all calls through the server-side /api routes.
 * Never exposes API keys in client code.
 */

import { ExplanationResult, OutputLanguage } from '../types/index.ts';

export interface ExplainDocumentParams {
  text?: string;
  imageBase64?: string;
  mimeType?: string;
  targetLanguage: OutputLanguage;
  documentTypeHint?: string;
}

export async function explainDocument(params: ExplainDocumentParams): Promise<ExplanationResult> {
  try {
    const response = await fetch('/api/explain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    // Console log the raw model response per requirement 2
    console.log('[Samajh AI] Raw model response:', data.rawModelOutput || data);
    if (data.modelUsed) {
      console.log('[Samajh AI] Model used:', data.modelUsed);
    }

    if (!response.ok) {
      const errorMsg = data.error || 'Failed to explain document. Please try again.';
      const err = new Error(errorMsg);
      (err as any).rawModelOutput = data.rawModelOutput;
      throw err;
    }

    return data as ExplanationResult;
  } catch (error: any) {
    // Console log any caught error per requirement 2
    console.error('[Samajh AI] Caught error in explainDocument:', error);
    throw error;
  }
}

export async function askFollowUpQuestion(params: {
  documentContext: string;
  userQuestion: string;
  targetLanguage: OutputLanguage;
}): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    console.log('[Samajh AI Chat] Raw model response:', data.rawModelOutput || data);

    if (!response.ok) {
      throw new Error(data.error || 'Failed to answer question. Please try again.');
    }

    return data.answer || '';
  } catch (error: any) {
    console.error('[Samajh AI Chat] Caught error in askFollowUpQuestion:', error);
    throw error;
  }
}

export async function checkServerHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch (err) {
    console.error('[Samajh AI] Health check error:', err);
    return { status: 'error', hasApiKey: false };
  }
}
