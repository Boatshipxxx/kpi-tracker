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

### ⚠️ 人間の作業：GA4 測定IDの差し替え（必須）

各記事テンプレートの `<head>` にある gtag スニペットは、測定IDを **プレースホルダ `G-XXXXXXXXXX`** で記載しています。GA4 プロパティを作成し、実際の測定ID（`G-` で始まる文字列）に差し替えてください。

差し替え対象（2ファイル、各2箇所）:
- `notes/article.html`
- `magazine/article.html`

差し替えるまでは GA4 へは送信されません（スクリプトはエラーなく動作します）。

### デバッグ

記事URLに `?debug=1` を付けて開くと、スクロール・読了イベントが発火するたびに `[read-tracking]` プレフィックスで console にログが出ます（GA4未設定でも確認可能）。
