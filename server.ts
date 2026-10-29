/**
 * Full-stack Express server for Samajh
 * Handles server-side Gemini API / Gemma calls and mounts Vite middleware in development.
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { buildExplanationPrompt, buildFollowUpChatPrompt } from './src/prompts/documentExplainer.ts';
import { parseExplanationResponse } from './src/utils/parser.ts';
import { OutputLanguage } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Increase JSON payload limit for base64 image uploads (up to 15MB)
app.use(express.json({ limit: '15mb' }));

// Shared Gemini SDK client instance
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Primary Gemma model per user brief
const GEMMA_MODEL = 'gemma-4-26b-a4b-it';
// Fallback Gemini Flash models
const GEMINI_FLASH_MODEL = 'gemini-flash-latest';
const GEMINI_FLASH_BACKUP = 'gemini-3.5-flash-lite';

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    primaryModel: GEMMA_MODEL,
    fallbackModel: GEMINI_FLASH_MODEL,
  });
});

/**
 * Helper to call Gemma with a timeout to prevent long delays
 */
async function callGemmaWithTimeout(contents: any, timeoutMs = 6000): Promise<{ text: string; model: string }> {
  const gemmaPromise = ai.models.generateContent({
    model: GEMMA_MODEL,
    contents,
  }).then(res => ({ text: res.text || '', model: GEMMA_MODEL }));

  const timeoutPromise = new Promise<{ text: string; model: string }>((_, reject) =>
    setTimeout(() => reject(new Error('Gemma call timed out after 6 seconds')), timeoutMs)
  );

  return Promise.race([gemmaPromise, timeoutPromise]);
}

/**
 * Helper to call Gemini Flash with backup failover
 */
async function callGeminiFlash(contents: any): Promise<{ text: string; model: string }> {
  try {
    const res = await ai.models.generateContent({
      model: GEMINI_FLASH_MODEL,
      contents,
    });
    return { text: res.text || '', model: GEMINI_FLASH_MODEL };
  } catch (err: any) {
    console.warn(`[Server AI] ${GEMINI_FLASH_MODEL} failed, attempting ${GEMINI_FLASH_BACKUP}:`, err?.message);
    const backupRes = await ai.models.generateContent({
      model: GEMINI_FLASH_BACKUP,
      contents,
    });
    return { text: backupRes.text || '', model: GEMINI_FLASH_BACKUP };
  }
}

/**
 * POST /api/explain
 * Explains a Pakistani document using Gemma, automatically retrying with Gemini Flash if rejected.
 * Never returns mock or default results.
 */
app.post('/api/explain', async (req: Request, res: Response) => {
  let rawModelText = '';
  let modelUsed = '';
  let processedWithModel: string | undefined;

  try {
    const {
      text,
      imageBase64,
      mimeType = 'image/jpeg',
      targetLanguage = 'Urdu',
      documentTypeHint = 'auto',
    } = req.body;

    if (!text && !imageBase64) {
      return res.status(400).json({
        error: 'Please provide either document text or an image file to explain.',
      });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the environment. Please configure your API key in the Secrets panel.',
      });
    }

    // Build the full instruction prompt where all rules are in the user message
    // (Gemma models do not support systemInstruction or responseMimeType/JSON mode)
    const promptText = buildExplanationPrompt({
      targetLanguage: targetLanguage as OutputLanguage,
      documentTypeHint,
      extractedText: text || undefined,
    });

    if (imageBase64) {
      const cleanedBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      const userContents = {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || 'image/jpeg',
              data: cleanedBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      };

      // 5. For image input, send the image as inlineData in the same user message as instructions.
      // If the Gemma model rejects the image, automatically retry that request with gemini-flash-latest
      // and show a small "processed with Gemini Flash" note.
      try {
        console.log(`[Server AI] Attempting image explanation with Gemma (${GEMMA_MODEL})...`);
        const response = await callGemmaWithTimeout(userContents, 6000);
        rawModelText = response.text;
        modelUsed = response.model;
      } catch (gemmaImgErr: any) {
        console.warn(`[Server AI] Gemma rejected image input (${gemmaImgErr?.message || 'Error'}). Retrying with Gemini Flash...`);
        // Fall back to Gemini Flash model for image input only
        const flashRes = await callGeminiFlash(userContents);
        rawModelText = flashRes.text;
        modelUsed = flashRes.model;
        processedWithModel = 'Gemini Flash';
      }
    } else {
      // Text-only: put full instructions inside user message itself
      try {
        console.log(`[Server AI] Attempting text explanation with Gemma (${GEMMA_MODEL})...`);
        const response = await callGemmaWithTimeout(promptText, 6000);
        rawModelText = response.text;
        modelUsed = response.model;
      } catch (gemmaTextErr: any) {
        console.warn(`[Server AI] Gemma text call failed (${gemmaTextErr?.message || 'Error'}). Retrying with Gemini Flash...`);
        const flashRes = await callGeminiFlash(promptText);
        rawModelText = flashRes.text;
        modelUsed = flashRes.model;
        processedWithModel = 'Gemini Flash';
      }
    }

    // 2. Log raw model response
    console.log('[Server AI] Model Used:', modelUsed);
    console.log('[Server AI] Raw model response:\n', rawModelText);

    // 3. Strip any ```json fences, extract text between first "{" and last "}", then JSON.parse it
    const parsedResult = parseExplanationResponse(
      rawModelText,
      targetLanguage as OutputLanguage,
      text || 'Uploaded Image Document',
      !!imageBase64,
      modelUsed
    );

    if (processedWithModel) {
      parsedResult.processedWithModel = processedWithModel;
    }

    return res.json(parsedResult);
  } catch (error: any) {
    console.error('[Server AI] Explanation error:', error);
    // 1. Never show a fake summary. Return real error text.
    return res.status(500).json({
      error: error?.message || 'An unexpected error occurred while analyzing the document.',
      rawModelOutput: rawModelText || undefined,
      modelUsed: modelUsed || undefined,
    });
  }
});

/**
 * POST /api/chat
 * Follow-up conversational questions about the analyzed document
 */
app.post('/api/chat', async (req: Request, res: Response) => {
  let answer = '';
  let modelUsed = '';

  try {
    const {
      documentContext,
      userQuestion,
      targetLanguage = 'Urdu',
    } = req.body;

    if (!userQuestion || !documentContext) {
      return res.status(400).json({
        error: 'Missing required question or document context.',
      });
    }

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured in the environment.',
      });
    }

    const promptText = buildFollowUpChatPrompt({
      targetLanguage: targetLanguage as OutputLanguage,
      documentContext,
      userQuestion,
    });

    try {
      console.log(`[Server AI] Asking follow-up question via Gemma (${GEMMA_MODEL})...`);
      const response = await callGemmaWithTimeout(promptText, 5000);
      answer = response.text;
      modelUsed = response.model;
    } catch (gemmaChatErr: any) {
      console.warn(`[Server AI] Gemma chat call failed (${gemmaChatErr?.message || 'Error'}). Retrying with Gemini Flash...`);
      const flashRes = await callGeminiFlash(promptText);
      answer = flashRes.text;
      modelUsed = flashRes.model;
    }

    console.log('[Server AI] Chat response from model (' + modelUsed + '):\n', answer);

    return res.json({
      answer: answer.trim(),
      rawModelOutput: answer,
      modelUsed,
    });
  } catch (error: any) {
    console.error('[Server AI] Chat error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to answer follow-up question.',
    });
  }
});

// Setup Vite in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Samajh server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
