#!/usr/bin/env node
// leads テーブルを作成する（冪等）。
// 使い方: DATABASE_URL=postgres://... npm run setup:leads-db
'use strict';

const fs = require('fs');
const path = require('path');

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL が設定されていません。Neon の接続文字列を環境変数で渡してください。');
    process.exit(1);
  }
  const { neon } = require('@neondatabase/serverless');
  const sql = neon(url);
  const ddl = fs.readFileSync(path.join(__dirname, 'leads-schema.sql'), 'utf8');
  // neon() は複文を受け付けないため、ステートメント単位に分割して実行する
  const statements = ddl
    .split(/;\s*(?:\n|$)/)
    .map((s) => s.replace(/^--.*$/gm, '').trim())
    .filter(Boolean);
  // neon() が返す関数は `.query()` を持たない。通常の関数として呼ぶ（lib/db.js 参照）。
  for (const stmt of statements) {
    await sql(stmt);
  }
  const [{ count }] = await sql('SELECT count(*)::int AS count FROM leads');
  console.log(`leads テーブル準備完了（現在 ${count} 件）`);
}

main().catch((err) => {
  console.error('セットアップ失敗:', err.message);
  process.exit(1);
});
