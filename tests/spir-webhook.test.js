'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { createMemoryDb } = require('./helpers/memory-db');
const { insertLead } = require('../lib/leads-db');
const { processBookingEvent } = require('../api/spir-webhook');

// 実運用の設定値（docs/lead-capture-setup.md と同じ）
const LEAD_URL_ID = 'qKLPfOuw3wj6welMiVqd5';
const LEAD_URL = `https://app.spirinc.com/t/PzCSnkJVDW6MKMid8j7Im/as/${LEAD_URL_ID}/confirm`;
const OPTS = { leadUrlIds: [LEAD_URL_ID] };

let seq = 0;

// Spir 公式ヘルプ「Webhookサービス連携」の event.confirmed スキーマ準拠
function confirmedPayload({
  email,
  name = '受入 太郎',
  company = 'テスト株式会社',
  originalUrl = LEAD_URL,
  eventId = `evt-${++seq}`,
  startDateTime = '2026-08-10T01:00:00Z',
  confirmedAt = '2026-08-04T09:00:00Z',
} = {}) {
  return {
    webhookEventName: 'event.confirmed',
    webhookEventId: eventId,
    payload: {
      originalUrl,
      privateTitle: '資料請求フォロー個別相談（Webサイト経由）',
      confirmedAt,
      startDateTime,
      endDateTime: '2026-08-10T01:30:00Z',
      timeZone: 'Asia/Tokyo',
      title: '資料請求フォロー個別相談',
      organizer: { name: '高坂慎也', email: 'contact@boatship.jp' },
      attendeesFromOrganizerSide: [],
      invitee: { name, email, language: 'JA' },
      attendeesFromInviteeSide: [],
      formAnswers: [
        { questionId: 'q1', question: 'name', answer: name },
        { questionId: 'q2', question: 'email', answer: email },
        { questionId: 'q3', question: '会社・団体名', answer: company },
      ],
      rooms: [],
      utmParameters: {},
      source: { url: { query: '' } },
    },
  };
}

async function seedLead(db, email) {
  return insertLead(db, {
    company: 'リード株式会社', name: '既存リード', email,
    department: null, asset_id: 'pr-planning-template',
    landing_url: '/notes/a/', form_url: '/notes/b/',
    referrer: null, utm_source: null, utm_medium: null, utm_campaign: null,
    consent_at: new Date().toISOString(),
  });
}

test('invitee.email の突合で最新レコードの booked_at が更新される', async () => {
  const db = createMemoryDb();
  await seedLead(db, 'lead@example.ac.jp');
  await new Promise((r) => setTimeout(r, 5));
  await seedLead(db, 'lead@example.ac.jp');

  const result = await processBookingEvent(db, confirmedPayload({ email: 'lead@example.ac.jp' }), OPTS);
  assert.strictEqual(result.handled, true);
  assert.strictEqual(result.matched, true);
  const booked = db.rows.filter((r) => r.booked_at);
  assert.strictEqual(booked.length, 1, '最新の1件だけが更新される');
});

test('booked_at には startDateTime が入る（confirmedAt ではない）', async () => {
  const db = createMemoryDb();
  await seedLead(db, 'time@example.co.jp');
  await processBookingEvent(db, confirmedPayload({
    email: 'time@example.co.jp',
    startDateTime: '2026-08-10T01:00:00Z',
    confirmedAt: '2026-08-04T09:00:00Z',
  }), OPTS);
  const row = db.rows.find((r) => r.booked_at);
  assert.strictEqual(row.booked_at, '2026-08-10T01:00:00Z');
  assert.notStrictEqual(row.booked_at, '2026-08-04T09:00:00Z');
});

test('大文字小文字が違ってもメール突合できる', async () => {
  const db = createMemoryDb();
  await seedLead(db, 'Lead@Example.co.jp');
  const result = await processBookingEvent(db, confirmedPayload({ email: 'lead@example.co.jp' }), OPTS);
  assert.strictEqual(result.matched, true);
});

test('一致するリードが無ければ direct_booking で新規レコード（破棄しない）', async () => {
  const db = createMemoryDb();
  const result = await processBookingEvent(db, confirmedPayload({ email: 'new@example.com' }), OPTS);
  assert.strictEqual(result.handled, true);
  assert.strictEqual(result.matched, false);
  assert.strictEqual(db.rows.length, 1);
  assert.strictEqual(db.rows[0].asset_id, 'direct_booking');
  assert.strictEqual(db.rows[0].company, 'テスト株式会社', 'formAnswers の「会社・団体名」を拾う');
  assert.ok(db.rows[0].booked_at);
});

test('対象外の originalUrl は処理せず DB を更新しない（振り分け）', async () => {
  const db = createMemoryDb();
  await seedLead(db, 'lead@example.com');
  // 既存の別リンク（例: ご面談ミーティング）からの予約
  const result = await processBookingEvent(db, confirmedPayload({
    email: 'lead@example.com',
    originalUrl: 'https://app.spirinc.com/t/PzCSnkJVDW6MKMid8j7Im/as/otherLink99999/confirm',
  }), OPTS);
  assert.strictEqual(result.handled, false);
  assert.strictEqual(result.reason, 'url_id_not_matched');
  assert.strictEqual(db.rows.filter((r) => r.booked_at).length, 0);
  assert.strictEqual(db.rows.length, 1, '新規レコードも作られない');
});

test('webhookEventId が重複したら2回目は DB を更新しない（冪等性）', async () => {
  const db = createMemoryDb();
  const payload = confirmedPayload({ email: 'dup@example.com', eventId: 'evt-fixed-1' });

  const first = await processBookingEvent(db, payload, OPTS);
  assert.strictEqual(first.handled, true);
  assert.strictEqual(db.rows.length, 1);

  // Spir のリトライ（10秒ごとに4回）を想定した同一イベントの再送
  const second = await processBookingEvent(db, payload, OPTS);
  assert.strictEqual(second.handled, false);
  assert.strictEqual(second.reason, 'duplicate_event');
  assert.strictEqual(db.rows.length, 1, 'direct_booking が二重に作られない');
});

test('event.confirmed 以外のイベントは処理しない', async () => {
  const db = createMemoryDb();
  const body = confirmedPayload({ email: 'cancel@example.com' });
  body.webhookEventName = 'event.canceled';
  const result = await processBookingEvent(db, body, OPTS);
  assert.strictEqual(result.handled, false);
  assert.strictEqual(result.reason, 'not_confirmed_event');
  assert.strictEqual(db.rows.length, 0);
});
