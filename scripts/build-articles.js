#!/usr/bin/env node
/*
 * 記事静的HTML生成スクリプト
 *
 * notes/notes.js（NOTES）と magazine/articles.js（ARTICLES）を読み込み、
 * templates/article.html をベースに記事ごとの静的ページを生成する:
 *   /notes/<slug>/index.html
 *   /magazine/<slug>/index.html
 *
 * 生成物には記事固有の <title> / meta description / OGP / canonical /
 * JSON-LD（Article + BreadcrumbList）/ パンくずリストを含む。
 * 一覧やヘッダー等のデザインは既存トンマナ（templates/article.html）を使用。
 *
 * 旧URL（/notes/article.html?id=…）は article.html 側の JS リダイレクトで
 * 新URLへ 転送される（後方互換として残置）。
 *
 *   実行: node scripts/build-articles.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://www.boatship.jp';
const TEMPLATE = fs.readFileSync(path.join(ROOT, 'templates', 'article.html'), 'utf8');

function loadGlobal(relFile, globalName) {
  const code = fs.readFileSync(path.join(ROOT, relFile), 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
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

function loadGlobalOptional(relFile, globalName) {
  if (!fs.existsSync(path.join(ROOT, relFile))) return [];
  try { return loadGlobal(relFile, globalName); } catch (e) { return []; }
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* "2026.07.10" → "2026-07-10" */
function isoDate(date) {
  const m = String(date || '').match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})/);
  if (!m) return null;
  return `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}`;
}

/* 記事データ内の相対パス（../images/…）を ルート絶対（/images/…）へ */
function rootify(p) {
  return String(p || '').replace(/^(\.\.\/)+/, '/');
}
function rootifyHtml(html) {
  return String(html || '').replace(/(src|href)="(\.\.\/)+/g, '$1="/');
}

/* meta description: excerpt を120文字に収める */
function toDescription(excerpt) {
  const s = String(excerpt || '').replace(/\s+/g, ' ').trim();
  return s.length <= 120 ? s : s.slice(0, 119) + '…';
}

function jsonldArticle(a, canonical, imageAbs) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: toDescription(a.excerpt),
    image: [imageAbs],
    datePublished: isoDate(a.date),
    dateModified: isoDate((a.kpi && a.kpi.recordedAt) || a.date) || isoDate(a.date),
    inLanguage: a.lang === 'en' ? 'en' : 'ja',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    author: { '@type': 'Organization', name: 'BOATship', url: BASE_URL + '/' },
    publisher: {
      '@type': 'Organization',
      name: 'BOATship',
      logo: { '@type': 'ImageObject', url: BASE_URL + '/images/logo.jpg' }
    }
  }, null, 2);
}

function jsonldBreadcrumb(sectionLabel, sectionUrl, title, canonical) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL + '/' },
      { '@type': 'ListItem', position: 2, name: sectionLabel, item: BASE_URL + sectionUrl },
      { '@type': 'ListItem', position: 3, name: title, item: canonical }
    ]
  }, null, 2);
}

/* notes/article.html と同じ Evidence ブロックの生成 */
function evidenceBlock(note) {
  if (!note.evidence || !note.evidence.length) return '';
  const items = note.evidence.map((ev) => {
    const title = ev.url
      ? `<a href="${esc(ev.url)}" target="_blank" rel="noopener">${esc(ev.title)} ↗</a>`
      : esc(ev.title);
    return `<li>${title}<span class="ev-source">${esc(ev.source)}</span></li>`;
  }).join('');
  const tuned = (note.kpi && note.kpi.recordedAt) ? note.kpi.recordedAt : note.date;
  const heading = note.lang === 'en' ? 'Evidence — References' : 'Evidence — 参考文献・エビデンス';
  const footnote = note.lang === 'en'
    ? `This note is tuned continuously based on academic evidence and real access metrics. Last tuned: ${esc(tuned)}`
    : `このNoteは学術エビデンスとアクセス実績にもとづき継続的にチューニングされます。最終チューニング: ${esc(tuned)}`;
  return (
    '<section class="evidence-block">' +
      `<div class="evidence-heading">${heading}</div>` +
      `<ol class="evidence-list">${items}</ol>` +
      `<p class="evidence-footnote">${footnote}</p>` +
    '</section>'
  );
}

/* テーマ連動CTA（Task 3-1: コンバージョン導線） */
const CTA_COPY = {
  'inner-branding': {
    heading: '理念浸透・組織づくりのご相談',
    body: 'インナーブランディングの設計について、貴社の状況に合わせてお話しします。'
  },
  'pr-planning': {
    heading: '広報企画・PR戦略のご相談',
    body: 'PESOモデルにもとづく広報設計を、まずは無料でご相談ください。'
  },
  'default': {
    heading: 'プロジェクトのご相談',
    body: '等価交換報酬制度でのご依頼も歓迎です。お金以外の対価もご提案ください。'
  }
};

