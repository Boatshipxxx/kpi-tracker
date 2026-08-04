'use strict';
// lib/db.js が @neondatabase/serverless の API を正しく呼べているかの回帰テスト。
//
// 既存のテストはすべてメモリDBを注入していたため、実ドライバの呼び方の誤り
// （sql.query は存在しない → "sql.query is not a function" で本番500）を
// 検出できなかった。ここでは fetch をスタブして実ドライバを通す。
const { test } = require('node:test');
const assert = require('node:assert');

const FAKE_URL = 'postgres://user:pass@ep-test.ap-southeast-1.aws.neon.tech/neondb';

function withStubbedFetch(fn) {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify({
      command: 'SELECT', rowCount: 0, rows: [], fields: [],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  return Promise.resolve(fn(calls)).finally(() => { globalThis.fetch = original; });
}

function freshDbModule() {
  // getDb() は接続をキャッシュするため、テストごとに読み直す
  delete require.cache[require.resolve('../lib/db')];
  return require('../lib/db');
}

test('neon ドライバは .query() メソッドを持たない（この前提が壊れたら実装を見直す）', () => {
  const { neon } = require('@neondatabase/serverless');
  const sql = neon(FAKE_URL);
  assert.strictEqual(typeof sql, 'function');
  assert.strictEqual(typeof sql.query, 'undefined',
    'sql.query が生えたらドライバのAPIが変わっている。lib/db.js の呼び方を確認すること');
});

test('getDb().query() が実ドライバ経由でHTTPリクエストまで到達する', async () => {
  process.env.DATABASE_URL = FAKE_URL;
  const { getDb } = freshDbModule();

  await withStubbedFetch(async (calls) => {
    // ここで "sql.query is not a function" が出ると本番の500と同じ失敗
    await getDb().query('SELECT $1::int AS n', [1]);
    assert.strictEqual(calls.length, 1, 'Neonへのリクエストが1回発行される');
    assert.match(calls[0].url, /neon\.tech/);

    const body = JSON.parse(calls[0].init.body);
    assert.strictEqual(body.query, 'SELECT $1::int AS n', 'SQL文がそのまま渡る');
    // Neon の HTTP API はパラメータを文字列にして送る（型は SQL 側のキャストで解決）
    assert.deepStrictEqual(body.params, ['1'], 'パラメータが配列で渡る');
  });
});

test('パラメータ無しのクエリも発行できる', async () => {
  process.env.DATABASE_URL = FAKE_URL;
  const { getDb } = freshDbModule();

  await withStubbedFetch(async (calls) => {
    await getDb().query('SELECT 1');
    assert.strictEqual(calls.length, 1);
    assert.strictEqual(JSON.parse(calls[0].init.body).query, 'SELECT 1');
  });
});

test('DATABASE_URL 未設定なら getDb() が throw する', () => {
  delete process.env.DATABASE_URL;
  const { getDb } = freshDbModule();
  assert.throws(() => getDb(), /DATABASE_URL is not set/);
});
