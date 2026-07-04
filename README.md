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

### チューニングの判定ルール（admin 📊 Insights）

- 学術エビデンス未設定 → 出典の追加を提案
- 実測PVが全記事の中央値未満 → タイトル・サマリーの A/B を提案
- 読了率 40% 未満 → 冒頭300字と見出し構成の再設計を提案
- 反応率（反応数/PV） 2% 未満 → 記事末尾の CTA・シェア導線の見直しを提案
