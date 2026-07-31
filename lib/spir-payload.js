// Spir Webhook ペイロードの読み取り。
//
// 【重要】Spir の Webhook ペイロードの正式なスキーマは、利用申込の承認後に
// 実際の送信内容で確認すること（docs/lead-capture-setup.md の人間タスク参照）。
// スキーマが確定するまでは、キー名に依存しない防御的なパースを行う:
//   - メールアドレス: ペイロード全体を走査し、email 形式の文字列を収集
//   - 空き時間URLの識別子: ペイロード全体の文字列に設定済み識別子が含まれるか
//   - 確定日時: start を意味するキー配下の ISO 日時文字列
// 実スキーマ確認後、この層だけを正確なキー参照に書き換えれば良い。
'use strict';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

// 自社ドメイン（主催者側）のアドレスは参加者として扱わない
const ORGANIZER_DOMAINS = (process.env.SPIR_ORGANIZER_DOMAINS || 'boatship.jp')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

function walkStrings(obj, visit, depth = 0) {
  if (depth > 8 || obj == null) return;
  if (typeof obj === 'string') { visit(obj, null); return; }
  if (Array.isArray(obj)) { obj.forEach((v) => walkStrings(v, visit, depth + 1)); return; }
  if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string') visit(v, k.toLowerCase());
      else walkStrings(v, visit, depth + 1);
    }
  }
}

function extractAttendeeEmails(payload) {
  const emails = [];
  walkStrings(payload, (s) => {
    const v = s.trim().toLowerCase();
    if (EMAIL_RE.test(v) && !emails.includes(v)) emails.push(v);
  });
  return emails.filter((e) => !ORGANIZER_DOMAINS.some((d) => e.endsWith('@' + d)));
}

// 設定された空き時間URL識別子のうち、ペイロードに含まれるものを返す
function matchUrlId(payload, ids) {
  let hit = null;
  walkStrings(payload, (s) => {
    if (hit) return;
    for (const id of ids) {
      if (id && s.includes(id)) { hit = id; return; }
    }
  });
  return hit;
}

function extractStartTime(payload) {
  let best = null;
  walkStrings(payload, (s, key) => {
    if (!ISO_RE.test(s.trim())) return;
    const isStartKey = key && /start|begin|from/.test(key);
    if (isStartKey && !best) best = s.trim();
  });
  if (best) return best;
  // start系キーが見つからなければ、最初のISO日時を使う
  walkStrings(payload, (s) => {
    if (!best && ISO_RE.test(s.trim())) best = s.trim();
  });
  return best;
}

function extractName(payload) {
  let name = null;
  walkStrings(payload, (s, key) => {
    if (!name && key && /(^|_)name$/.test(key) && s.trim() && !EMAIL_RE.test(s.trim())) name = s.trim();
  });
  return name;
}

const COMPANY_RE = /(company|organization|会社|団体)/i;

function extractCompany(payload, depth = 0) {
  // Spir の質問フォーム「会社・団体名」の回答を拾う。
  // 2つの形に対応する:
  //   a) キー名自体が会社を表す: { company: "◯◯" }
  //   b) 質問と回答のペア: { label: "会社・団体名", answer: "◯◯" }
  if (depth > 8 || payload == null || typeof payload !== 'object') return null;
  if (Array.isArray(payload)) {
    for (const v of payload) {
      const hit = extractCompany(v, depth + 1);
      if (hit) return hit;
    }
    return null;
  }
  const entries = Object.entries(payload);
  // b) 質問+回答ペア
  const labelEntry = entries.find(([k, v]) => typeof v === 'string' && /(label|question|title|name)/i.test(k) && COMPANY_RE.test(v));
  if (labelEntry) {
    const ansEntry = entries.find(([k, v]) => typeof v === 'string' && /(answer|value|text|response)/i.test(k) && v.trim());
    if (ansEntry) return ansEntry[1].trim();
  }
  // a) キー名が会社を表す
  for (const [k, v] of entries) {
    if (typeof v === 'string' && COMPANY_RE.test(k) && v.trim()) return v.trim();
  }
  for (const [, v] of entries) {
    const hit = extractCompany(v, depth + 1);
    if (hit) return hit;
  }
  return null;
}

module.exports = { extractAttendeeEmails, matchUrlId, extractStartTime, extractName, extractCompany };
