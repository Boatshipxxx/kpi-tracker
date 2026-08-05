// POST /api/lead — 資料請求フォームの受け口（仕様 4-2）。
//
// 処理順序は仕様で固定されている:
//   1. 検証（失敗はフィールド単位で返す）
//   2. leads に保存（mail_status='queued'）
//   3. 応答（サンクスページへの遷移。メール送信の完了を待たない）
//   4. 非同期でメール送信 → mail_status に反映
//   5. 非同期でSlack通知
// DB保存に失敗したときだけはサンクスページに進ませない（リードが消えるため）。
'use strict';

const { waitUntil } = require('@vercel/functions');
const { getDb } = require('../lib/db');
const { insertLead, setMailStatus } = require('../lib/leads-db');
const { validateLeadInput, isSpam } = require('../lib/lead-validation');
const { getAsset } = require('../lib/lead-assets');
const { sendLeadMail } = require('../lib/mailer');
const { notifyNewLead, notifyMailFailure } = require('../lib/notify-slack');

function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 64 * 1024) reject(new Error('body too large')); });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

function trimOrNull(v, max = 2000) {
  const s = String(v || '').trim();
  return s ? s.slice(0, max) : null;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    res.status(400).json({ error: 'リクエストの形式が正しくありません。ページを再読み込みしてお試しください。' });
    return;
  }

  // --- スパム判定（ユーザー向けフィールドエラーとしては返さない） ---
  const spam = isSpam(body);
  if (spam === 'honeypot') {
    // bot に手がかりを与えないため、正常時と同じ応答を返す（保存はしない）
    res.status(200).json({ ok: true, redirect: thanksUrl(body) });
    return;
  }
  if (spam) {
    res.status(400).json({
      error: 'フォームの読み込みからの時間が短すぎます。数秒おいて、もう一度「資料をダウンロード」を押してください。',
    });
    return;
  }

  // --- 1. 検証 ---
  const { errors, values } = validateLeadInput(body);
  const asset = getAsset(String(body.asset_id || ''));
  if (!asset) errors.asset_id = '資料の指定が正しくありません。記事のダウンロードボタンからやり直してください。';
  if (Object.keys(errors).length > 0) {
    res.status(422).json({ errors });
    return;
  }

  // --- 2. 保存（queued） ---
  const formUrl = trimOrNull(body.form_url) || trimOrNull(req.headers.referer) || '/request/';
  const lead = {
    ...values,
    asset_id: asset.id,
    // landing_url が無い（Cookie不発・直接流入）場合はフォームURLを流入元とみなす
    landing_url: trimOrNull(body.landing_url) || formUrl,
    form_url: formUrl,
    referrer: trimOrNull(body.referrer),
    utm_source: trimOrNull(body.utm_source, 200),
    utm_medium: trimOrNull(body.utm_medium, 200),
    utm_campaign: trimOrNull(body.utm_campaign, 200),
    consent_at: new Date().toISOString(),
  };

  let saved;
  try {
    saved = await insertLead(getDb(), lead);
  } catch (err) {
    // 仕様 6: DB保存失敗はサンクスページに進めてはいけない
    console.error('[lead] DB保存失敗:', err.message);
    res.status(500).json({
      error: '送信を保存できませんでした。お手数ですが、少し時間をおいて再送信してください。解決しない場合は contact@boatship.jp までご連絡ください。',
    });
    return;
  }

  // --- 3. 応答（メール送信を待たない） ---
  res.status(200).json({ ok: true, redirect: thanksUrl(body) });

  // --- 4・5. 応答後にメール送信とSlack通知 ---
  waitUntil(afterResponse({ saved, lead, asset }));
};

function thanksUrl(body) {
  const id = encodeURIComponent(String(body.asset_id || ''));
  return `/thanks/?asset=${id}`;
}

async function afterResponse({ saved, lead, asset }) {
  const db = getDb();

  // Slack: 新規リード通知（メール送信より先。反応速度優先）
  await notifyNewLead({
    company: lead.company,
    name: lead.name,
    assetId: asset.id,
    landingUrl: lead.landing_url,
  });

  // 自動返信メール → 結果を mail_status に反映
  try {
    await sendLeadMail({
      to: lead.email,
      company: lead.company,
      name: lead.name,
      assetTitle: asset.title,
      assetUrl: asset.url,
      assetDownloadUrl: asset.downloadUrl,
    });
    await setMailStatus(db, saved.id, 'sent');
  } catch (err) {
    console.error('[lead] メール送信失敗:', err.message);
    try {
      await setMailStatus(db, saved.id, 'failed');
    } catch (e2) {
      console.error('[lead] mail_status更新も失敗:', e2.message);
    }
    await notifyMailFailure({
      company: lead.company,
      name: lead.name,
      email: lead.email,
      leadId: saved.id,
      reason: err.message,
    });
  }
}
