// POST /api/spir-webhook — Spir 日程確定イベントの受け口（仕様 4-5）。
// ペイロードは公式スキーマ準拠で読む（lib/spir-payload.js 冒頭の出典を参照）。
//
// Spir の Webhook 仕様（公式ヘルプ確認済み）:
//   - すべての空き時間リンクが送信対象になる（個別指定は不可）
//     → payload.originalUrl の識別子で振り分け、リード導線以外は 200 で黙って無視する。
//       既存の3リンク（ご面談ミーティング等）の予約もここに届くが leads に混入させない。
//   - 非200 を返すと 10秒ごとに4回リトライされ、最終失敗でチーム管理者全員に
//     エラーメールが飛ぶ → 業務例外はすべて 200 で返し、内容は Slack で追う。
//   - リトライがあるため webhookEventId で重複排除する。
//   - タイムアウト30秒 → 重い処理（Slack通知）は応答後に waitUntil で行う。
//   - 送信元IPは固定されないため IP allowlist は不可。検証を足すなら
//     Webhook 登録URLに ?token= を付け SPIR_WEBHOOK_TOKEN を設定する（要・再登録）。
//
// 紐付けはメールアドレス（payload.invitee.email）で行う:
//   - leads に一致 → 最新レコードの booked_at を payload.startDateTime で更新
//   - 一致なし     → asset_id='direct_booking' で新規レコード作成（破棄しない）
'use strict';

const { waitUntil } = require('@vercel/functions');
const { getDb } = require('../lib/db');
const { markBookedByEmail, insertDirectBooking, claimWebhookEvent } = require('../lib/leads-db');
const { parseWebhookBody, isLeadBooking } = require('../lib/spir-payload');
const { notifyBooking, post: slackPost } = require('../lib/notify-slack');
const { sendBookingConfirmation } = require('../lib/mailer');

// 資料請求フォロー個別相談（Webサイト経由）の空き時間リンク識別子。
// 環境変数 SPIR_LEAD_URL_IDS（カンマ区切り）で上書き・追加できる。
const DEFAULT_LEAD_URL_IDS = ['qKLPfOuw3wj6welMiVqd5'];

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

// コアロジック（テストから直接呼ぶ）。body は Webhook の生ボディ全体。
async function processBookingEvent(db, body, { leadUrlIds }) {
  const parsed = parseWebhookBody(body);

  // 日程確定イベント以外（将来 event.canceled 等を登録した場合を含む）は処理しない
  if (parsed.eventName !== 'event.confirmed') {
    return { handled: false, reason: 'not_confirmed_event' };
  }

  // 振り分け: リード導線以外の空き時間リンクは leads に混入させない
  const urlId = isLeadBooking(parsed, leadUrlIds);
  if (!urlId) {
    return { handled: false, reason: 'url_id_not_matched' };
  }

  if (!parsed.inviteeEmail) {
    return { handled: false, reason: 'no_invitee_email' };
  }

  // 冪等性: リトライで同じイベントが再送されても一度だけ処理する
  if (parsed.eventId) {
    const first = await claimWebhookEvent(db, parsed.eventId);
    if (!first) {
      return { handled: false, reason: 'duplicate_event', eventId: parsed.eventId };
    }
  }

  // booked_at は予定の開始時刻（startDateTime）。confirmedAt（確定操作日時）ではない。
  const bookedAt = parsed.startDateTime || new Date().toISOString();

  const matched = await markBookedByEmail(db, parsed.inviteeEmail, bookedAt);
  if (matched) {
    return { handled: true, matched: true, email: parsed.inviteeEmail, parsed };
  }
  const created = await insertDirectBooking(db, {
    email: parsed.inviteeEmail,
    name: parsed.inviteeName,
    company: parsed.company,
    bookedAt,
    sourceUrl: `spir:${urlId}`,
  });
  return { handled: true, matched: false, email: parsed.inviteeEmail, leadId: created.id, parsed };
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  // 任意のトークン検証。現在の登録URLはトークン無しのため、
  // SPIR_WEBHOOK_TOKEN を設定する場合は Spir 側のURL再登録もセットで行うこと。
  const expected = process.env.SPIR_WEBHOOK_TOKEN;
  if (expected) {
    const url = new URL(req.url, 'http://localhost');
    if (url.searchParams.get('token') !== expected) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    // パース不能でも 200（非200はリトライ+管理者メールを誘発するだけ）
    res.status(200).json({ ok: false, reason: 'invalid_payload' });
    return;
  }

  const envIds = (process.env.SPIR_LEAD_URL_IDS || '')
    .split(',').map((s) => s.trim()).filter(Boolean);
  const leadUrlIds = envIds.length > 0 ? envIds : DEFAULT_LEAD_URL_IDS;

  let result;
  try {
    result = await processBookingEvent(getDb(), body, { leadUrlIds });
  } catch (err) {
    console.error('[spir] 処理失敗:', err.message);
    waitUntil(slackPost(`⚠️ Spir Webhook の処理に失敗しました: ${err.message}\nSpir側の予約は成立しています。leads の booked_at を手動確認してください。`));
    res.status(200).json({ ok: false, reason: 'processing_error' });
    return;
  }

  if (result.handled) {
    waitUntil(notifyBooking({ email: result.email, matched: result.matched, leadId: result.leadId || '(既存レコード)' }));
    // 予約確定メールを自社から送る。
    // Spir の標準通知だけでは予約者に案内が届かない事象があったため
    // （2026-08-06）、Webhook 受信時にこちらから確実に送る。
    // 冪等性は webhookEventId で担保済みなので、リトライで二重送信されない。
    waitUntil(sendBookingConfirmationSafely(result));
  }
  // parsed は内部用なので応答には含めない
  const { parsed: _omit, ...publicResult } = result;
  res.status(200).json({ ok: true, ...publicResult });
};

// 予約確定メールの送信。失敗しても Webhook 応答には影響させず、Slackで気づけるようにする。
async function sendBookingConfirmationSafely(result) {
  const p = result.parsed || {};
  try {
    await sendBookingConfirmation({
      to: result.email,
      name: p.inviteeName,
      company: p.company,
      startDateTime: p.startDateTime,
      endDateTime: p.endDateTime,
      timeZone: p.timeZone,
      meetingUrl: p.onlineMeeting && p.onlineMeeting.url,
      meetingPassword: p.onlineMeeting && p.onlineMeeting.password,
    });
    if (!(p.onlineMeeting && p.onlineMeeting.url)) {
      await slackPost(`⚠️ 予約確定メールを送信しましたが、**Web会議URLが未発行**でした\n宛先：${result.email}\nSpirのカレンダー/会議ツール連携を確認し、当日までにURLを個別にご案内してください。`);
    }
  } catch (err) {
    console.error('[spir] 予約確定メール送信失敗:', err.message);
    await slackPost(`⚠️ 予約確定メールの送信に失敗しました\n宛先：${result.email}\n原因：${err.message}\n→ 予約自体は成立しています。手動で日程をご連絡ください。`);
  }
}

module.exports.processBookingEvent = processBookingEvent;
