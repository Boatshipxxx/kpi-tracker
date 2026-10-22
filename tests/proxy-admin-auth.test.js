'use strict';
// proxy.ts（Routing Middleware）の /admin/ Basic 認証の回帰テスト。
//
// 背景: 以前は admin/index.html に平文パスワードを埋めてJSで判定していたため、
// ページのソースを見れば誰でも読めた（＝認証として機能していなかった）。
// 判定をエッジに移し、正解値は環境変数 ADMIN_PASSWORD にだけ置く構成にした。
// ここではその判定が緩まないことを固定する。
//
// proxy.ts は TypeScript だが、Node 22.18+ は型ストリップが既定で有効なため
// 追加のフラグもビルド手順も無しに dynamic import できる。
const { test } = require('node:test');
const assert = require('node:assert');
const path = require('path');

const PROXY = path.join(__dirname, '..', 'proxy.ts');

const req = (auth) => new Request('https://www.boatship.jp/admin/', {
  headers: auth ? { authorization: auth } : {},
});
const basic = (u, p) => 'Basic ' + Buffer.from(`${u}:${p}`).toString('base64');

// 環境変数を差し替えてミドルウェアを呼ぶ。
// proxy.ts は process.env を呼び出しごとに読むので、再importは不要。
async function callProxy(authHeader, { password = 'test-password', user } = {}) {
  const savedPw = process.env.ADMIN_PASSWORD;
  const savedUser = process.env.ADMIN_USER;
  if (password === null) delete process.env.ADMIN_PASSWORD;
  else process.env.ADMIN_PASSWORD = password;
  if (user === undefined) delete process.env.ADMIN_USER;
  else process.env.ADMIN_USER = user;
  try {
    const { default: proxy } = await import(PROXY);
    return proxy(req(authHeader));
  } finally {
    if (savedPw === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = savedPw;
    if (savedUser === undefined) delete process.env.ADMIN_USER;
    else process.env.ADMIN_USER = savedUser;
  }
}

test('認証ヘッダが無ければ 401 と WWW-Authenticate を返す', async () => {
  const res = await callProxy(undefined);
  assert.strictEqual(res.status, 401);
  assert.match(res.headers.get('www-authenticate'), /^Basic realm="BOATship Admin"/);
  assert.strictEqual(res.headers.get('x-robots-tag'), 'noindex, nofollow');
});

test('パスワードが違えば 401', async () => {
  for (const bad of ['', 'wrong', 'test-passwor', 'test-passwordX', 'TEST-PASSWORD']) {
    const res = await callProxy(basic('admin', bad));
    assert.strictEqual(res.status, 401, `pass=${bad} が通ってしまった`);
  }
});

test('旧パスワードでは入れない', async () => {
  const res = await callProxy(basic('admin', 'boatship2026'));
  assert.strictEqual(res.status, 401);
});

test('ユーザー名が違えば 401', async () => {
  const res = await callProxy(basic('root', 'test-password'));
  assert.strictEqual(res.status, 401);
});

test('壊れた Authorization ヘッダでも例外を投げず 401', async () => {
  const broken = [
    'Basic',
    'Basic !!!!',
    'Bearer token',
    'Basic ' + Buffer.from('colonless').toString('base64'),
    '',
  ];
  for (const h of broken) {
    const res = await callProxy(h);
    assert.strictEqual(res.status, 401, `header=${JSON.stringify(h)} が通ってしまった`);
  }
});

test('正しい資格情報なら通過する', async () => {
  const res = await callProxy(basic('admin', 'test-password'));
  assert.notStrictEqual(res.status, 401);
  assert.notStrictEqual(res.status, 503);
});

test('ADMIN_USER で利用者名を変えられる', async () => {
  assert.strictEqual((await callProxy(basic('boatship', 'test-password'), { user: 'boatship' })).status, 200);
  assert.strictEqual((await callProxy(basic('admin', 'test-password'), { user: 'boatship' })).status, 401);
});

test('ADMIN_PASSWORD 未設定なら 503 で閉じる（フェイルクローズ）', async () => {
  const res = await callProxy(basic('admin', 'test-password'), { password: null });
  assert.strictEqual(res.status, 503);
});

test('パスワードが空文字でも未設定扱いで閉じる', async () => {
  const res = await callProxy(basic('admin', ''), { password: '' });
  assert.strictEqual(res.status, 503);
});
