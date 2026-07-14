#!/usr/bin/env node
/*
 * KPI転記スクリプト（月次運用の半自動化）
 *
 * GA4 からエクスポートした記事別CSVを読み込み、notes/notes.js の各記事の
 * kpi フィールド（views / readRate / reactions / recordedAt）を更新する。
 *
 * 使い方:
 *   node scripts/update-kpi.js <csvファイル> [--target notes|news] [--date YYYY.MM.DD] [--dry-run]
 *
 * --target news を指定すると news/news.js の NEWS 配列の kpi
 * （views / readRate / recordedAt。reactions は無し）を更新する。
 * article_id は news の id（pr01 / an01 など）。既定は notes。
 *
 * CSVフォーマット（1行目はヘッダー。列順は自由・大文字小文字不問）:
 *   article_id, views, read_complete [, reactions]
 *   例:
 *     article_id,views,read_complete,reactions
 *     n05,320,150,12
 *     n07,180,95,4
 *
 * - article_id … notes.js の id（n01 など）。未知のidは警告してスキップ
 * - views      … 記事の表示回数（GA4: page_view 等の実数）
 * - read_complete … 読了イベント数（GA4カスタムイベント read_complete の回数）
 * - reactions  … 反応数（任意列。note.com のスキ等を手動で足してよい。
 *                無い場合は既存値を維持）
 * - readRate は views と read_complete から自動計算（%・小数1桁）
 * - recordedAt は --date 指定がなければ実行日（YYYY.MM.DD）
 *
 * GA4側のエクスポート手順は README「KPIの月次転記」を参照。
 * 実行後は差分を確認してブランチ+PRで公開する（mainへ直接pushしない）。
 *
 * 将来課題: GA4 Data API 直接続（認証が絡むためフェーズ6ではCSV半自動）。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGETS = {
  notes: { file: path.join(ROOT, 'notes', 'notes.js'), idRe: /id:\s*"(n\d+)"/g, hasReactions: true },
  news:  { file: path.join(ROOT, 'news', 'news.js'),  idRe: /id:\s*"([a-z]+\d+)"/g, hasReactions: false }
};

function fail(msg) {
  console.error('エラー: ' + msg);
  process.exit(1);
}

/* ---- 引数 ---- */
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
let target = 'notes';
const targetIdx = args.indexOf('--target');
if (targetIdx !== -1) {
  target = args[targetIdx + 1];
  if (!TARGETS[target]) fail('--target は notes か news を指定してください');
}
const TARGET = TARGETS[target];
let recordedAt = null;
const dateIdx = args.indexOf('--date');
if (dateIdx !== -1) {
  recordedAt = args[dateIdx + 1];
  if (!/^\d{4}\.\d{2}\.\d{2}$/.test(recordedAt || '')) fail('--date は YYYY.MM.DD 形式で指定してください');
}
const csvPath = args.find((a) => !a.startsWith('--') && a !== recordedAt && a !== target);
if (!csvPath) fail('CSVファイルを指定してください: node scripts/update-kpi.js <csv> [--target notes|news] [--date YYYY.MM.DD] [--dry-run]');
if (!fs.existsSync(csvPath)) fail('CSVが見つかりません: ' + csvPath);
if (!recordedAt) {
  const d = new Date();
  recordedAt = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

/* ---- CSV 読み込み（クォート対応の簡易パーサ） ---- */
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQ = false;
      else cell += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((v) => v.trim() !== '')) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((v) => v.trim() !== '')) rows.push(row);
  return rows;
}

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
if (rows.length < 2) fail('CSVにデータ行がありません');

const header = rows[0].map((h) => h.trim().toLowerCase().replace(/[^a-z_]/g, ''));
function colIndex(...names) {
  for (const n of names) {
    const i = header.indexOf(n);
    if (i !== -1) return i;
  }
  return -1;
}
const idCol = colIndex('article_id', 'articleid', 'id');
const viewsCol = colIndex('views', 'view', 'pageviews', 'page_view');
const rcCol = colIndex('read_complete', 'read_completes', 'readcomplete', 'readcompletes');
const reactCol = colIndex('reactions', 'reaction');
if (idCol === -1) fail('CSVヘッダーに article_id 列がありません');
if (viewsCol === -1) fail('CSVヘッダーに views 列がありません');
if (rcCol === -1) fail('CSVヘッダーに read_complete 列がありません');

/* ---- notes.js 更新 ---- */
let src = fs.readFileSync(TARGET.file, 'utf8');
const knownIds = [...src.matchAll(TARGET.idRe)].map((m) => m[1]);

const summary = [];
for (const r of rows.slice(1)) {
  const id = (r[idCol] || '').trim();
  if (!id) continue;
  if (!knownIds.includes(id)) {
    console.warn(`警告: ${path.basename(TARGET.file)} に id "${id}" が見つかりません。スキップします。`);
    continue;
  }
  const views = parseInt(r[viewsCol], 10);
  const rc = parseInt(r[rcCol], 10);
  if (!Number.isFinite(views) || views < 0) { console.warn(`警告: ${id} の views が数値ではありません。スキップ。`); continue; }
  if (!Number.isFinite(rc) || rc < 0) { console.warn(`警告: ${id} の read_complete が数値ではありません。スキップ。`); continue; }
  const readRate = views > 0 ? Math.round((rc / views) * 1000) / 10 : 0;

  // 既存 kpi から reactions を引き継ぐ（CSVに reactions 列があれば上書き）
  const noteStart = src.indexOf(`id: "${id}"`);
  const kpiMatch = src.slice(noteStart).match(/kpi:\s*(\{[^}]*\})/);
  if (!kpiMatch) { console.warn(`警告: ${id} の kpi フィールドが見つかりません。スキップ。`); continue; }
  let prevReactions = null;
  try { prevReactions = JSON.parse(kpiMatch[1]).reactions; } catch (e) { /* 既存が不正でも続行 */ }
  let reactions = prevReactions;
  if (reactCol !== -1 && String(r[reactCol] || '').trim() !== '') {
    const rx = parseInt(r[reactCol], 10);
    if (Number.isFinite(rx) && rx >= 0) reactions = rx;
  }

  const newKpi = TARGET.hasReactions
    ? JSON.stringify({ views, readRate, reactions: reactions == null ? null : reactions, recordedAt })
    : JSON.stringify({ views, readRate, recordedAt });
  const abs = noteStart + kpiMatch.index;
  src = src.slice(0, abs) + `kpi: ${newKpi}` + src.slice(abs + kpiMatch[0].length);
  summary.push({ id, views, read_complete: rc, readRate: readRate + '%', reactions: TARGET.hasReactions ? (reactions == null ? '(維持)' : reactions) : '(対象外)' });
}

if (!summary.length) fail('更新対象がありませんでした（CSVの内容を確認してください）');

console.log(`\n更新内容（recordedAt = ${recordedAt}）:`);
console.table(summary);

if (dryRun) {
  console.log(`--dry-run のため ${path.basename(TARGET.file)} は変更していません。`);
} else {
  fs.writeFileSync(TARGET.file, src);
  // 構文チェック
  try {
    new (require('vm').Script)(fs.readFileSync(TARGET.file, 'utf8'), { filename: path.basename(TARGET.file) });
  } catch (e) {
    fail(`更新後の ${path.basename(TARGET.file)} が構文エラーです。git checkout で戻してください: ` + e.message);
  }
  console.log(`${path.relative(ROOT, TARGET.file)} を更新しました（${summary.length}件）。`);
  console.log('次の手順: git diff で確認 → ブランチを切ってコミット → PR作成（mainへ直接pushしない）');
}
