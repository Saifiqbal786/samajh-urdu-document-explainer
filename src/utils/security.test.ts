import test from 'node:test';
import assert from 'node:assert/strict';
import { detectSensitiveInfo, maskSensitiveInfo } from './security.ts';

test('detects Pakistani CNIC format with hyphens', () => {
  const text = 'Mera CNIC number 35201-1234567-1 hai, kripya note karein.';
  const matches = detectSensitiveInfo(text);
  assert.equal(matches.length, 1);
  assert.equal(matches[0].type, 'cnic');
  assert.equal(matches[0].matchedText, '35201-1234567-1');
});

test('detects 13-digit raw CNIC', () => {
  const text = 'Identity card: 4210198765431';
  const matches = detectSensitiveInfo(text);
  assert.equal(matches.length, 1);
  assert.equal(matches[0].type, 'cnic');
  assert.equal(matches[0].matchedText, '4210198765431');
});

test('detects 16 digit bank card numbers', () => {
  const text = 'Please charge to 4532-1234-5678-9012 for the utility bill';
  const matches = detectSensitiveInfo(text);
  assert.equal(matches.length, 1);
  assert.equal(matches[0].type, 'bank_card');
  assert.equal(matches[0].matchedText, '4532-1234-5678-9012');
});

test('returns empty array when no sensitive data present', () => {
  const text = 'Normal electricity bill of 350 units due on 15 Nov 2026.';
  const matches = detectSensitiveInfo(text);
  assert.equal(matches.length, 0);
});

test('masks sensitive information appropriately', () => {
  const text = 'CNIC: 35201-1234567-1 and card: 4532-1234-5678-9012';
  const masked = maskSensitiveInfo(text);
  assert.equal(masked.includes('35201-1234567-1'), false);
  assert.equal(masked.includes('4532-1234-5678-9012'), false);
});
