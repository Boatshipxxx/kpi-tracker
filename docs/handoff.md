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

### Task 3-2 問い合わせページ — ✅ 完了（PR: claude/session2-contact）
- `/contact/index.html` を新規作成（既存トンマナ・ルート絶対パス・GA4タグ付き）。
- Googleフォームは**埋め込みプレースホルダ**（人間がフォーム作成→iframe差し替え。手順は README「問い合わせページ / Googleフォームのセットアップ」に記載。項目案: お名前/会社名(任意)/メール/ご相談カテゴリ(ブランディング・広報PR・Web制作・等価交換・その他)/内容）。
- 「お問い合わせ後の流れ」（2営業日以内に返信 → 30分の無料相談 → ご提案）を明記。
- フォーム未設置の間は contact@boatship.jp への直メール導線を表示。
- sitemap に `/contact/` を追加（22 URLs）。英語版 `/en/contact/` はフェーズ4（Task 4-1）で対応。
- **人間の作業**: Googleフォームの作成と iframe 差し替え（README 手順参照）。
### Task 6-1 KPI転記スクリプト — ✅ 完了（PR: claude/session2-kpi-script）
- `scripts/update-kpi.js`: GA4エクスポートCSV（article_id, views, read_complete[, reactions]）を読み、notes.js の kpi を更新。readRate自動計算 / recordedAt指定（--date）/ --dry-run / 未知id警告スキップ / 更新後構文チェック付き。
- README「KPIの月次転記」にGA4エクスポート手順・CSV形式・実行手順を記載（月次30分以内を想定）。
- GA4 Data API 直接続は将来課題としてREADMEに明記（当面CSV半自動）。
- **人間の月次作業**: 月末にGA4からCSV作成 → スクリプト実行 → PR。

### Task 6-2 月次レビュー雛形 — ✅ 完了（PR: claude/session2-monthly-review）
- `docs/monthly-review-template.md`: 当月PV / 流入元内訳 / 読了率上位・下位3記事 / tuningMemo更新 / 翌月テーマ / 問い合わせ件数（国内・海外別、2027.03目標比）の記入欄。
- `reviews/2026-07.md` に初回分（7月）の雛形を配置。

## セッション② 完了サマリー
- 全タスクのPRを作成済み（スタック構成）。**マージ順: #25 → #26 → #27 → #28 → #29 → #30 → #31 → #32**。
  先行PRのマージ後、後続PRの base を main に切り替えると差分がタスク単位になる。
- 次セッション（③）: フェーズ4（EN基本ページ / n01英訳）→ フェーズ5（SEO Note 2本 / プレスリリース）のドラフト作成。
  「docs/handoff.md と指示書を読んでセッション③を再開して」で続行可能。

### 残作業（人間）
- Google Search Console 登録・所有権確認・sitemap 送信（Task 1-2 マージ後）
- PR #25 / #26 / セッション②PR のレビューとマージ（上記の順）

## セッション③ — フェーズ4（EN）→ フェーズ5（コンテンツ）ドラフト

### Task 4-1 英語版基本ページ — ✅ 完了（PR: claude/session3-en-pages）
- `/en/about/`（会社紹介 + サービス3本柱: Brand development for the Japanese market / Company media production / PR strategy）と `/en/contact/` を新規作成。トーンは Cross-cultural Voice（直訳ではなく海外企業・エージェント向けに再構成。事実は about/notes の既存記載のみ使用）。
- hreflang（ja / en / x-default=ja）を EN 2ページ + 対応JPページ（/about/・/contact/）に相互設定。
- 言語切替: ENページのヘッダーに「JP」、JPの about/contact ヘッダーに「EN」リンクを追加。
- `/en/` は `/en/about/` へリダイレクト（noindex）。sitemap に /en/about/・/en/contact/ を追加（24 URLs）。
- 検証: Playwright で lang属性・hreflang×3・3本柱・言語切替・リダイレクトを確認。
- **人間の作業**: 英文の通読承認（PRレビュー）。英語版Googleフォームを作る場合は /en/contact/ の iframe 差し替え。

