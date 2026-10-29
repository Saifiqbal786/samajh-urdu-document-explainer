# Samajh (سمجھ) – AI Document Explainer for Pakistan

> Apni zaban mein samjhein: understand any document in simple Urdu.

**Live demo:** (https://ai.studio/apps/7774de37-e86b-4932-9ec7-0a90d3cb6f9b)

## Purpose
Many people in Pakistan receive prescriptions, utility bills, legal notices, and bank or government letters that are written in English or formal language they can't fully understand. This can lead to missed deadlines, wrong medicine use, or scams. Samajh explains these documents in simple Urdu, Roman Urdu, or English.

## Features
- Upload a photo or paste text of a document
- Output in Urdu (اردو), Roman Urdu, or English
- Structured result: summary, key details, deadlines and amounts, difficult terms, next steps, and warnings
- Follow-up chat to ask questions about the document
- Listen button (text-to-speech) to read the explanation aloud
- Copy and share results
- Local history of the last 5 explanations (stored only in your browser)
- Built-in sample documents to try instantly
- Privacy warning for CNIC and card-number patterns

## How AI is used
- **Model:** Google Gemma (via the Gemini API); a Gemini Flash model is used for image input if the Gemma model does not accept images.
- **Document understanding:** The model reads the uploaded image or text and detects the document type.
- **Structured output:** A system prompt makes the model reply in JSON (summary, key details, deadlines, difficult terms, next steps, warnings), which the app renders as a result card.
- **Simplification and translation:** The prompt instructs the model to use very simple words, avoid inventing information, and reply only in the selected language.
- **Follow-up Q&A:** The document and explanation are kept as context so the user can ask questions.
- **Safety:** The app tells users it is not a doctor, lawyer, or financial advisor.

## Tech stack
React, TypeScript, Gemini API (Gemma), Web Speech API, localStorage.

## Setup
1. Clone the repo:
   `git clone https://github.com/Saifiqbal786/samajh-urdu-document-explainer.git && cd samajh-urdu-document-explainer`
2. Install dependencies: `npm install` or check package.json 
3. Create a `.env.local` file and add your key:
   `GEMINI_API_KEY=your_api_key_here`
   (Get a free key at https://aistudio.google.com/apikey)
4. Run the app: `npm run dev`
5. Open the local URL shown in the terminal.

## Privacy
Documents are sent only to the AI model for the explanation and are not stored on any server by this app. History is saved in your browser's localStorage and can be cleared at any time. Please do not upload CNIC numbers or card details.

## Disclaimer
Samajh is an AI helper, not a doctor, lawyer, or financial advisor. Verify important matters with a professional.

## License
MIT. See [LICENSE](LICENSE).

## Team
Built by Saif (Team Batal) for HackDay x Zeppelin Labs.