function ctaBlock(a) {
  const theme = a.theme || 'general';
  if (a.lang === 'en') {
    return (
      `<section class="cta-block" data-article-id="${esc(a.id)}" data-theme="${esc(theme)}">` +
        '<h2 class="cta-heading">Work with BOATship</h2>' +
        '<p class="cta-body">We help international brands enter the Japanese market — brand development, company media production, and PR strategy. Equal exchange proposals are welcome.</p>' +
        '<a class="cta-btn" href="/en/contact/">Contact us →</a>' +
        '<p class="cta-sub"><a href="mailto:contact@boatship.jp">or email contact@boatship.jp</a></p>' +
      '</section>'
    );
  }
  const copy = CTA_COPY[a.theme] || CTA_COPY['default'];
  return (
    `<section class="cta-block" data-article-id="${esc(a.id)}" data-theme="${esc(theme)}">` +
      `<h2 class="cta-heading">${esc(copy.heading)}</h2>` +
      `<p class="cta-body">${esc(copy.body)}</p>` +
      '<a class="cta-btn" href="/contact/">相談する →</a>' +
      '<p class="cta-sub"><a href="mailto:contact@boatship.jp">contact@boatship.jp に直接メール</a></p>' +
    '</section>'
  );
}

/* CTAクリックを GA4 cta_click(article_id, theme) で計測 */
const CTA_TRACK_SCRIPT = `
<script>
(function () {
  var block = document.querySelector('.cta-block');
  if (!block) return;
  block.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'cta_click', {
          article_id: block.getAttribute('data-article-id'),
          theme: block.getAttribute('data-theme')
        });
      }
    });
  });
})();
</script>`;

const CTA_STYLE = `
.cta-block {
  max-width: 720px;
  margin: 0 auto 3rem;
  padding: 2rem 1.5rem;
  border: 2px solid currentColor;
  box-shadow: 6px 6px 0 currentColor;
  text-align: center;
}
.cta-heading {
  font-family: 'DotGothic16', sans-serif;
  font-size: 22px;
  margin: 0 0 0.8rem;
  line-height: 1.4;
}
.cta-body {
  font-size: 14px;
  line-height: 1.9;
  margin: 0 0 1.4rem;
}
.cta-btn {
  display: inline-block;
  padding: 0.8rem 2.2rem;
  border: 2px solid currentColor;
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.08em;
  color: inherit;
  text-decoration: none;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.cta-btn:hover {
  box-shadow: 4px 4px 0 currentColor;
  transform: translate(-2px, -2px);
}
.cta-sub {
  margin: 1rem 0 0;
  font-size: 12px;
}
.cta-sub a { color: inherit; text-decoration: underline; }
`;

/* 関連Note カード（Task 2-2: トピッククラスター化） */
function relatedBlock(note, allNotes) {
  if (!note.related || !note.related.length) return '';
  const cards = note.related.slice(0, 2).map((rid) => {
    const r = allNotes.find((n) => n.id === rid);
    if (!r) {
      console.warn(`warn: ${note.id} related "${rid}" not found`);
      return '';
    }
    const href = r.slug ? `/notes/${r.slug}/` : `/notes/article.html?id=${encodeURIComponent(r.id)}`;
    return (
      `<a class="related-card" href="${esc(href)}">` +
        `<span class="related-meta">${esc(r.date)} · ${esc(r.category)}</span>` +
        `<span class="related-title">${esc(r.title)}</span>` +
      '</a>'
    );
  }).join('');
  if (!cards) return '';
  return (
    '<section class="related-notes">' +
      '<div class="related-heading">Related — 関連Note</div>' +
      `<div class="related-grid">${cards}</div>` +
    '</section>'
  );
}

const NOTES_EXTRA_STYLE = `
.evidence-block {
  max-width: 720px;
  margin: 3rem auto 4rem;
  padding: 1.5rem;
  border: 2px solid currentColor;
}
.evidence-heading {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.evidence-list {
  margin: 0 0 1rem 1.2rem;
  padding: 0;
  font-size: 13px;
  line-height: 1.8;
}
.evidence-list li { margin-bottom: 0.6rem; }
.evidence-list .ev-source { display: block; font-size: 11px; opacity: 0.65; }
.evidence-list a { color: inherit; text-decoration: underline; }
.evidence-footnote {
  font-size: 11px;
  opacity: 0.6;
  line-height: 1.7;
  margin: 0;
}
.article-theme-chip {
  display: inline-block;
  margin-left: 0.6rem;
  padding: 2px 10px;
  border: 1px solid currentColor;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  vertical-align: middle;
}
.related-notes {
  max-width: 720px;
  margin: 0 auto 4rem;
}
.related-heading {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
.related-card {
  display: block;
  padding: 1rem 1.2rem;
  border: 2px solid currentColor;
  color: inherit;
  text-decoration: none;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.related-card:hover {
  box-shadow: 4px 4px 0 currentColor;
  transform: translate(-2px, -2px);
}
.related-card .related-meta {
  display: block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  opacity: 0.65;
  margin-bottom: 0.5rem;
}
.related-card .related-title {
  display: block;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.5;
}
`;

