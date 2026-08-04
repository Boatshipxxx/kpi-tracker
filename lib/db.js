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
  cached = { query: (text, params) => sql.query(text, params) };
  return cached;
}

module.exports = { getDb };
