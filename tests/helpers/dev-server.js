// オフラインE2E用の開発サーバー。
// 静的ファイルを配信し、/api/lead は「本物のハンドラ」(api/lead.js) を
// メモリDB差し替えで動かす。Resend/Slack は環境変数未設定のため
// 実送信されず、メール失敗パス（mail_status='failed'）が通る。
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

// --- api/lead.js を require する前に依存を差し替える ---
const { createMemoryDb } = require('./memory-db');
const memoryDb = createMemoryDb();

const dbModulePath = require.resolve(path.join(ROOT, 'lib', 'db.js'));
require.cache[dbModulePath] = {
  id: dbModulePath, filename: dbModulePath, loaded: true,
  exports: { getDb: () => memoryDb },
};
const vfPath = require.resolve('@vercel/functions');
require.cache[vfPath] = {
  id: vfPath, filename: vfPath, loaded: true,
  exports: { waitUntil: (p) => { Promise.resolve(p).catch(() => {}); } },
};

const leadHandler = require(path.join(ROOT, 'api', 'lead.js'));

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain',
};

function wrapRes(res) {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
  return res;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/lead') {
    await leadHandler(req, wrapRes(res));
    return;
  }
  // テストからDBの中身を覗くための検査用エンドポイント
  if (url.pathname === '/__test/leads') {
    wrapRes(res).status(200).json(memoryDb.rows);
    return;
  }

  let filePath = path.join(ROOT, decodeURIComponent(url.pathname));
  if (url.pathname.endsWith('/')) filePath = path.join(filePath, 'index.html');
  if (!filePath.startsWith(ROOT)) { res.statusCode = 403; res.end(); return; }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.statusCode = 404; res.end('not found'); return; }
    res.setHeader('Content-Type', MIME[path.extname(filePath)] || 'application/octet-stream');
    res.end(data);
  });
});

const PORT = Number(process.env.PORT || 8877);
server.listen(PORT, () => console.log(`dev server: http://127.0.0.1:${PORT}`));

module.exports = { server, memoryDb };
