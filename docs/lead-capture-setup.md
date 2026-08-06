# リード獲得導線 — セットアップと受け入れテスト手順

実装指示書（フォーム → 自動返信 → サンクスページ → 日程調整）v1.2 に対応する。
コードは実装済み。**このドキュメントの人間タスクを完了すると、セクション8の受け入れテストが全て実施可能になる。**

## 構成

既存サイトが静的HTMLのため、Next.js は導入せず **静的ページ + Vercel Functions** で実装した
（指示書の「本書は仕様であり、実装形式を縛らない」「既存のコード規約・ディレクトリ構成に合わせて実装すること」に基づく）。

```
記事CTA（全JP記事に設置済み）
  → /request/?asset=<資料ID>&from=<記事URL>   フォーム
  → POST /api/lead                            検証→Neon保存→即応答→非同期でResend/Slack
  → /thanks/?asset=<資料ID>                   資料即時アクセス + Spir空き時間URL埋め込み
  → Spir で予約
  → POST /api/spir-webhook                    メール突合で booked_at 更新 / direct_booking
  → /booking-complete/                        GA4 booking_complete 発火
```

| ファイル | 役割 |
|---|---|
| `api/lead.js` | フォーム受け口。保存→応答→`waitUntil`でメール/Slack |
| `api/spir-webhook.js` | Spir日程確定の受け口。URL識別子で振り分け |
| `lib/` | db / leads-db / lead-validation / mailer / notify-slack / spir-payload / lead-assets |
| `request/` `thanks/` `booking-complete/` `privacy/` | 導線ページ（thanks/booking-complete/materials は noindex） |
| `materials/pr-planning-template/` | 資料本体（n10の企画書テンプレートを資料化・印刷対応） |
| `assets/data/lead-assets.json` | 資料カタログ。**資料を増やすときはここに1件追加するだけ** |
| `assets/js/lead-form.js` | フォーム挙動（サーバーと同一の検証仕様） |
| `assets/js/main.js` | 初回訪問Cookie `bs_first_touch`（landing_url/referrer/UTM・30日） |
| `scripts/leads-schema.sql` / `setup-leads-db.js` | leads テーブル作成（冪等） |
| `tests/` | ユニットテスト（`npm run test:leads`） |

## 🙋 人間タスク（Resend / Spir / Slack は設定済み。残るは 3 の Neon テーブル作成）

### 1. Resend — 設定完了済み（2026-08-04）

| 項目 | 設定値 |
|---|---|
| 認証ドメイン | `boatship.jp`（ルートドメイン）/ Verified / Tokyo リージョン |
| DKIM | `resend._domainkey.boatship.jp` |
| SPF / Return-Path | `send.boatship.jp` |
| 送信元アドレス | `contact@boatship.jp`（コードの既定値。`LEAD_MAIL_FROM` の設定は不要） |
| `RESEND_API_KEY` | Vercel の Production + Preview に登録済み |

**ルートドメイン `boatship.jp` を認証しているため、既定の送信元 `contact@boatship.jp` で送信できる。**
送信元アドレスを変更する場合は、下記「送信元アドレスの落とし穴」を必ず読むこと。

### 2. Spir — 設定完了済み（2026-08-04）

公式ヘルプ「Webhookサービス連携」でスキーマを確認済み。`lib/spir-payload.js` は正式キー参照
（`payload.invitee.email` / `payload.startDateTime` / `payload.formAnswers[]` 等）で実装されている。

| 項目 | 設定値 |
|---|---|
| チーム | BOAT部 (`PzCSnkJVDW6MKMid8j7Im`) / Team プラン |
| 空き時間リンク | `https://app.spirinc.com/t/PzCSnkJVDW6MKMid8j7Im/as/qKLPfOuw3wj6welMiVqd5/confirm` |
| 振り分け識別子 | `qKLPfOuw3wj6welMiVqd5`（コードに既定値として設定済み） |
| privateTitle | 資料請求フォロー個別相談（Webサイト経由） |
| 質問フォーム | お名前* / メールアドレス* / 会社・団体名* |
| リダイレクト先 | `https://www.boatship.jp/booking-complete/` |
| Webhook URL | `https://www.boatship.jp/api/spir-webhook`（登録済み・**PR #52 マージ前から有効**） |
| 登録イベント | 日程確定（`event.confirmed`）のみ |

**実装が依存している運用上の注意:**

- Webhook は全空き時間リンク共通で届く。既存3リンク（ご面談ミーティング / オンラインミーティング B / Josai）の
  予約も届くが、`originalUrl` の識別子で振り分けて 200 で黙って無視する（実装・テスト済み）
- 非200応答は 10秒×4回リトライ → 最終失敗でチーム管理者全員にエラーメール。
  そのため業務例外（対象外リンク・突合失敗・JSON不正）はすべて 200 を返す
- リトライ対策として `webhookEventId` で重複排除（`webhook_events` テーブル）
- **質問フォームのラベル「会社・団体名」を変更したら `lib/spir-payload.js` の `COMPANY_QUESTION` も更新すること**
- **「日程確定のキャンセル」イベントを追加登録しないこと**（ハンドラは 200 で無視するが、
  `booked_at` のクリアは未実装。必要になったら実装とセットで登録する）
