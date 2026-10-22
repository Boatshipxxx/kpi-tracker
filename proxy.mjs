// Routing Middleware — /admin/ への Basic 認証ゲート
//
// 目的: 管理画面のパスワードを配信HTMLに一切含めないこと。
//   以前は admin/index.html に平文のパスワードを埋めていたため、
//   ページのソースを見れば誰でも読める状態だった（＝認証として機能しない）。
//   静的ページ内のJS判定はどう書いても閲覧者側で回避できるため、
//   判定はエッジ（ここ）で行い、正解値は Vercel の環境変数にだけ置く。
//
// 必要な環境変数（Vercel → Settings → Environment Variables）:
//   ADMIN_PASSWORD  必須。未設定なら 503 で閉じる（フェイルクローズ）
//   ADMIN_USER      任意。既定は "admin"
//
// 適用範囲は vercel.json の proxy.matcher で /admin 配下のみに限定している。
// サイト全体に掛けるとリード獲得導線や記事まで塞いでしまうため広げないこと。
//
// ※ ESM(.mjs) である必要がある。このプロジェクトはフレームワーク未使用で
//    api/*.js・lib/*.js が CommonJS のため、package.json に "type": "module"
//    を足すとそれらが壊れる。拡張子を .mjs にすることで共存させている。

import { next } from '@vercel/functions';

const REALM = 'BOATship Admin';

function unauthorized() {
  return new Response('Unauthorized\n', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
      // 認証前のページを検索エンジンに拾わせない
      'X-Robots-Tag': 'noindex, nofollow',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

// 一致/不一致で処理時間が変わらない比較（総当たりの手掛かりを与えない）。
// 長さが違う場合も最後まで走査する。
function safeEqual(a, b) {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  let diff = x.length ^ y.length;
  const len = Math.max(x.length, y.length);
  for (let i = 0; i < len; i += 1) {
    diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  }
  return diff === 0;
}

// "Basic dXNlcjpwYXNz" → { user, pass }。壊れていれば null。
function parseBasicAuth(header) {
  if (typeof header !== 'string') return null;
  const m = /^Basic\s+(.+)$/i.exec(header.trim());
  if (!m) return null;
  let decoded;
  try {
    decoded = atob(m[1]);
  } catch {
    return null;
  }
  const i = decoded.indexOf(':');
  if (i < 0) return null;
  return { user: decoded.slice(0, i), pass: decoded.slice(i + 1) };
}

export default function proxy(request) {
  const expectedPass = process.env.ADMIN_PASSWORD;
  const expectedUser = process.env.ADMIN_USER || 'admin';

  // 設定漏れで管理画面が丸見えになるのを防ぐ。通す側に倒さない。
  if (!expectedPass) {
    console.error('[proxy] ADMIN_PASSWORD が未設定のため /admin/ を閉じました');
    return new Response('Service Unavailable\n', {
      status: 503,
      headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const creds = parseBasicAuth(request.headers.get('authorization'));
  if (!creds) return unauthorized();

  // 短絡評価にしない（どちらが違うかを応答時間から推測させない）
  const okUser = safeEqual(creds.user, expectedUser);
  const okPass = safeEqual(creds.pass, expectedPass);
  if (!(okUser && okPass)) return unauthorized();

  // 認証済み。管理画面はCDNにもブラウザにも残さない。
  return next({
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
