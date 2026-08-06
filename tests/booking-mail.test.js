'use strict';
// 予約確定メール（Spir Webhook から自社送信）の本文検証。
// Spir の標準通知が予約者に届かない事象への対応として実装したもの。
const { test } = require('node:test');
const assert = require('node:assert');
const { buildBookingMail } = require('../lib/mailer');

const BASE = {
  name: '受入 太郎',
  company: 'テスト株式会社',
  startDateTime: '2026-08-10T01:00:00Z',
  endDateTime: '2026-08-10T01:30:00Z',
  timeZone: 'Asia/Tokyo',
};

test('UTCの日時が日本時間で表示される', () => {
  const m = buildBookingMail(BASE);
  // 01:00 UTC = 10:00 JST
  assert.ok(m.text.includes('2026年8月10日（月）10:00 〜 10:30'), m.text);
  assert.ok(m.html.includes('2026年8月10日（月）10:00 〜 10:30'));
});

test('UTC→JSTで日付が翌日になるケースも正しい', () => {
  const m = buildBookingMail({ ...BASE, startDateTime: '2026-12-01T23:30:00Z', endDateTime: '2026-12-02T00:00:00Z' });
  // 12/1 23:30 UTC = 12/2 08:30 JST
  assert.ok(m.text.includes('2026年12月2日（水）08:30 〜 09:00'), m.text);
});

test('Web会議URLが本文（text/html両方）に載る', () => {
  const url = 'https://meet.google.com/abc-defg-hij';
  const m = buildBookingMail({ ...BASE, meetingUrl: url });
  assert.ok(m.text.includes(url));
  assert.ok(m.html.includes(url));
});

test('パスコードがあれば併記する', () => {
  const m = buildBookingMail({ ...BASE, meetingUrl: 'https://zoom.us/j/123', meetingPassword: 'abc123' });
  assert.ok(m.text.includes('パスコード: abc123'));
  assert.ok(m.html.includes('abc123'));
});

test('Web会議URLが未発行でも本文は成立し、当日案内すると書く', () => {
  const m = buildBookingMail(BASE);
  assert.ok(m.text.includes('当日までに別途ご案内します'));
  assert.ok(!m.text.includes('undefined') && !m.text.includes('null'));
});

test('会社名が無くても宛名が壊れない', () => {
  const m = buildBookingMail({ ...BASE, company: null });
  assert.ok(m.text.startsWith('受入 太郎 様'), m.text.slice(0, 40));
});

test('日時が不正でも本文は生成できる（送信自体は止めない）', () => {
  const m = buildBookingMail({ ...BASE, startDateTime: 'not-a-date', endDateTime: null });
  assert.ok(m.text.includes('日時は確定メールをご確認ください'));
});

test('件名は装飾を含まない実務的なもの', () => {
  assert.strictEqual(buildBookingMail(BASE).subject, '【BOATship】ご相談の日程が確定しました');
});
