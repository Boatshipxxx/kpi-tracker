'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { createMemoryDb } = require('./helpers/memory-db');
const { insertLead } = require('../lib/leads-db');
const { processBookingEvent } = require('../api/spir-webhook');

const LEAD_URL_IDS = ['abc123lead'];

function samplePayload({ email, urlId = 'abc123lead', name = '山田太郎', company = 'テスト株式会社' }) {
  // Spirの正式スキーマ確定前の防御的パースを検証するため、
  // ありそうな入れ子構造で組む（キー名に依存しないことの確認）
  return {
    event: 'confirmed',
    booking: {
      url: `https://app.spirinc.com/t/${urlId}/confirm`,
      start_time: '2026-08-01T10:00:00+09:00',
      attendees: [
        { displayName: name, email },
        { displayName: 'BOATship', email: 'contact@boatship.jp' },
      ],
      questions: [{ label: '会社・団体名', answer: company }],
    },
  };
}

async function seedLead(db, email, overrides = {}) {
  return insertLead(db, {
    company: 'リード株式会社', name: '既存リード', email,
    department: null, asset_id: 'pr-planning-template',
    landing_url: '/notes/a/', form_url: '/notes/b/',
    referrer: null, utm_source: null, utm_medium: null, utm_campaign: null,
    consent_at: new Date().toISOString(),
    ...overrides,
  });
}

test('メールアドレス突合で最新レコードの booked_at が更新される', async () => {
  const db = createMemoryDb();
  await seedLead(db, 'lead@example.ac.jp');
  await new Promise((r) => setTimeout(r, 5)); // created_at の順序を保証
  await seedLead(db, 'lead@example.ac.jp');

  const result = await processBookingEvent(db, samplePayload({ email: 'lead@example.ac.jp' }), { leadUrlIds: LEAD_URL_IDS });
  assert.strictEqual(result.handled, true);
  assert.strictEqual(result.matched, true);

  const booked = db.rows.filter((r) => r.booked_at);
  assert.strictEqual(booked.length, 1, '最新の1件だけが更新される');
  assert.strictEqual(booked[0].created_at, db.rows.map((r) => r.created_at).sort().reverse()[0]);
});

test('大文字小文字が違ってもメール突合できる', async () => {
  const db = createMemoryDb();
  await seedLead(db, 'Lead@Example.co.jp');
  const result = await processBookingEvent(db, samplePayload({ email: 'lead@example.co.jp' }), { leadUrlIds: LEAD_URL_IDS });
  assert.strictEqual(result.matched, true);
});

test('一致するリードが無ければ direct_booking で新規レコードが作られる（破棄しない）', async () => {
  const db = createMemoryDb();
  const result = await processBookingEvent(db, samplePayload({ email: 'new@example.com' }), { leadUrlIds: LEAD_URL_IDS });
  assert.strictEqual(result.handled, true);
  assert.strictEqual(result.matched, false);
  assert.strictEqual(db.rows.length, 1);
  assert.strictEqual(db.rows[0].asset_id, 'direct_booking');
  assert.strictEqual(db.rows[0].email, 'new@example.com');
  assert.ok(db.rows[0].booked_at, 'booked_at が入る');
  assert.strictEqual(db.rows[0].company, 'テスト株式会社', '質問フォームの会社名を拾う');
});

test('リード導線以外の空き時間URLの予約は leads に混入しない（振り分け）', async () => {
  const db = createMemoryDb();
  await seedLead(db, 'lead@example.com');
  const result = await processBookingEvent(db, samplePayload({ email: 'lead@example.com', urlId: 'other-url-999' }), { leadUrlIds: LEAD_URL_IDS });
  assert.strictEqual(result.handled, false);
  assert.strictEqual(result.reason, 'url_id_not_matched');
  assert.strictEqual(db.rows.filter((r) => r.booked_at).length, 0, 'booked_at は更新されない');
  assert.strictEqual(db.rows.length, 1, '新規レコードも作られない');
});

test('主催者（boatship.jp）のアドレスは参加者として扱わない', async () => {
  const db = createMemoryDb();
  const payload = samplePayload({ email: 'guest@univ.ac.jp' });
  const result = await processBookingEvent(db, payload, { leadUrlIds: LEAD_URL_IDS });
  assert.strictEqual(result.email, 'guest@univ.ac.jp');
});
