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

### Task 2-1 slug対応表の提案 — ✅ 承認済み（2026-07-12）
- 提案した英語ケバブケース slug（notes 7件 + magazine 9件）とパス形式URL（`/notes/<slug>/`・旧`?id=`からのリダイレクト）を人間が承認。

**✅ 2026-07-13 更新: GA4実ID設定済み（G-P4HKHJ91Z5）/ #25・#26 マージ済み**
- #25（read-tracking）・#26（sitemap/robots）は main にマージコミット方式でマージ済み。旧 `notes/article.html`・`magazine/article.html` の測定IDは実値設定済み。
- `templates/article.html` と生成済み全16ページ（`/notes/<slug>/`・`/magazine/<slug>/`）も実ID（G-P4HKHJ91Z5）で生成済み（プレースホルダ残存なし）。
- #27〜#32 は最新 main を取り込んでスタックを載せ直し済み。マージ順: **#27 → #28 → #29 → #30 → #31 → #32**。

## セッション② — Task 2-1 実装 → 2-2 → フェーズ3 → フェーズ6

### Task 2-1 記事の静的HTML生成 — ✅ 完了（PR: claude/session2-static-articles）
- `notes/notes.js` / `magazine/articles.js` の全記事に承認済み `slug` を追加。
- `templates/article.html`（共通テンプレート、ルート絶対パス）+ `scripts/build-articles.js` で `/notes/<slug>/index.html`・`/magazine/<slug>/index.html` を生成（16ページ）。
  - 記事固有 title（「タイトル | BOATship」）/ description（excerpt 120字）/ OGP / canonical / JSON-LD（Article + BreadcrumbList）/ 可視パンくず / GA4 gtag（G-P4HKHJ91Z5）/ read-tracking センチネル / notes は evidence ブロック + localStorage 計測も継承。
  - magazine #03 の Brutalism ヒーローは magazine/article.html の `<template id="bru03">` をビルド時に抽出して再利用。Tech カテゴリのヒーローも再現。
- 旧URL互換: `notes/article.html` / `magazine/article.html` に slug があれば canonical + meta refresh + `location.replace` で新URLへ転送する処理を追加。
- 一覧のリンクを slug URL へ変更（notes/index.html は描画コード、magazine/index.html は9件のハードコードリンク）。
- sitemap 生成を slug URL 優先に更新し再生成。workflow を「Build articles & sitemap」に拡張（記事ビルド + sitemap を1ワークフローで実行し main にコミット）。
- 検証: 構造チェック16ページ全パス + ローカルHTTPサーバー/Playwright で新URL描画・scroll_depth発火・旧URLリダイレクト・一覧リンクを確認。
- **注意（ブランチ構成）**: セッション②のPRは #25・#26 の上に積んだスタックPR。**#25 → #26 → セッション②PR の順にマージ**すること。

### Task 2-2 内部リンク / トピッククラスター — ✅ 完了（PR: claude/session2-related-links）
- notes 全7記事に `related`（2件）を追加。関連付け（theme一致優先 + 本文内容）:
  n01→[n04,n07] / n02→[n06,n03] / n03→[n01,n02] / n04→[n01,n03] / n05→[n07,n06] / n06→[n05,n02] / n07→[n05,n01]
  ※人間承認は PR レビューで実施（指示書ルール4に従いセッションは止めない）
- 本文中の関連概念に内部リンクを各2本追加（文章は無改変・リンク化のみ、機械検証済み）。
- build-articles.js に「Related — 関連Note」カード（2件・既存トンマナ）を追加し再ビルド。
- notes-weekly.yml のプロンプトに slug / related の設定を追記（今後の自動記事もクラスターに参加）。
### Task 3-1 テーマ連動CTA — ✅ 完了（PR: claude/session2-cta）
- build-articles.js に CTA ブロック（Evidence と関連Noteカードの間）を追加。theme で文言を出し分け:
  inner-branding「理念浸透・組織づくりのご相談」/ pr-planning「広報企画・PR戦略のご相談」/ その他・magazine「プロジェクトのご相談」
- ボタン「相談する →」→ `/contact/`（Task 3-2 で作成）+ サブリンク contact@boatship.jp
- クリックは GA4 `cta_click`（article_id, theme）で計測（Playwright で発火確認済み）。
- デザインは既存トンマナ（2pxボーダー + ハードシャドウ、DotGothic16 見出し、新色なし）。

### Task 3-2 問い合わせページ — ⏳ 次
### Task 6-1 KPI転記スクリプト — ⏳ / Task 6-2 月次レビュー雛形 — ⏳

### 残作業（人間）
- Google Search Console 登録・所有権確認・sitemap 送信（Task 1-2 マージ後）
- PR #25 / #26 / セッション②PR のレビューとマージ（上記の順）
