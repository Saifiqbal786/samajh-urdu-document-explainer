/**
 * Browser Web Speech API utility for reading explanations aloud.
 * Attempts ur-PK first, falling back to Urdu/Arabic/Hindi (hi-IN) or en-US.
 */

import { ExplanationResult, OutputLanguage } from '../types/index.ts';

export interface SpeechStatus {
  supported: boolean;
  speaking: boolean;
  paused: boolean;
  selectedVoiceName: string;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getBestVoice(language: OutputLanguage): SpeechSynthesisVoice | null {
    if (!this.voices.length && this.synth) {
      this.voices = this.synth.getVoices();
    }
    if (!this.voices.length) return null;

    if (language === 'Urdu') {
      // 1. Look for Urdu voices (ur-PK, ur, ur-IN)
      const urduVoice = this.voices.find(v => v.lang.toLowerCase().startsWith('ur'));
      if (urduVoice) return urduVoice;

      // 2. Hindi (hi-IN) voices share near-identical phonetics with Urdu and pronounce words very well
      const hindiVoice = this.voices.find(v => v.lang.toLowerCase().startsWith('hi'));
      if (hindiVoice) return hindiVoice;

      // 3. Arabic voices
      const arabicVoice = this.voices.find(v => v.lang.toLowerCase().startsWith('ar'));
      if (arabicVoice) return arabicVoice;
    }

    if (language === 'Roman Urdu') {
      // For Roman Urdu, a Pakistani, Indian English, or standard English voice sounds most natural
      const pkOrInVoice = this.voices.find(v =>
        v.lang.toLowerCase().includes('en-pk') ||
        v.lang.toLowerCase().includes('en-in') ||
        v.lang.toLowerCase().startsWith('hi')
      );
      if (pkOrInVoice) return pkOrInVoice;
    }

    // Default to en-US or first available English voice
    const enUsVoice = this.voices.find(v => v.lang.toLowerCase() === 'en-us');
    if (enUsVoice) return enUsVoice;

    const anyEn = this.voices.find(v => v.lang.toLowerCase().startsWith('en'));
    if (anyEn) return anyEn;

    return this.voices[0] || null;
  }

  public prepareSpeechText(result: ExplanationResult): string {
    const lines: string[] = [];
    const isUrdu = result.targetLanguage === 'Urdu';
    const isRoman = result.targetLanguage === 'Roman Urdu';

    if (isUrdu) {
      lines.push(`${result.documentType}۔`);
      lines.push(result.summary);
      if (result.deadlines.length) {
        lines.push('اہم تاریخ اور رقم:');
        result.deadlines.forEach(d => {
          lines.push(`${d.what}: ${d.date} ${d.amount ? `, رقم ${d.amount}` : ''}۔`);
        });
      }
      if (result.nextSteps.length) {
        lines.push('اب آپ کو کیا کرنا ہے:');
        result.nextSteps.forEach((s, idx) => {
          lines.push(`قدم نمبر ${idx + 1}: ${s}۔`);
        });
      }
      if (result.warnings.length) {
        lines.push('ضروری تنبیہ:');
        result.warnings.forEach(w => lines.push(`${w}۔`));
      }
    } else if (isRoman) {
      lines.push(`${result.documentType}.`);
      lines.push(result.summary);
      if (result.deadlines.length) {
        lines.push('Aham tareekh aur raqam:');
        result.deadlines.forEach(d => {
          lines.push(`${d.what}: ${d.date} ${d.amount ? `, amount ${d.amount}` : ''}.`);
        });
      }
      if (result.nextSteps.length) {
        lines.push('Agla qadam kya hai:');
        result.nextSteps.forEach((s, idx) => {
          lines.push(`Step ${idx + 1}: ${s}.`);
        });
      }
      if (result.warnings.length) {
        lines.push('Khas hidayat:');
        result.warnings.forEach(w => lines.push(`${w}.`));
      }
    } else {
      lines.push(`Document: ${result.documentType}.`);
      lines.push(result.summary);
      if (result.deadlines.length) {
        lines.push('Important Deadlines:');
        result.deadlines.forEach(d => {
          lines.push(`${d.what}: ${d.date} ${d.amount ? `, amount ${d.amount}` : ''}.`);
        });
      }
      if (result.nextSteps.length) {
        lines.push('What you should do next:');
        result.nextSteps.forEach((s, idx) => {
          lines.push(`Step ${idx + 1}: ${s}.`);
        });
      }
      if (result.warnings.length) {
        lines.push('Warnings:');
        result.warnings.forEach(w => lines.push(`${w}.`));
      }
    }

    return lines.join(' ');
  }

  public speak(
    text: string,
    language: OutputLanguage,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.synth) {
      onError?.(new Error('Speech Synthesis not supported'));
      return;
    }

    // Cancel any previous speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getBestVoice(language);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = language === 'Urdu' ? 'ur-PK' : 'en-US';
    }

    // Patient, gentle rate for comprehension
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      onError?.(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking && !this.synth.paused);
  }

  public isPaused(): boolean {
    return !!(this.synth && this.synth.paused);
  }
}

export const speechService = new SpeechService();
