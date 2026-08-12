// 資料カタログ。原本は assets/data/lead-assets.json（クライアントと共有）。
// 資料を追加するときは JSON に1件足すだけでよい。
'use strict';

const catalog = require('../assets/data/lead-assets.json');

const SITE_ORIGIN = process.env.SITE_ORIGIN || 'https://www.boatship.jp';

function getAsset(assetId) {
  const a = catalog[assetId];
  if (!a) return null;
  // 作成中の資料は請求・ダウンロードの対象にしない（フォームには「近日公開」として表示される）
  if (a.comingSoon) return null;
  return {
    id: assetId,
    title: a.title,
    url: SITE_ORIGIN + a.url,
    path: a.url,
    // PDF実体。メールのリンクはこちらを優先する（ページ遷移ではなく直接ダウンロード）
    downloadUrl: a.download ? SITE_ORIGIN + a.download : SITE_ORIGIN + a.url,
    downloadPath: a.download || a.url,
  };
}

module.exports = { getAsset, catalog, SITE_ORIGIN };