const THEME_LABEL = {
  'inner-branding': 'Inner Branding',
  'pr-planning': 'PR Planning',
  'culture': 'Culture'
};

/* magazine/article.html から Brutalism hero テンプレート(#03専用)を抽出して再利用 */
function extractBrutalismTemplate() {
  const src = fs.readFileSync(path.join(ROOT, 'magazine', 'article.html'), 'utf8');
  const m = src.match(/<template id="bru03">[\s\S]*?<\/template>/);
  if (!m) throw new Error('bru03 template not found in magazine/article.html');
  return m[0];
}

const BRU_SCALE_SCRIPT = `
<script>
(function () {
  var tpl = document.getElementById('bru03');
  var slot = document.getElementById('bru-slot');
  if (tpl && slot) {
    slot.appendChild(document.importNode(tpl.content, true));
    function scaleBru() {
      var frame = document.getElementById('bruFrame');
      var inner = document.getElementById('bruScale');
      if (frame && inner) {
        inner.style.transform = 'scale(' + (frame.clientWidth / 1200) + ')';
      }
    }
    scaleBru();
    window.addEventListener('resize', scaleBru);
  }
})();
</script>`;

function heroBlockFor(a, kind) {
  const isTech = a.category && String(a.category).toLowerCase() === 'tech';
  if (isTech) {
    return '<div class="article-tech-hero-block"><div class="article-tech-hero-inner"><span class="article-tech-hero-word">TECH</span></div></div>';
  }
  if (kind === 'magazine' && a.id === '03') {
    return '<div id="bru-slot"></div>';
  }
  const img = rootify(kind === 'magazine' ? a.hero : a.image);
  return `<div class="article-hero-wrap"><img src="${esc(img)}" alt="${esc(a.title)}" class="article-hero-img"></div>`;
}

function render(tokens) {
  let out = TEMPLATE;
  for (const [key, value] of Object.entries(tokens)) {
    out = out.split('{{' + key + '}}').join(value);
  }
  // 未使用トークンは空に
  out = out.replace(/\{\{[A-Z_]+\}\}/g, '');
  return out;
}

