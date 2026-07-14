# kpi-tracker

BOATship のコーポレートサイト & オウンドメディア（www.boatship.jp）

## Notes — インナーブランディング・広報企画特化のオウンドメディア

`/notes` は、インナーブランディングと広報企画に特化した BOATship のオウンドメディアです。
記事は **学術エビデンス** と **実際のアクセス実績** にもとづいて継続的にチューニングします。

### 仕組み

- **データ**: 記事は `notes/notes.js` の `NOTES` 配列で一元管理。一覧ページ（`notes/index.html`）と記事ページ（`notes/article.html`）はここから自動描画されるため、データを公開するだけでサイト全体が自動更新されます。
- **記事フィールド**:
  - `theme` — `inner-branding` / `pr-planning` / `culture`（一覧のフィルタに使用）
  - `evidence` — 学術エビデンス `{ title, source, url }` の配列。記事末尾の「EVIDENCE」欄に表示
  - `kpi` — 実測値 `{ views, readRate, reactions, recordedAt }`。note.com や Vercel Analytics で確認した実数を記録
  - `tuningMemo` — チューニングの仮説と次の打ち手
- **アクセス計測**: `notes/analytics.js` が閲覧数・読了(記事末尾到達)を localStorage に記録（Cookie不使用）。`beaconEndpoint` を設定すると GoatCounter 等の外部計測にも送信できます。

### 更新フロー（自動更新）

1. `/admin` にログイン →「Notes」セクションで記事を作成・編集
   （テーマ / 学術エビデンス / 実測KPI / チューニングメモも入力可能）
2. 「変更を保存」→「サイトに公開」で `notes/notes.js` が GitHub に直接コミットされ、1〜2分で本番に自動反映
3. 「📊 Insights」で記事ごとの KPI・エビデンス数・ルールベースのチューニング提案を確認
4. 提案にもとづき記事を修正 → 再公開 → 再計測、のループで記事を育てる

### 週次自動更新（GitHub Actions）

`.github/workflows/notes-weekly.yml` により、**毎週月曜 09:03 JST に Claude が自動で**:

1. インナーブランディング / 広報企画のうち本数が少ないテーマで新記事を1本執筆（実在の学術エビデンス付き）
2. KPI記録済みの記事に下記の判定ルールを適用してチューニング
3. ドラフトPRを作成（マージ＝本番公開は人間が判断）

**初回セットアップ**: リポジトリの Settings → Secrets and variables → Actions に `ANTHROPIC_API_KEY` を登録してください（Claude Pro/Max の場合は `claude setup-token` で取得した `CLAUDE_CODE_OAUTH_TOKEN` でも可。workflow 内のコメント参照）。Actions タブから手動実行（Run workflow）も可能です。

### チューニングの判定ルール（admin 📊 Insights）

- 学術エビデンス未設定 → 出典の追加を提案
- 実測PVが全記事の中央値未満 → タイトル・サマリーの A/B を提案
- 読了率 40% 未満 → 冒頭300字と見出し構成の再設計を提案
- 反応率（反応数/PV） 2% 未満 → 記事末尾の CTA・シェア導線の見直しを提案

## 読了率計測（GA4 / read-tracking.js）

Notes・Magazine の記事ページに `assets/js/read-tracking.js` を読み込み、Google Analytics 4 に読了データを送信します（`notes/analytics.js` の localStorage 計測とは別系統で併存。admin Insights は引き続き localStorage 版を使用）。

### 送信する GA4 カスタムイベント

| イベント | 発火条件 | パラメータ |
|---|---|---|
| `scroll_depth` | スクロール 25 / 50 / 75 / 90% 到達時 | `article_id`, `percent` |
| `read_complete` | 本文末尾センチネル（`#article-end`）が可視 **かつ** 滞在時間 ≥ `readTime`（分）× 60 × 0.5 秒 の両条件を満たしたとき1回 | `article_id`, `read_time_sec` |

- 同一セッション・同一記事での重複発火は `sessionStorage` で防止します。
- `article_id`・`read_time` は各記事テンプレートが `#article-end` 要素の `data-article-id` / `data-read-time` 属性に埋め込みます。

### GA4 測定ID（設定済み）

各記事テンプレートの `<head>` にある gtag スニペットには、測定ID **`G-P4HKHJ91Z5`** を設定済みです。変更する場合は以下の2ファイル・各2箇所（gtag.js の `src` と `gtag('config', …)`）を差し替えてください:
- `notes/article.html`
- `magazine/article.html`

### デバッグ

記事URLに `?debug=1` を付けて開くと、スクロール・読了イベントが発火するたびに `[read-tracking]` プレフィックスで console にログが出ます（GA4未設定でも確認可能）。

## 記事の静的HTML生成（SEO / 固有URL）

記事ページはビルド時に静的HTMLとして生成され、固有URLで配信されます:

- **URL形式**: `/notes/<slug>/`・`/magazine/<slug>/`（slug は各記事データの `slug` フィールド。英数字ケバブケース）
- **生成**: `node scripts/build-articles.js` が `notes/notes.js` と `magazine/articles.js` を読み、`templates/article.html` をベースに記事ごとの `index.html` を出力します。生成物には記事固有の `<title>` / meta description / OGP / canonical / JSON-LD（`Article` + `BreadcrumbList`）/ パンくずリストを含みます
- **旧URL互換**: `article.html?id=XX` は残置し、対応する slug があれば canonical + meta refresh + JS リダイレクトで新URLへ転送します
- **自動ビルド**: `.github/workflows/sitemap.yml`（Build articles & sitemap）が記事データ・テンプレート変更時に再生成して main にコミットします
- **注意**: `/notes/<slug>/index.html` などの生成物と `templates/article.html` 由来の共通部分は**手で編集せず**、テンプレートまたはデータ側を変更して再ビルドしてください。新記事は `slug` フィールドを必ず設定してください（未設定の記事は旧URL形式のまま動作します）

