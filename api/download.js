// GET /api/download?asset=<資料ID>&src=<mail|thanks|material>&lid=<lead uuid>
//
// 資料PDFへのリダイレクト経由でダウンロードを記録する（ダウンロード率の計測用）。
// メール本文・サンクスページ・資料ページのDLリンクはすべてここを指す。
//
// 設計上の絶対条件: 計測がダウンロードを妨げてはいけない。
//   - 記録は応答後に waitUntil で行う（DB障害でもリダイレクトは成立する）
//   - lid / src が不正でも黙って無視して記録だけ落とす
'use strict';

const { waitUntil } = require('@vercel/functions');
const { getDb } = require('../lib/db');
const { insertAssetDownload } = require('../lib/leads-db');
const { getAsset } = require('../lib/lead-assets');

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SOURCES = ['mail', 'thanks', 'material'];

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const url = new URL(req.url, 'http://localhost');
  const asset = getAsset(String(url.searchParams.get('asset') || ''));
  if (!asset) {
    // 不明な資料IDはフォームへ誘導（リンク切れよりまし）
    res.status(302).setHeader('Location', '/request/');
    res.end();
    return;
  }

  const lidRaw = String(url.searchParams.get('lid') || '');
  const leadId = UUID_RE.test(lidRaw) ? lidRaw : null;
  const srcRaw = String(url.searchParams.get('src') || '');
  const source = SOURCES.includes(srcRaw) ? srcRaw : 'other';

  // --- 先にリダイレクト（PDFは /materials/*.pdf の Content-Disposition: attachment で即DLになる） ---
  res.status(302);
  res.setHeader('Location', asset.downloadPath);
  res.setHeader('Cache-Control', 'no-store');
  res.end();

  // --- 応答後に記録 ---
  waitUntil(
    insertAssetDownload(getDb(), { assetId: asset.id, leadId, source })
      .catch((err) => console.error('[download] 記録失敗（DLは成立済み）:', err.message))
  );
};