function writePage(kind, a, allNotes, alternates) {
  if (!a.slug) {
    console.warn(`skip: ${kind} ${a.id} has no slug`);
    return null;
  }
  const isEn = kind === 'en-notes';
  const isNotes = kind === 'notes' || isEn;
  const sectionUrl = isEn ? '/en/notes/' : (kind === 'notes' ? '/notes/' : '/magazine/');
  const sectionLabel = isEn ? 'Notes (EN)' : (kind === 'notes' ? 'Notes' : 'Magazines');
  const backUrl = isEn ? '/en/about/' : sectionUrl;
  const backLabel = isEn ? '← About BOATship' : (kind === 'notes' ? '← Notes に戻る' : '← Magazines に戻る');
  const canonical = `${BASE_URL}${sectionUrl}${a.slug}/`;
  const imageAbs = BASE_URL + rootify(kind === 'magazine' ? (a.og || a.hero) : a.image);
  const title = `${a.title} | BOATship`;

  const themeChip = (isNotes && a.theme)
    ? `<span class="article-theme-chip">${esc(THEME_LABEL[a.theme] || a.theme)}</span>`
    : '';

  const content =
    `<div id="note-root">` +
    `<a href="${backUrl}" class="back-to-mag">${backLabel}</a>` +
    '<section class="article-page-hero">' +
      `<span class="article-category-badge">${esc(a.category)}</span>` + themeChip +
      `<h1 class="article-page-title">${esc(a.title)}</h1>` +
      '<div class="article-meta">' +
        `<span>${esc(a.date)}</span>` +
        `<span>${esc(a.readTime)} min read</span>` +
        `<span>${esc(a.num)}</span>` +
      '</div>' +
    '</section>' +
    heroBlockFor(a, kind) +
    `<article class="article-body">${rootifyHtml(a.body)}</article>` +
    (isNotes ? evidenceBlock(a) : '') +
    ctaBlock(a) +
    (kind === 'notes' ? relatedBlock(a, allNotes) : '') +
    `<div id="article-end" style="height:1px;" data-article-id="${esc(a.id)}" data-read-time="${esc(a.readTime)}"></div>` +
    `<a href="${backUrl}" class="back-to-mag" style="margin-bottom:4rem;">${backLabel}</a>` +
    `</div>`;

  let extraBody = '';
  let extraScripts = '';
  if (kind === 'notes') {
    // localStorage 計測（admin Insights 用）は既存 analytics.js を流用
    extraScripts =
      '<script src="/notes/analytics.js"></script>\n' +
      '<script>\n' +
      '(function () {\n' +
      '  if (!window.BSNotesAnalytics) return;\n' +
      `  BSNotesAnalytics.trackView(${JSON.stringify(a.id)});\n` +
      "  var endEl = document.getElementById('article-end');\n" +
      "  if (endEl && 'IntersectionObserver' in window) {\n" +
      '    var completed = false;\n' +
      '    var io = new IntersectionObserver(function (entries) {\n' +
      '      entries.forEach(function (entry) {\n' +
      '        if (entry.isIntersecting && !completed) {\n' +
      '          completed = true;\n' +
      `          BSNotesAnalytics.trackReadComplete(${JSON.stringify(a.id)});\n` +
      '          io.disconnect();\n' +
      '        }\n' +
      '      });\n' +
      '    }, { threshold: 0 });\n' +
      '    io.observe(endEl);\n' +
      '  }\n' +
      '})();\n' +
      '</script>';
  }
  if (kind === 'magazine' && a.id === '03') {
    extraBody = extractBrutalismTemplate();
    extraScripts = BRU_SCALE_SCRIPT;
  }

  // hreflang（日英対応がある記事のみ）
  let alternatesHtml = '';
  if (alternates) {
    alternatesHtml =
      `<link rel="alternate" hreflang="ja" href="${alternates.ja}">\n` +
      `<link rel="alternate" hreflang="en" href="${alternates.en}">\n` +
      `<link rel="alternate" hreflang="x-default" href="${alternates.ja}">`;
  }

  const html = render({
    LANG: isEn ? 'en' : 'ja',
    TITLE: esc(title),
    OG_TITLE: esc(title),
    DESCRIPTION: esc(toDescription(a.excerpt)),
    CANONICAL: canonical,
    ALTERNATES: alternatesHtml,
    OG_IMAGE: esc(imageAbs),
    JSONLD_ARTICLE: jsonldArticle(a, canonical, imageAbs),
    JSONLD_BREADCRUMB: jsonldBreadcrumb(sectionLabel, isEn ? '/en/about/' : sectionUrl, a.title, canonical),
    SECTION_URL: isEn ? '/en/about/' : sectionUrl,
    SECTION_LABEL: sectionLabel,
    BREADCRUMB_TITLE: esc(a.title),
    NEWSLETTER_SUB: isEn ? 'New work and stories from the studio, by email.' : '新着の制作事例やMagazinesをメールでお届け。',
    NEWSLETTER_NOTE: isEn ? '* No spam. Unsubscribe anytime.' : '* スパムは送りません。いつでも解除できます。',
    EXTRA_STYLE: CTA_STYLE + (isNotes ? NOTES_EXTRA_STYLE : ''),
    ARTICLE_CONTENT: content,
    EXTRA_BODY: extraBody,
    EXTRA_SCRIPTS: extraScripts + CTA_TRACK_SCRIPT
  });

  const dir = isEn
    ? path.join(ROOT, 'en', 'notes', a.slug)
    : path.join(ROOT, kind === 'notes' ? 'notes' : 'magazine', a.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  return `${sectionUrl}${a.slug}/`;
}

function build() {
  const notes = loadGlobal('notes/notes.js', 'NOTES');
  const articles = loadGlobal('magazine/articles.js', 'ARTICLES');
  const notesEn = loadGlobalOptional('notes/notes-en.js', 'NOTES_EN');

  // 日英対応表（sourceId → EN 記事）から hreflang URL を作る
  const altFor = (jaNote, enNote) => ({
    ja: `${BASE_URL}/notes/${jaNote.slug}/`,
    en: `${BASE_URL}/en/notes/${enNote.slug}/`
  });
  const enBySource = new Map(notesEn.filter((e) => e.sourceId).map((e) => [e.sourceId, e]));

  const written = [];
  notes.forEach((n) => {
    const en = enBySource.get(n.id);
    const u = writePage('notes', n, notes, en && n.slug ? altFor(n, en) : null);
    if (u) written.push(u);
  });
  articles.forEach((a) => { const u = writePage('magazine', a, notes); if (u) written.push(u); });
  notesEn.forEach((e) => {
    const src = notes.find((n) => n.id === e.sourceId);
    const u = writePage('en-notes', e, notes, src && src.slug ? altFor(src, e) : null);
    if (u) written.push(u);
  });
  console.log(`generated ${written.length} article pages:`);
  written.forEach((u) => console.log('  ' + u));
}

build();