- トークン検証を有効にする場合は `SPIR_WEBHOOK_TOKEN` 設定 + Spir 側のURL再登録をセットで行う
- **サンクスページに Spir は埋め込まない（2026-08-05 決定）。**
  当初は iframe 埋め込みで実装したが本番で表示されず、Spir の管理画面にも
  **埋め込み用のURL/コードが提供されていないことを確認**したため、iframe を撤去した。
  現在は「日程を調整する ↗」ボタンが別タブで空き時間リンクを開く形。
  空の枠が出る事故が構造的に起きない。クリックは GA4 `booking_open` で計測する。
  将来 Spir が埋め込みに対応したら、`thanks/index.html` の予約カードを差し替える
- ⚠️ 参加者（高坂慎也）に「Zoom未連携」の警告が出ている。受け入れテストで実予約を1件通し、
  Web会議URLが発行されるか確認する。問題があれば Spir 側で Zoom をオフにするか Zoom を連携する

### 3. Neon（Vercel Marketplace）

1. Vercel ダッシュボード → Storage → Neon を接続（`DATABASE_URL` が自動設定される）
2. **テーブル作成**（冪等。何度実行してもよい）。次のどちらかで行う:
   - `DATABASE_URL='postgres://...' npm run setup:leads-db`（ローカル or Vercel CLI）
   - Neon コンソールの SQL Editor に `scripts/leads-schema.sql` の内容を貼り付けて実行

作成されるのは **`leads` と `webhook_events` の2テーブル**（＋インデックス2本）。
`webhook_events` は Spir Webhook の重複排除用で、`leads` より後から追加されたため、
**`leads` だけが存在する環境では再実行が必要**。両方できているかは次で確認する:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY 1;
-- leads / webhook_events の2行が返れば完了
```

`webhook_events` が無いまま Spir の予約が入ると、Webhook 処理が例外になり
（応答は 200 のまま）Slack に「⚠️ Spir Webhook の処理に失敗しました」が届く。

### 4. Slack — 設定完了済み（2026-08-04）

Incoming Webhook を作成し、`SLACK_WEBHOOK_URL` を Vercel の Production + Preview に登録済み。

### 5. Vercel 環境変数まとめ

コード上の `process.env` は以下の**9個がすべて**（`api/` `lib/` `scripts/` を grep して確認）。
既定値のある6個は未設定でも動作する。

**必須（未設定だと実害が出る3個）**

| 変数 | 未設定時に起きること |
|---|---|
| `DATABASE_URL` | `lib/db.js` が throw。フォーム送信が **500** になり「保存できませんでした」を表示。サンクスページには進まない（リードを消さないため） |
| `RESEND_API_KEY` | `lib/mailer.js` が throw。**応答後の非同期処理で落ちるため、ユーザーには正常にサンクスページが見える**。メールは届かず `mail_status='failed'`、Slackに警告 |
| `SLACK_WEBHOOK_URL` | throw せず `console.error` を出して**黙ってスキップ**。新規リード通知もメール失敗警告も届かない。エラーが表に出ないぶん最も気づきにくい |

**任意（すべてコードに既定値あり）**

| 変数 | 既定値 | 用途 |
|---|---|---|
| `LEAD_MAIL_FROM` | `BOATship <contact@boatship.jp>` | 自動返信メールの差出人。`no-reply@` は使わない（返信を受け取る） |
| `LEAD_MAIL_REPLY_TO` | `contact@boatship.jp` | 自動返信メールの Reply-To |
| `SPIR_BOOKING_URL` | 実運用の空き時間リンク | メール本文の日程調整リンク（`assets/js/lead-config.js` と同一に保つ） |
| `SPIR_LEAD_URL_IDS` | `qKLPfOuw3wj6welMiVqd5` | 空き時間リンク識別子の上書き（カンマ区切り） |
| `SPIR_WEBHOOK_TOKEN` | なし（未設定なら検証しない） | 設定する場合は Spir の Webhook URL 再登録（`?token=` 付与）とセット |
| `SITE_ORIGIN` | `https://www.boatship.jp` | メール本文の資料URLの生成元 |

#### ⚠️ 送信元アドレスの落とし穴（`LEAD_MAIL_FROM`）

**「既定値があるから設定不要」とは限らない。** Resend は通常、アカウントで**認証済みのドメイン**
からの送信しか許可しない。既定の送信元は `contact@boatship.jp` なので:

| Resend で認証したドメイン | 既定値のままで送れるか |
|---|---|
| `boatship.jp`（ルート）| ✅ 送れる — **現在の構成はこれ**。設定不要 |
| `mail.boatship.jp` などサブドメインのみ | ❌ 送信時に拒否される → `LEAD_MAIL_FROM` を認証済みドメインのアドレスに設定する必要がある |

