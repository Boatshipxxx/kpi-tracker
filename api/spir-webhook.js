// POST /api/spir-webhook — Spir 日程確定イベントの受け口（仕様 4-5）。
//
// Spir の Webhook はリンク個別に設定できず、全空き時間URLのイベントが
// 同一エンドポイントに届く。SPIR_LEAD_URL_IDS（カンマ区切りの識別子）で
// リード導線の空き時間URLだけを処理し、それ以外は無視する（混入防止）。
//
// 紐付けはメールアドレスで行う:
//   - leads に一致 → 最新レコードの booked_at を更新
//   - 一致なし     → asset_id='direct_booking' で新規レコード作成（破棄しない）
'use strict';

const { waitUntil } = require('@vercel/functions');
const { getDb } = require('../lib/db');
const { markBookedByEmail, insertDirectBooking } = require('../lib/leads-db');
const { extractAttendeeEmails, matchUrlId, extractStartTime, extractName, extractCompany } = require('../lib/spir-payload');
const { notifyBooking, post: slackPost } = require('../lib/notify-slack');

function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 256 * 1024) reject(new Error('body too large')); });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

// テストから注入できるようにコアロジックを分離
async function processBookingEvent(db, payload, { leadUrlIds }) {
  const urlId = matchUrlId(payload, leadUrlIds);
  if (!urlId) {
    // リード導線以外の空き時間URLからの予約 → leads に混入させない
    return { handled: false, reason: 'url_id_not_matched' };
  }

  const emails = extractAttendeeEmails(payload);
  if (emails.length === 0) {
    return { handled: false, reason: 'no_attendee_email' };
  }
  const email = emails[0];
  const bookedAt = extractStartTime(payload) || new Date().toISOString();

  const matched = await markBookedByEmail(db, email, bookedAt);
  if (matched) {
    return { handled: true, matched: true, email };
  }
  const created = await insertDirectBooking(db, {
    email,
    name: extractName(payload),
    company: extractCompany(payload),
    bookedAt,
    sourceUrl: `spir:${urlId}`,
  });
  return { handled: true, matched: false, email, leadId: created.id };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  // Webhook URL 登録時に ?token=... を付けておき、部外者からのPOSTを弾く
  const expected = process.env.SPIR_WEBHOOK_TOKEN;
  if (expected) {
    const url = new URL(req.url, 'http://localhost');
    if (url.searchParams.get('token') !== expected) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
  }

  let payload;
  try {
    payload = await readBody(req);
  } catch {
    res.status(400).json({ error: 'invalid payload' });
    return;
  }

  const leadUrlIds = (process.env.SPIR_LEAD_URL_IDS || '')
    .split(',').map((s) => s.trim()).filter(Boolean);
  if (leadUrlIds.length === 0) {
    // 設定漏れは静かに落とさず、Slackに警告して気づけるようにする
    console.error('[spir] SPIR_LEAD_URL_IDS 未設定。イベントを処理できません。');
    waitUntil(slackPost('⚠️ Spir Webhook を受信しましたが SPIR_LEAD_URL_IDS が未設定のため処理できませんでした。Vercel の環境変数を設定してください。'));
    res.status(200).json({ ok: false, reason: 'not_configured' });
    return;
  }

  let result;
  try {
    result = await processBookingEvent(getDb(), payload, { leadUrlIds });
  } catch (err) {
    console.error('[spir] 処理失敗:', err.message);
    waitUntil(slackPost(`⚠️ Spir Webhook の処理に失敗しました: ${err.message}\nSpir側の予約は成立しています。leads の booked_at を手動確認してください。`));
    // Spir側の無用な再送を避けるため 200 を返す（内容はSlackで追う）
    res.status(200).json({ ok: false, reason: 'processing_error' });
    return;
  }

  if (result.handled) {
    waitUntil(notifyBooking({ email: result.email, matched: result.matched, leadId: result.leadId || '(既存レコード)' }));
  }
  res.status(200).json({ ok: true, ...result });
};

module.exports.processBookingEvent = processBookingEvent;
