'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { buildMail } = require('../lib/mailer');
const { getAsset } = require('../lib/lead-assets');

const PARAMS = {
  company: 'テスト株式会社',
  name: '高坂',
  assetTitle: '広報企画書テンプレート7項目',
  assetUrl: 'https://www.boatship.jp/materials/pr-planning-template/',
  assetDownloadUrl: 'https://www.boatship.jp/materials/pr-planning-template/boatship-pr-planning-template.pdf',
};

test('メールの主リンクはPDF直接ダウンロード（ページ遷移ではない）', () => {
  const m = buildMail(PARAMS);
  // text/html の両方（multipart）に PDF のフルURLが載る
  assert.ok(m.text.includes(PARAMS.assetDownloadUrl), 'text版にPDFリンク');
  assert.ok(m.html.includes(PARAMS.assetDownloadUrl), 'html版にPDFリンク');
  // 補助としてWeb版へのリンクも残す
  assert.ok(m.text.includes(PARAMS.assetUrl), 'text版にWeb版リンク');
  assert.ok(m.html.includes(PARAMS.assetUrl), 'html版にWeb版リンク');
  // PDFリンクがWeb版より先に出る（主導線）
  assert.ok(m.text.indexOf('.pdf') < m.text.indexOf('※ ブラウザで読む'), 'PDFが先');
});

test('downloadUrl が無い資料はページURLにフォールバックする', () => {
  const m = buildMail({ ...PARAMS, assetDownloadUrl: undefined });
  assert.ok(m.text.includes(PARAMS.assetUrl));
});

test('カタログの pr-planning-template は PDF実体を持ち、ファイルが実在する', () => {
  const a = getAsset('pr-planning-template');
  assert.ok(a.downloadPath.endsWith('.pdf'), 'download がPDFを指す');
  const fs = require('fs');
  const path = require('path');
  const file = path.join(__dirname, '..', a.downloadPath);
  assert.ok(fs.existsSync(file), 'PDFファイルがリポジトリに存在する');
  const head = fs.readFileSync(file).subarray(0, 5).toString();
  assert.strictEqual(head, '%PDF-', 'PDFヘッダで始まる');
});
