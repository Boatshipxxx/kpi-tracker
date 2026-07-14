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

## セッション④ — /news/ 基盤と外部配信（追加発注）

### 前提確認（設計判断）
- **build-news.js は新設せず `scripts/build-articles.js` を拡張**（テンプレート・CTA・JSON-LD・エスケープ・workflow が集約済みのため。複製＝新しい仕組みの発明を回避）。
- 一覧は notes/index.html と同じクライアント描画方式を流用。JSON-LD のみ `NewsArticle` に切り替え。

### Task 7-1 /news/ セクション新設 — ✅ 完了（PR: claude/session4-news）
- `news/news.js`（NEWS配列: type / slug / subtitle / body / distribution / mediaOutlet / externalUrl / isBacklink / kpi）。初回エントリとして an01（サイト刷新のお知らせ・事実ベース）を収録。
- build-articles.js 拡張: press-release / announcement を `/news/<slug>/` に静的生成（NewsArticle JSON-LD / パンくず Home>News / 読了計測センチネル / CTA=default文言 / distribution にURLがあれば「掲載先」ブロック自動表示）。
- `news/index.html`: type別フィルタ付き一覧。media-coverage は外部リンク表示（Backlinkチップ付き）。
- グローバルナビに「News」追加（テンプレート + トップ/works/notes/magazine/contact/about + 旧article.html）。トップに Latest News（最新3件、news.js から描画）。
- sitemap に /news/ と個別ページを追加（29 URLs）。workflow paths に news/news.js 追加。
- 検証: NewsArticle/BreadcrumbList のJSON-LDパース・フィルタ動作・トップLatest News・全navを Playwright で確認。

### Task 7-2 プレスリリース原本 + 媒体別派生版 — ✅ 完了（PR: claude/session4-press-content）
- **原本**: news.js に pr01（press-release / slug: equal-exchange-compensation-launch / 本文1,851字）。リード200字 → 制度概要 → 対象と対価 → 始めた理由（n01へ内部リンク・重複なし）→ 実例2つ → 半年の知見（n04リンク）→ 今後（EN記事・ENページ導線）→ **[[代表コメント:要記入]]** → 会社概要。`/news/equal-exchange-compensation-launch/` として静的生成済み。
- **PR TIMES要約版**（docs/press/pr01-prtimes.md・819字）: 全文を載せず要点 + UTM付き原本リンクで誘導。
- **LinkedIn日本語版**（docs/press/pr01-linkedin-ja.md・約1,040字）: 一人称・冒頭2行フック・末尾に問い・ハッシュタグ5個。**パターンA（本文リンク）/ B（コメントにリンク+コメント文併記）両方**。初回A→2回目Bでリーチ比較の方針を明記（断定なし）。
- **LinkedIn英語版**（docs/press/pr01-linkedin-en.md）: 直訳でなく海外読者向け再構成（カルチャーギャップをフック / o-tagai-sama補足 / /en/ 導線）。パターンA/B両方。ネイティブ確認は人間。
- **プレースホルダ**: [[代表コメント:要記入]]（news.js内・PR TIMES版に転記指示あり）。
- 補足: セッション③の docs/press-release/（全文型PR TIMES版）は本タスクの「原本=自社サイト+要約版」方式で**置き換え**（note転載版はそのまま利用可）。

### Task 7-3 配信実務マニュアル — ✅ 完了（PR: claude/session4-playbook）
- `docs/press-distribution-playbook.md`: A配信前チェック（自社公開が先/代表コメント置換/OGP検証=LinkedIn Post Inspector/UTM準備）、B PR TIMES手順（無料枠は**条件を断定せず公式確認のチェックリスト**/代替案と判断基準/入稿は要約版のみ/二次掲載→被リンク確認→media-coverage登録のコード例）、C LinkedIn手順（代表個人プロフィール英語併記・会社ページはリポスト補助/日→数日空けて英/48時間以内返信/英語返信テンプレ/A・Bリーチ比較記録表）、D UTM規則（コピペ可能な完成形URL4本・`{news_id}_{テーマ}`命名・utm_contentで言語分離）、E 配信後チェックリスト、F GA4測定手順（参照元別/utm_content=en分離/news読了・cta_click）。
- 注: 付録FはTask 7-4の仕様に対応（`update-kpi.js --target news` は次PRで実装）。

### Task 7-5 Clutch登録準備一式 — ✅ 完了（PR: claude/session4-clutch）
- `docs/directories/clutch-profile-en.md`: 会社概要50語/150語（/en/about/ と表現統一）、Service構成比案（Branding 35/Company media 35/PR 30）、差別化=等価交換を前面、ターゲット・会社情報。[[要確認]]: 想定案件規模・チーム人数。
- `docs/directories/clutch-case-studies-en.md`: ①Shake Shack Japan（課題→打ち手→成果。数値はサイト掲載済みの「表示速度40%改善・CWV全指標Green」のみ使用）②等価交換の農家サイト（定性成果中心）。不明数値は [[要確認:数値]]。
- `docs/directories/review-request-templates.md`（**最重要**）: 日本語版（Clutchとは何か/なぜ/所要時間を丁寧に説明・押し付けないトーン）+ 英語版 + 依頼タイミング（完了直後）とリマインド作法（2週間後に一度だけ）。
- `docs/directories/clutch-playbook.md`: 登録前チェック（**条件は断定せず公式確認項目のみ**）→ 登録フロー → 完了後（UTM設定・news.jsへ被リンク記録のコード例・GA4確認）→ 運用リズム → 将来ディレクトリ（Sortlist/DesignRush/Agency Spotter）の判断チェックリスト。
- **人間の作業**: 公式サイトでの条件確認、クライアント名公開可否の確認、[[要確認]]の記入、英文最終確認、レビュー依頼の実施。
