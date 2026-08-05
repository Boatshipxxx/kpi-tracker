// leads テーブルへのアクセス層。
// すべての関数は `db`（{ query(text, params) => Promise<rows> }）を受け取る。
// 本番は lib/db.js の Neon クライアント、テストはメモリ実装を注入する。
'use strict';

const INSERT_COLUMNS = [
  'company', 'name', 'email', 'department', 'asset_id',
  'landing_url', 'form_url', 'referrer',
  'utm_source', 'utm_medium', 'utm_campaign', 'consent_at',
];

async function insertLead(db, lead) {
  const values = INSERT_COLUMNS.map((c) => (lead[c] === undefined ? null : lead[c]));
  const placeholders = INSERT_COLUMNS.map((_, i) => `$${i + 1}`).join(', ');
  const rows = await db.query(
    `INSERT INTO leads (${INSERT_COLUMNS.join(', ')}, mail_status)
     VALUES (${placeholders}, 'queued')
     RETURNING id, created_at`,
    values
  );
  return rows[0];
}

async function setMailStatus(db, id, status) {
  await db.query(
    `UPDATE leads
     SET mail_status = $2,
         mail_sent_at = CASE WHEN $2 = 'sent' THEN now() ELSE mail_sent_at END
     WHERE id = $1`,
    [id, status]
  );
}

// メールアドレス突合: 最も新しいレコードの booked_at を更新して true。
// 一致が無ければ false（呼び出し側で direct_booking を作成する）。
async function markBookedByEmail(db, email, bookedAt) {
  const rows = await db.query(
    `UPDATE leads
     SET booked_at = $2
     WHERE id = (
       SELECT id FROM leads
       WHERE lower(email) = lower($1)
       ORDER BY created_at DESC
       LIMIT 1
     )
     RETURNING id`,
    [email, bookedAt]
  );
  return rows.length > 0;
}

// 資料請求を経ない直接予約。破棄せず direct_booking として記録する（仕様 4-5）。
async function insertDirectBooking(db, { email, name, company, bookedAt, sourceUrl }) {
  const rows = await db.query(
    `INSERT INTO leads
       (company, name, email, asset_id, landing_url, form_url, consent_at, mail_status, booked_at)
     VALUES ($1, $2, $3, 'direct_booking', $4, $4, now(), 'sent', $5)
     RETURNING id`,
    [company || '（Spir予約・未取得）', name || '（Spir予約）', email, sourceUrl || 'spir:direct', bookedAt]
  );
  return rows[0];
}

// 資料ダウンロードを1件記録する（ダウンロード率の計測用）。
async function insertAssetDownload(db, { assetId, leadId, source }) {
  await db.query(
    `INSERT INTO asset_downloads (asset_id, lead_id, source)
     VALUES ($1, $2, $3)`,
    [assetId, leadId || null, source || null]
  );
}

// Webhook イベントの重複排除。初回なら true（処理してよい）、既出なら false。
async function claimWebhookEvent(db, eventId) {
  const rows = await db.query(
    `INSERT INTO webhook_events (id) VALUES ($1)
     ON CONFLICT (id) DO NOTHING
     RETURNING id`,
    [eventId]
  );
  return rows.length > 0;
}

module.exports = { insertLead, setMailStatus, markBookedByEmail, insertDirectBooking, claimWebhookEvent, insertAssetDownload, INSERT_COLUMNS };
