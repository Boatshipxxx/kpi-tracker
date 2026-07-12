# Handoff — オウンドメディア整備（docs/claude_code_instruction_prompt.md 準拠）

セッションをまたいで進捗を引き継ぐためのチェックポイント記録。各タスク完了時に更新する。

## セッション① — リポジトリ調査 → フェーズ1 → slug対応表の提案

### リポジトリ調査（前提の実態）
- 静的サイト。ホスティングは **Vercel**（`vercel.json`: `trailingSlash:true` / `cleanUrls:false` / apex→www リダイレクト）。ドメインは `www.boatship.jp`。GitHub Pages ではない（`.nojekyll` は存在するが未使用）。
- 記事データはクライアントサイド JS で描画:
  - Notes: `notes/notes.js` の `NOTES` 配列 → `notes/index.html` / `notes/article.html`（`?id=` で描画）
  - Magazine: `magazine/articles.js` の `ARTICLES` 配列 → `magazine/article.html`（`?id=` で描画）
- 既存のアクセス計測: `notes/analytics.js`（localStorage、Cookie不使用）。admin の 📊 Insights が使用。→ **GA4 read-tracking とは別系統として併存**。

### Task 1-1 読了率計測スクリプト — ✅ 完了（本PR）
- `assets/js/read-tracking.js` を新規追加（自己完結 IIFE）。
  - `scroll_depth`（25/50/75/90%）と `read_complete`（`#article-end` 可視 かつ 滞在 ≥ readTime×60×0.5秒）を GA4 に送信。
  - 重複発火は `sessionStorage`（`sd:` / `rc:`）で防止。`?debug=1` で console ログ。
- `notes/article.html` / `magazine/article.html`:
  - `<head>` に gtag スニペット（測定ID = **プレースホルダ `G-XXXXXXXXXX`**、人間が差し替え）。
  - 本文末尾に `<div id="article-end" data-article-id data-read-time>` センチネルを埋め込み。
  - `read-tracking.js` を読み込み。
- README に「読了率計測（GA4）」節を追加（イベント表・差し替え手順・デバッグ）。
- 検証（Playwright / `file://`）: notes n07・magazine 01 の両方で scroll_depth 25/50/75/90 と read_complete が発火することを確認。

**✅ GA4測定ID差し替え済み（G-P4HKHJ91Z5）**: 人間が GA4 プロパティ／ウェブデータストリーム（boatship.jp）を作成し、PR #25 ブランチ上で `notes/article.html`（commit d98078c）と `magazine/article.html`（commit 5b68924）のプレースホルダを実IDに差し替え済み。README の手順記載も「設定済み」に更新済み（da1da19）。計測開始は PR #25 の main マージ → Vercel デプロイ後。動作確認は本番記事 URL に `?debug=1` を付けて `[read-tracking]` ログで行う。

### Task 1-2 sitemap + robots — ⏳ 未着手
- Vercel 前提のため、生成した `sitemap.xml` / `robots.txt` をコミットする方針（GitHub Actions で自動生成する場合も成果物をコミット）。

### Task 2-1 slug対応表の提案 — ⏳ 未着手（セッション①の終了条件 = 人間承認待ちで STOP）
- Notes / Magazine 全記事の slug 対応表を提案し、**人間の承認を待って停止**する。