**不一致の場合の症状は `RESEND_API_KEY` 未設定時とまったく同じ**で、
デプロイもフォーム送信も成功し、ユーザーにはサンクスページが表示される。
メールだけが届かず `mail_status='failed'` になる。**将来ドメイン構成を変えるときは必ずここを確認すること。**

#### 送信失敗の切り分け

1. **Slack** — 「⚠️ 自動返信メールの送信に失敗」に**原因の文字列がそのまま入る**
   （`RESEND_API_KEY is not set` なのか Resend のドメイン拒否なのかが判別できる）
2. **DB** — `SELECT mail_status, count(*) FROM leads GROUP BY 1;`

そのため**設定順は `SLACK_WEBHOOK_URL` → `RESEND_API_KEY`** を推奨する。

## 受け入れテスト（指示書セクション8）対応表

「済（オフライン）」= サンドボックスで検証済み（スタブAPI + 実ハンドラ + Playwright、31項目パス）。
「要・実環境」= 上記人間タスク完了後に本番で確認する項目。

| 受け入れ項目 | 状態 |
|---|---|
| 記事のCTAからフォームに到達できる | 済（オフライン） |
| 必須項目が空だとフィールド単位でエラー | 済（クライアント/サーバー両方） |
| 送信するとサンクスページに遷移する（3秒以内） | 済（116ms・メール送信を待たない実装） |
| サンクスページから資料にアクセスできる | 済 |
| 自動返信メールが Gmail・Outlook・.ac.jp の受信箱に届く | **要・実環境**（Resend認証済み。3宛先へ実送信して確認） |
| メール内の資料リンク・日程調整リンクが両方開く | **要・実環境** |
| サンクスページから日程調整に到達できる | 済（Spirが埋め込み非対応のため別タブ方式。ボタン表示・URL・GA4計測を検証） |
| 予約でWebhookが届きメール突合で booked_at 更新 | 済（公式スキーマ準拠・startDateTime使用をテスト）／**要・実環境** |
| 直接予約は asset_id='direct_booking' で新規レコード | ロジック済（ユニットテスト）／**要・実環境** |
| リード導線以外の空き時間URLは leads に混入しない | ロジック済（ユニットテスト）／**要・実環境** |
| 日程確定後、自社の予約完了ページにリダイレクト | **要・実環境**（Spir側設定） |
| Slackに通知が届く | コード済／**要・実環境** |
| landing_url が正しく記録（別記事から流入して送信） | 済（記事A流入→記事B送信で検証） |
| サンクスページが noindex | 済 |
| スマートフォンで一連の操作が完了できる | 済（390pxで送信完了・横スクロールなし） |
| メール送信を意図的に失敗させるとSlackに警告 | 済（失敗パスが `mail_status='failed'`→警告呼び出しに到達することを確認） |

## 計測（指示書セクション5）

- 記事別リード数: `SELECT landing_url, count(*) FROM leads GROUP BY 1 ORDER BY 2 DESC;`
- 資料DL数（経路別）: `SELECT asset_id, source, count(*) FROM asset_downloads GROUP BY 1,2 ORDER BY 1,2;`
- **資料ダウンロード率**（リードのうち実際にDLした人の割合。thanks/mail のDLリンクは lead_id 付きで記録される）:
  ```sql
  SELECT round(100.0 * count(DISTINCT d.lead_id)
       / NULLIF((SELECT count(*) FROM leads WHERE asset_id <> 'direct_booking'), 0), 1) AS dl_rate_pct
  FROM asset_downloads d WHERE d.lead_id IS NOT NULL;
  ```
  ※ DLはすべて `/api/download` リダイレクト経由で `asset_downloads` に記録される（mail=メール内リンク / thanks=サンクスページ / material=資料ページ）。計測がDLを妨げない設計（DB障害でもリダイレクトは成立）
- メール到達率: `SELECT mail_status, count(*) FROM leads GROUP BY 1;`
- 日程調整率: `SELECT count(booked_at)::float / count(*) FROM leads WHERE asset_id <> 'direct_booking';`
- GA4イベント: `form_view` / `form_submit` / `booking_open` / `booking_complete` / `asset_download`（既存の `scroll_depth` 等と同様にGA4管理画面でカスタムイベント登録）

## 運用メモ

- 資料の追加: `assets/data/lead-assets.json` に1件追加（`download` にPDFパスを指定）→ `materials/<id>/index.html` を作成（noindex）→ `scripts/build-material-pdf.js` の `TARGETS` に追記して `npm run build:material-pdf` でPDF生成 → 記事CTAの `asset=` を変えたい場合は `scripts/build-articles.js` の `requestHref`
- 資料ページを編集したら `npm run build:material-pdf` でPDFを再生成してコミット（PDFは静的配信。メール・サンクスページの主リンクはPDF直接ダウンロードで、`/materials/*.pdf` は vercel.json で Content-Disposition: attachment + noindex）
- 自動返信メールの文面: `lib/mailer.js`（HTML/テキスト両方を更新すること）
- プライバシーポリシー（/privacy/）は雛形。**公開前に法務観点の確認を推奨**
