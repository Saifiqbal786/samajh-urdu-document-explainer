import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Loader2, User, Bot, HelpCircle } from 'lucide-react';
import { ChatMessage, OutputLanguage, ExplanationResult } from '../types/index.ts';
import { askFollowUpQuestion } from '../services/ai.ts';

interface FollowUpChatProps {
  result: ExplanationResult;
  targetLanguage: OutputLanguage;
}

export const FollowUpChat: React.FC<FollowUpChatProps> = ({ result, targetLanguage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const isUrdu = targetLanguage === 'Urdu';
  const isRoman = targetLanguage === 'Roman Urdu';

  // Smart suggested questions based on document type
  const getSuggestions = () => {
    const docLower = (result.documentType + ' ' + result.summary).toLowerCase();
    if (docLower.includes('bill') || docLower.includes('بل') || docLower.includes('lesco') || docLower.includes('electric')) {
      return isUrdu
        ? ['کیا میں آخری تاریخ کے بعد بل جمع کرا سکتا ہوں؟', 'بل آن لائن کیسے جمع کرائیں؟', 'کیا قسطیں ہو سکتی ہیں؟']
        : isRoman
        ? ['Kya main late payment kar sakta hun?', 'Bill online kaise pay karein?', 'Kya instalments ho sakti hain?']
        : ['Can I pay after the due date?', 'How can I pay this bill online?', 'Can I request installments?'];
    }
    if (docLower.includes('prescription') || docLower.includes('نسخہ') || docLower.includes('doctor') || docLower.includes('medicine')) {
      return isUrdu
        ? ['اگر کوئی خوراک چھوٹ جائے تو کیا کریں؟', 'کیا یہ دوائی کھانے سے پہلے لینی ہے؟', 'کیا اس کے کوئی سائیڈ ایفیکٹس ہیں؟']
        : isRoman
        ? ['Agar dose miss ho jaye toh kya karein?', 'Khaane se pehle leni hai ya baad mein?', 'Kya koi parhez zaroori hai?']
        : ['What if I miss a dose?', 'Should I take this before or after food?', 'Are there any dietary restrictions?'];
    }
    if (docLower.includes('court') || docLower.includes('عدالت') || docLower.includes('summons') || docLower.includes('سمن')) {
      return isUrdu
        ? ['اگر میں مقررہ تاریخ پر عدالت نہ جا سکوں تو کیا ہوگا؟', 'کیا وکیل کا ہونا لازمی ہے؟', 'ساتھ کون سے کاغذات لے جانے ہیں؟']
        : isRoman
        ? ['Agar main court na ja sakun toh kya hoga?', 'Kya wakeel lazmi hai?', 'Kaunse documents saath le jane hain?']
        : ['What happens if I cannot attend court on this date?', 'Do I need to hire a lawyer?', 'What documents should I bring?'];
    }
    // Generic fallback
    return isUrdu
      ? ['اس دستاویز میں سب سے ضروری بات کیا ہے؟', 'کیا اس پر کوئی جرمانہ ہے؟', 'اگلا قدم کیا ہونا چاہیے؟']
      : isRoman
      ? ['Sabse zaroori baat kya hai?', 'Kya koi penalty lag sakti hai?', 'Agla step kya hona chahiye?']
      : ['What is the single most urgent matter here?', 'Is there any penalty?', 'Where do I submit this?'];
  };

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || inputQuestion.trim();
    if (!textToSend || isLoading) return;

    setChatError(null);
    setInputQuestion('');

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const documentContext = `
Document Type: ${result.documentType}
Summary: ${result.summary}
Deadlines: ${JSON.stringify(result.deadlines)}
Key Details: ${JSON.stringify(result.keyDetails)}
Next Steps: ${JSON.stringify(result.nextSteps)}
Warnings: ${JSON.stringify(result.warnings)}
Original Snippet: ${result.inputSnippet}
`;

      const answer = await askFollowUpQuestion({
        documentContext,
        userQuestion: textToSend,
        targetLanguage,
      });

      const assistantMsg: ChatMessage = {
        id: 'msg_bot_' + Date.now(),
        sender: 'assistant',
        text: answer,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setChatError(err.message || 'Could not fetch response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = getSuggestions();

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-sm border border-emerald-900/10 p-5 sm:p-7">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0B6B4F] flex items-center justify-center shrink-0">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>Ask a Follow-up Question</span>
            <span className="font-urdu-clean text-emerald-800 text-sm sm:text-base">/ مزید سوال پوچھیں</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">
            Ask anything about this document in {targetLanguage} (e.g. "Can I pay late?", "What if I miss a dose?")
          </p>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="mt-4">
        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-2 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#0B6B4F]" />
          Suggested Questions / تجویز کردہ سوالات:
        </label>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className={`text-xs py-1.5 px-3 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-emerald-900 transition active:scale-95 text-left ${
                isUrdu ? 'font-urdu-clean' : ''
              }`}
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Thread */}
      {messages.length > 0 && (
        <div className="mt-5 space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-[#0B6B4F] text-white'
                      : 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] sm:max-w-[78%] text-xs sm:text-sm ${
                    isUser
                      ? 'bg-[#0B6B4F] text-white rounded-tr-xs'
                      : 'bg-gray-100 text-gray-800 rounded-tl-xs'
                  }`}
                  dir={isUrdu ? 'rtl' : 'ltr'}
                >
                  <p className={`font-medium ${isUrdu ? 'font-urdu text-base sm:text-lg leading-loose' : ''}`}>
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Loading state indicator */}
      {isLoading && (
        <div className="mt-4 flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-[#0B6B4F]" />
          <span>Samajh is thinking in {targetLanguage}... (جواب تیار کیا جا رہا ہے...)</span>
        </div>
      )}

      {chatError && (
        <p className="mt-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
          {chatError}
        </p>
      )}

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-4 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder={
            isUrdu
              ? 'دستاویز کے بارے میں اپنا سوال یہاں لکھیں...'
              : isRoman
              ? 'Apna sawal yahan likhein...'
              : 'Ask a question about this document...'
          }
          className={`flex-1 p-3 rounded-xl border border-gray-300 focus:border-[#0B6B4F] focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm bg-white text-gray-800 ${
            isUrdu ? 'text-right font-urdu-clean' : ''
          }`}
          dir={isUrdu ? 'rtl' : 'ltr'}
        />
        <button
          type="submit"
          disabled={!inputQuestion.trim() || isLoading}
          aria-label="Send follow-up question"
          className="py-3 px-4 rounded-xl bg-[#0B6B4F] hover:bg-[#074B37] text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask / پوچھیں</span>
        </button>
      </form>
    </div>
  );
};