## 問い合わせページ / Googleフォームのセットアップ（人間の作業）

`/contact/` は問い合わせページです。フォーム本体は Google フォームを埋め込む設計で、**フォームの作成は人間の作業**です:

1. [Google フォーム](https://docs.google.com/forms/)で新規フォームを作成し、以下の項目を設定:
   - お名前（記述式・必須）
   - 会社名（記述式・任意）
   - メールアドレス（記述式・必須。設定で「メールアドレスを収集する」でも可）
   - ご相談カテゴリ（ラジオボタン: ブランディング / 広報・PR / Web制作 / 等価交換でのご依頼 / その他）
   - 内容（段落・必須）
2. 「送信」→「<>（埋め込みHTML）」で `<iframe>` コードをコピー
3. `contact/index.html` 内のコメント「▼ Googleフォームの埋め込み」に従い、プレースホルダの `<div class="contact-form-placeholder">…</div>` を `<iframe>` に差し替え（height はフォームに合わせて調整、`title` 属性を付与）
4. フォームの回答通知は Google フォーム側の設定で contact@boatship.jp に届くようにする

フォーム未設置の間は、ページ上でメール（contact@boatship.jp）への導線を案内しています。

## KPIの月次転記（GA4 CSV → notes.js）

月に一度、GA4 の実測値を `notes/notes.js` の `kpi` フィールドへ半自動で転記します（目標: 人間の作業30分以内）。

### 手順（毎月末）

1. **GA4 からエクスポート**: [GA4](https://analytics.google.com/) →「探索」で自由形式レポートを作成
   - ディレクション: イベントパラメータ `article_id`（カスタムディメンションとして登録しておく）
   - 指標: イベント数（イベント名 `read_complete` でフィルタ）
   - 表示回数（views）は「レポート」→「エンゲージメント」→「ページとスクリーン」で記事ページ（`/notes/<slug>/`）ごとの表示回数を確認
2. **CSVを作成**: 以下のヘッダーで1ファイルにまとめる（reactions は note.com のスキ等を手動で追記・任意）
   ```csv
   article_id,views,read_complete,reactions
   n05,320,150,12
   n07,180,95,
   ```
3. **スクリプト実行**:
   ```bash
   node scripts/update-kpi.js kpi-2026-07.csv --date 2026.07.31 --dry-run   # まず確認
   node scripts/update-kpi.js kpi-2026-07.csv --date 2026.07.31             # 反映
   ```
   - `readRate`（読了率%）は views と read_complete から自動計算
   - 未知の `article_id` は警告してスキップ。更新後に構文チェックも自動実行
4. **PRで公開**: `git diff` で確認 → ブランチを切ってコミット → PR作成（main へ直接 push しない）。マージすると記事ページの「最終チューニング」表示と admin Insights の判定に反映されます

### 将来課題

GA4 Data API での直接取得は認証設定が必要なため、当面は CSV 半自動運用とします（API接続は将来のフェーズで検討）。

## News セクション（プレスリリース・メディア掲載・お知らせ）

`/news/` は外部発信の**原本（canonical）置き場**です。PR TIMES・LinkedIn・Clutch などの外部媒体は「入口」、自社サイトが「本体」。すべての流入を /news/ に集め、読了計測とCTAで問い合わせに転換します。

- **データ**: `news/news.js` の `NEWS` 配列（notes.js と同じ設計思想）。`type` は `press-release` / `media-coverage` / `announcement`
- **生成**: `press-release` と `announcement` は `scripts/build-articles.js` が `/news/<slug>/` を静的生成（JSON-LD は `NewsArticle`、読了計測センチネル・記事末CTA付き）。`media-coverage` は一覧に外部リンクとして表示するだけ
- **掲載先リンク**: 配信後に `distribution` へURLを追記してコミットすると、個別ページ下部に「掲載先」リンクが自動表示されます
- **被リンク記録**: `isBacklink` に被リンク獲得の有無を記録（LinkedInはnofollowのため対象外。PR TIMES二次掲載・Clutch等が被リンク源）
- 一覧は `news/index.html`（type別フィルタ付き）、トップページに Latest News（最新3件）を表示。sitemap にも自動反映

## サイトマップ / robots（SEO）

検索エンジン向けの `sitemap.xml` と `robots.txt` はリポジトリ直下に配置し、Vercel がそのまま配信します。

- **生成**: `node scripts/generate-sitemap.js` を実行すると、`notes/notes.js`（NOTES）と `magazine/articles.js`（ARTICLES）を読み込んで、静的ページ（`/`・`/about/`・`/works/`・`/notes/`・`/magazine/`）と全記事ページ（`/notes/article.html?id=…`・`/magazine/article.html?id=…`）の URL を含む `sitemap.xml` を出力します。`/admin/` は robots で `Disallow` にしています。
- **自動更新**: `.github/workflows/sitemap.yml` により、`notes/notes.js`・`magazine/articles.js`・生成スクリプトが main で変更されると自動で再生成し、差分があれば main にコミットします（Actions タブから手動実行も可能）。
- `sitemap.xml` / `robots.txt` は**自動生成物のため手で編集しない**でください（記事の増減はデータ側を変えれば追従します）。
