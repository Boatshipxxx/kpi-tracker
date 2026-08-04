'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { validateLeadInput, isSpam } = require('../lib/lead-validation');

test('必須項目が空だとフィールド単位のエラーが返る', () => {
  const { errors } = validateLeadInput({});
  assert.ok(errors.company.includes('会社・団体名'));
  assert.ok(errors.name.includes('氏名'));
  assert.ok(errors.email.includes('メールアドレス'));
  assert.ok(errors.consent.includes('同意'));
  assert.strictEqual(errors.department, undefined); // 任意項目
});

test('メール形式エラーは直し方が分かる文言', () => {
  const { errors } = validateLeadInput({ company: 'A', name: 'B', email: 'not-an-email', consent: 'on' });
  assert.ok(errors.email.includes('例:'));
});

test('正しい入力はエラーなし・値はトリムされる', () => {
  const { errors, values } = validateLeadInput({
    company: '  株式会社テスト  ', name: '高坂', email: 'a@b.co.jp', department: '', consent: 'on',
  });
  assert.deepStrictEqual(errors, {});
  assert.strictEqual(values.company, '株式会社テスト');
  assert.strictEqual(values.department, null);
});

test('honeypot が埋まっていたら spam 判定', () => {
  assert.strictEqual(isSpam({ website: 'http://spam', started_at: Date.now() - 10000 }), 'honeypot');
});

test('3秒未満の送信は拒否・3秒以上は通す', () => {
  assert.strictEqual(isSpam({ website: '', started_at: Date.now() - 1000 }), 'too_fast');
  assert.strictEqual(isSpam({ website: '', started_at: Date.now() - 3500 }), null);
});
