import test from 'node:test';
import assert from 'node:assert/strict';
import { parseExplanationResponse } from './parser.ts';

test('successfully parses JSON enclosed in markdown code fences', () => {
  const jsonResponse = `\`\`\`json
{
  "documentType": "بجلی کا بل",
  "summary": "یہ لیسکو کا بجلی کا بل ہے جس میں 384 یونٹ استعمال ہوئے ہیں۔",
  "keyDetails": [
    { "label": "صارف کا نام", "value": "محمد عثمان" },
    { "label": "ریفرنس نمبر", "value": "12345678901234" }
  ],
  "deadlines": [
    { "what": "بل جمع کروانے کی آخری تاریخ", "date": "14 نومبر 2026", "amount": "18,450 روپے" }
  ],
  "difficultTerms": [
    { "term": "FPA", "meaning": "فیول پرائس ایڈجسٹمنٹ" }
  ],
  "nextSteps": [
    "14 نومبر سے پہلے قریبی بینک یا ایزی پیسہ سے بل ادا کریں"
  ],
  "warnings": [
    "آخری تاریخ کے بعد 1,650 روپے جرمانہ لگے گا"
  ]
}
\`\`\``;

  const result = parseExplanationResponse(jsonResponse, 'Urdu', 'LESCO Electricity Bill', false, 'gemma-4-26b-a4b-it');
  assert.equal(result.documentType, 'بجلی کا بل');
  assert.equal(result.keyDetails.length, 2);
  assert.equal(result.deadlines.length, 1);
  assert.equal(result.deadlines[0].amount, '18,450 روپے');
  assert.equal(result.difficultTerms[0].term, 'FPA');
  assert.equal(result.nextSteps.length, 1);
  assert.equal(result.warnings.length, 1);
  assert.equal(result.modelUsed, 'gemma-4-26b-a4b-it');
  assert.equal(result.rawModelOutput, jsonResponse);
});

test('handles raw JSON without code fences and preserves empty arrays', () => {
  const raw = `Here is the explanation: {
    "documentType": "Medical Prescription",
    "summary": "Doctor has prescribed antibiotic for chest infection.",
    "keyDetails": [],
    "deadlines": [],
    "difficultTerms": [],
    "nextSteps": ["Take medicine after meals"],
    "warnings": []
  }`;

  const result = parseExplanationResponse(raw, 'English', 'Prescription for Ali');
  assert.equal(result.documentType, 'Medical Prescription');
  assert.equal(result.nextSteps[0], 'Take medicine after meals');
  assert.equal(result.keyDetails.length, 0);
  assert.equal(result.deadlines.length, 0);
});

test('throws descriptive error on completely invalid response without mocking', () => {
  assert.throws(() => {
    parseExplanationResponse('This is not json at all, just an error.');
  }, /did not contain a valid JSON object/);
});
