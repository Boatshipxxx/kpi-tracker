// Neon への接続。Vercel Marketplace の Neon 統合が設定する DATABASE_URL を使う。
// （旧 Vercel Postgres / @vercel/postgres は終了しているため使用しない）
'use strict';

let cached = null;

function getDb() {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  const { neon } = require('@neondatabase/serverless');
  const sql = neon(url);
  // neon() が返すのはタグ付きテンプレート関数で、`.query()` メソッドは持たない。
  // ただし「通常の関数」としても呼べ、その場合は $1,$2… の
  // パラメータ化クエリと値の配列を渡す形になる（既定では行の配列を返す）。
  // sql.query(...) と書くと実行時に "sql.query is not a function" になるので注意。
  cached = { query: (text, params) => sql(text, params) };
  return cached;
}

module.exports = { getDb };
