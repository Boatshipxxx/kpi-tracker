'use strict';
// /api/spir-webhook のトークン検証（回帰テスト）。
//
// 背景: 以前は「SPIR_WEBHOOK_TOKEN が設定されているときだけ検証する」実装で、
// 本番では未設定だったため実質無認証だった。偽の event.confirmed を投げるだけで
// 任意アドレスへの予約確定メール送信・既存リードの booked_at 書き換え・Slack通知の
// 発火ができてしまう状態だったため、未設定時は通さない仕様に変更した。
// その仕様が将来うっかり戻らないよう、ここで固定する。
const { test } = require('node:test');
const assert = require('node:assert');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ハンドラは DB / Slack / メールに触れる前にトークン検証を行う。
// 検証で弾かれる経路しか踏まないので、依存は読み込まれるだけで呼ばれない。
const handler = require(path.join(ROOT, 'api', 'spir-webhook.js'));

// Vercel のハンドラに渡る req/res の最小スタブ。
// body を渡すと readBody がストリームを読まずにそのまま解決する。
function makeReq(url, method = 'POST', body) {
  return { method, url, body, headers: { 'content-type': 'application/json' }, on() {} };
}
function makeRes() {
  const res = { statusCode: null, body: null, headers: {} };
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (b) => { res.body = b; return res; };
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.end = () => res;
  return res;
}

async function call(url, token, method = 'POST', body) {
  const saved = process.env.SPIR_WEBHOOK_TOKEN;
  if (token === undefined) delete process.env.SPIR_WEBHOOK_TOKEN;
  else process.env.SPIR_WEBHOOK_TOKEN = token;
  const res = makeRes();
  try {
    await handler(makeReq(url, method, body), res);
  } finally {
    if (saved === undefined) delete process.env.SPIR_WEBHOOK_TOKEN;
    else process.env.SPIR_WEBHOOK_TOKEN = saved;
  }
  return res;
}

test('SPIR_WEBHOOK_TOKEN 未設定なら 503 で拒否する（フェイルクローズ）', async () => {
  const res = await call('/api/spir-webhook', undefined);
  assert.strictEqual(res.statusCode, 503);
  assert.strictEqual(res.body.error, 'webhook not configured');
});

test('トークン無しのリクエストは 401', async () => {
  const res = await call('/api/spir-webhook', 'secret-token');
  assert.strictEqual(res.statusCode, 401);
  assert.strictEqual(res.body.error, 'unauthorized');
});

test('トークンが違えば 401', async () => {
  for (const bad of ['', 'wrong', 'secret-toke', 'secret-tokenX', 'SECRET-TOKEN']) {
    const res = await call(`/api/spir-webhook?token=${encodeURIComponent(bad)}`, 'secret-token');
    assert.strictEqual(res.statusCode, 401, `token=${bad} が通ってしまった`);
  }
});

test('GET は 405（トークン検証より前に弾く）', async () => {
  const res = await call('/api/spir-webhook?token=secret-token', 'secret-token', 'GET');
  assert.strictEqual(res.statusCode, 405);
});

test('正しいトークンならトークン検証を通過する', async () => {
  // 対象外イベント（空ボディ）なので後段は 200 で黙って無視される。
  // ここで確認したいのは 401/503 で止まらないこと。
  const res = await call('/api/spir-webhook?token=secret-token', 'secret-token', 'POST', {});
  assert.notStrictEqual(res.statusCode, 401);
  assert.notStrictEqual(res.statusCode, 503);
  assert.strictEqual(res.statusCode, 200);
});