### Task 4-2 n01 英訳記事 — ✅ 完了（PR: claude/session3-en-article）
- **設計判断**: 英語記事は `notes/notes-en.js`（`NOTES_EN` 配列）に分離。admin・週次workflowが触る notes.js を汚染せず、`sourceId` で日本語記事と紐付け（保守性優先）。
- `/en/notes/equal-exchange-compensation/` を静的生成（build-articles.js が NOTES_EN を読み `en-notes` として生成。lang=en / EN CTA（→/en/contact/）/ EN Evidence見出し / EN newsletter文言 / related無し）。
- hreflang: ja n01（/notes/equivalent-exchange-compensation/）↔ en 記事を相互設定（x-default=ja）。EN版が無い記事には hreflang を付けない。
- タイトルは3案から**案1をドラフト採用**（PRで人間が選択）: ①Why We Accept Vegetables as Payment ②Design Work, Paid in Vegetables ③Beyond Money。
- 直訳ではなく再構成。海外読者向け補足（地方の生産者の文脈 / お互いさま）を追加。「円でも支払可」を明記。
- sitemap に EN記事を追加（25 URLs）。workflow paths に notes-en.js 追加。
- **人間の作業**: 英文通読 + タイトル3案からの選択（PRレビュー）。

### Task 5-1 SEO特化Note 2本 — ✅ ドラフト完了（PR: claude/session3-seo-notes）
- **n08**「インナーブランディングの施策10選 — 認知・共感・行動の3段階」（Playbook / inner-branding / slug: inner-branding-initiatives）
  - 想定KW「インナーブランディング 施策」。認知→共感→行動 × 具体施策10選。n05/n07へ内部リンク。evidence 4件（Kahn 1990 / Meyer & Allen 1991 / Kotter 1995 / Schein 2010、全て実在）。
- **n09**「広報企画の立て方 — 企画書テンプレート7項目」（Playbook / pr-planning / slug: pr-planning-proposal-template）
  - 想定KW「広報企画 立て方」。n06のPESO前提で企画書7項目を順番に解説。n06/n02へ内部リンク。evidence 3件（Grunig & Hunt 1984 / Cutlip et al. 2012 / AMEC 2016、全て実在）。
- 両記事とも n05〜n07 の品質基準（冒頭200字で読者と価値 / h2だけで要旨 / 末尾チェックリスト / tuningMemoに想定KWと差し替え案）を踏襲。related設定・ビルド・sitemap反映済み（27 URLs）。
- **人間の作業**: 記事内容の承認（PRレビュー。マージ＝公開）。

### Task 5-2 プレスリリース原稿 — ✅ ドラフト完了（PR: claude/session3-press-release）
- `docs/press-release/equal-exchange-pr-times.md`: PR TIMESフォーマット（タイトル27字 + サブタイトル / 本文約1,700字 / 画像挿入位置3箇所指定 / 制度概要・始めた理由・実例2つ（農家×野菜、シェアオフィス×利用権）・代表コメント枠）。事実は n01/n04 の既存記載のみ使用。
- `docs/press-release/equal-exchange-note-version.md`: note.com 転載用（柔らかめの一人称）。
- `docs/press-release/distribution-memo.md`: 配信先選定メモ（**PR TIMESスタートアップチャレンジの適用条件確認を促す一文**、配信タイミング定石、Owned/Shared併用、Earned個別アプローチ候補、配信後フォロー）。
- **人間の作業**: 代表コメント・所在地番地・画像3点の差し替え → PR TIMES入稿・配信、note転載。

## セッション③ 完了サマリー
- 全タスクのPRを作成済み（スタック構成）。**マージ順: #34（EN基本ページ）→ #35（n01英訳）→ #36（SEO Note 2本）→ #37（プレスリリース）**。
- 人間レビュー待ち: #34 英文通読 / #35 英文通読 + タイトル3案選択 / #36 記事2本の内容承認（マージ＝公開）/ #37 代表コメント等の差し替え。
- これで指示書の最小3セッション計画（①②③）の Claude 作業は完遂。以降は週次自動更新 + 月次KPI運用のループ。
