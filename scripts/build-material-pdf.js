#!/usr/bin/env node
// 資料ページ（/materials/<id>/）から配布用PDFを生成する。
//
// 生成物はリポジトリにコミットして静的配信する（資料の更新頻度は低く、
// ビルドのたびに生成する必要がないため）。資料ページを編集したら再実行すること:
//   node scripts/build-material-pdf.js
//
// 前提: playwright と Chromium が使えること（開発環境のみ。CIでは不要）。
//       日本語フォント（Noto Sans JP 等）がOSに入っていないと文字化けする。
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 8123;

// 生成対象: 資料ID → 出力ファイル名（assets/data/lead-assets.json の download と一致させる）
const TARGETS = [
  { id: 'pr-planning-template', out: 'boatship-pr-planning-template.pdf' },
];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
};

function loadPlaywright() {
  try { return require('playwright'); } catch {}
  try { return require('/opt/node22/lib/node_modules/playwright'); } catch {}
  throw new Error('playwright が見つかりません。npm i -D playwright するか、グローバルインストールしてください。');
}

async function main() {
  const server = http.createServer((req, res) => {
    let p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (p.endsWith('/')) p = path.join(p, 'index.html');
    fs.readFile(p, (err, data) => {
      if (err) { res.statusCode = 404; res.end(); return; }
      res.setHeader('Content-Type', MIME[path.extname(p)] || 'application/octet-stream');
      res.end(data);
    });
  });
  await new Promise((r) => server.listen(PORT, r));

  const { chromium } = loadPlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // 外部リソース（Google Fonts / GA4）には依存しない。
  // フォントはOSにインストール済みのものが family 名で解決される。
  await page.route('**/*', (r) => {
    const h = new URL(r.request().url()).hostname;
    if (h !== '127.0.0.1' && h !== 'localhost') return r.abort();
    r.continue();
  });

  for (const t of TARGETS) {
    await page.goto(`http://127.0.0.1:${PORT}/materials/${t.id}/`, { waitUntil: 'load' });
    await page.emulateMedia({ media: 'print' });
    const outPath = path.join(ROOT, 'materials', t.id, t.out);
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '14mm', bottom: '16mm', left: '12mm', right: '12mm' },
    });
    const buf = fs.readFileSync(outPath);
    const kb = Math.round(buf.length / 1024);
    // ページ数は改ページ制御（印刷CSSの break-inside: avoid）の効き具合の目安。
    // 大きく増えたら項目がページを跨いでいないか目視で確認すること。
    const pages = (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log(`generated: materials/${t.id}/${t.out} (${kb} KB / ${pages} pages)`);
  }

  await browser.close();
  server.close();
}

main().catch((e) => { console.error('PDF生成失敗:', e.message); process.exit(1); });
