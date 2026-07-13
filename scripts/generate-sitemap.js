#!/usr/bin/env node
/*
 * sitemap.xml / robots.txt 生成スクリプト
 *
 * Notes（notes/notes.js の NOTES）と Magazine（magazine/articles.js の
 * ARTICLES）を読み込み、静的ページ + 各記事ページの URL を含む
 * sitemap.xml と robots.txt をリポジトリ直下に出力する。
 *
 * ホスティングは Vercel（vercel.json: trailingSlash:true / cleanUrls:false）。
 * 記事ページはクライアントサイド描画のため URL は
 *   /notes/article.html?id=<id>  /  /magazine/article.html?id=<id>
 * となる（拡張子・クエリを保持）。
 *
 * 記事データが増減しても本スクリプトを再実行すれば sitemap は追従する。
 *   実行: node scripts/generate-sitemap.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://www.boatship.jp';

/* notes.js / articles.js は `const NAME = [...]` のブラウザ用グローバル定義。
 * Node の module ではないため、vm サンドボックスで評価して配列を取り出す。 */
function loadGlobal(relFile, globalName) {
  const code = fs.readFileSync(path.join(ROOT, relFile), 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  /* `const NAME = [...]` は vm 内で lexical binding になり sandbox の
   * プロパティには載らないため、同一スクリプト末尾で globalThis に写す。 */
  const marker = '__export_' + globalName;
  vm.runInContext(
    code + `\n;globalThis[${JSON.stringify(marker)}] = typeof ${globalName} !== 'undefined' ? ${globalName} : undefined;`,
    sandbox,
    { filename: relFile }
  );
  const value = sandbox[marker];
  if (!Array.isArray(value)) {
    throw new Error(`${globalName} not found or not an array in ${relFile}`);
  }
  return value;
}

/* "2026.07.10" / "2026-07-10" → "2026-07-10"（W3C Datetime）。不正値は null。 */
function toLastmod(date) {
  if (!date) return null;
  const m = String(date).match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
  if (!m) return null;
  const y = m[1];
  const mo = String(m[2]).padStart(2, '0');
  const d = String(m[3]).padStart(2, '0');
  return `${y}-${mo}-${d}`;
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(loc, lastmod, changefreq, priority) {
  let out = '  <url>\n';
  out += `    <loc>${xmlEscape(BASE_URL + loc)}</loc>\n`;
  if (lastmod) out += `    <lastmod>${lastmod}</lastmod>\n`;
  if (changefreq) out += `    <changefreq>${changefreq}</changefreq>\n`;
  if (priority) out += `    <priority>${priority}</priority>\n`;
  out += '  </url>\n';
  return out;
}

function build() {
  const notes = loadGlobal('notes/notes.js', 'NOTES');
  const articles = loadGlobal('magazine/articles.js', 'ARTICLES');
  let notesEn = [];
  if (fs.existsSync(path.join(ROOT, 'notes', 'notes-en.js'))) {
    try { notesEn = loadGlobal('notes/notes-en.js', 'NOTES_EN'); } catch (e) { notesEn = []; }
  }

  // 記事一覧の最終更新日（一覧ページの lastmod に使う）
  const latest = (items) =>
    items
      .map((it) => toLastmod(it.date))
      .filter(Boolean)
      .sort()
      .pop() || null;

  const today = new Date().toISOString().slice(0, 10);

  const entries = [];
  // 静的ページ（/admin/ は非公開のため除外）
  entries.push(urlEntry('/', today, 'weekly', '1.0'));
  entries.push(urlEntry('/about/', today, 'monthly', '0.6'));
  entries.push(urlEntry('/works/', today, 'monthly', '0.7'));
  entries.push(urlEntry('/contact/', today, 'monthly', '0.7'));
  entries.push(urlEntry('/en/about/', today, 'monthly', '0.6'));
  entries.push(urlEntry('/en/contact/', today, 'monthly', '0.6'));
  entries.push(urlEntry('/notes/', latest(notes) || today, 'weekly', '0.9'));
  entries.push(urlEntry('/magazine/', latest(articles) || today, 'weekly', '0.8'));

  // 記事URL: slug があれば静的生成ページ（/notes/<slug>/）、なければ旧クエリ形式
  const articleLoc = (section, it) =>
    it.slug
      ? `/${section}/${it.slug}/`
      : `/${section}/article.html?id=${encodeURIComponent(it.id)}`;

  // Notes 記事
  notes.forEach((n) => {
    entries.push(urlEntry(articleLoc('notes', n), toLastmod(n.date), 'monthly', '0.8'));
  });
  // Magazine 記事
  articles.forEach((a) => {
    entries.push(urlEntry(articleLoc('magazine', a), toLastmod(a.date), 'monthly', '0.6'));
  });
  // 英語版 Notes 記事
  notesEn.forEach((e) => {
    if (e.slug) entries.push(urlEntry(`/en/notes/${e.slug}/`, toLastmod(e.date), 'monthly', '0.6'));
  });

  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!-- 自動生成: scripts/generate-sitemap.js（手で編集しないこと） -->\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries.join('') +
    '</urlset>\n';

  const robots =
    '# 自動生成: scripts/generate-sitemap.js（手で編集しないこと）\n' +
    'User-agent: *\n' +
    'Allow: /\n' +
    'Disallow: /admin/\n' +
    '\n' +
    `Sitemap: ${BASE_URL}/sitemap.xml\n`;

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
  fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots);

  console.log(
    `generated sitemap.xml (${entries.length} URLs) and robots.txt ` +
      `[notes:${notes.length} magazine:${articles.length}]`
  );
}

build();
