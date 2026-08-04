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

## 🙋 人間タスク（Spir は設定済み。残りは 1 → 3 → 4 → 5）

### 1. Resend のドメイン認証（SPF / DKIM / DMARC）★DNS反映待ちあり

1. Resend にサインアップ → Domains → `boatship.jp` を追加
2. 表示される DNS レコード（SPF・DKIM）をドメインのDNSに追加
3. DMARC レコードを追加（例: `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:contact@boatship.jp`）
4. Resend 上で3つとも Verified になることを確認
5. API Key を発行 → Vercel の環境変数 `RESEND_API_KEY` に設定

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
- ⚠️ 参加者（高坂慎也）に「Zoom未連携」の警告が出ている。受け入れテストで実予約を1件通し、
  Web会議URLが発行されるか確認する。問題があれば Spir 側で Zoom をオフにするか Zoom を連携する

### 3. Neon（Vercel Marketplace）

1. Vercel ダッシュボード → Storage → Neon を接続（`DATABASE_URL` が自動設定される）
2. ローカルまたは Vercel CLI で `DATABASE_URL=... npm run setup:leads-db` を実行（冪等）

### 4. Slack

1. 通知先チャンネルに Incoming Webhook を作成
2. URL を環境変数 `SLACK_WEBHOOK_URL` に設定

### 5. Vercel 環境変数まとめ

| 変数 | 必須 | 内容 |
|---|---|---|
| `DATABASE_URL` | ✓ | Neon 接続文字列（Marketplace統合で自動） |
| `RESEND_API_KEY` | ✓ | Resend API Key |
| `LEAD_MAIL_FROM` | | 差出人。既定 `BOATship <contact@boatship.jp>`（no-reply不可・実在アドレス） |
| `SLACK_WEBHOOK_URL` | ✓ | Slack Incoming Webhook |
| `SPIR_LEAD_URL_IDS` | | 空き時間リンク識別子の上書き（カンマ区切り）。既定 `qKLPfOuw3wj6welMiVqd5` |
| `SPIR_WEBHOOK_TOKEN` | | 設定する場合は Spir の Webhook URL 再登録（`?token=` 付与）とセット |
| `SPIR_BOOKING_URL` | | メール本文の日程調整リンクの上書き。既定は実運用の空き時間リンク（`lead-config.js` と同一） |
| `SITE_ORIGIN` | | 既定 `https://www.boatship.jp` |

## 受け入れテスト（指示書セクション8）対応表

「済（オフライン）」= サンドボックスで検証済み（スタブAPI + 実ハンドラ + Playwright、31項目パス）。
「要・実環境」= 上記人間タスク完了後に本番で確認する項目。

| 受け入れ項目 | 状態 |
|---|---|
| 記事のCTAからフォームに到達できる | 済（オフライン） |
| 必須項目が空だとフィールド単位でエラー | 済（クライアント/サーバー両方） |
| 送信するとサンクスページに遷移する（3秒以内） | 済（116ms・メール送信を待たない実装） |
| サンクスページから資料にアクセスできる | 済 |
| 自動返信メールが Gmail・Outlook・.ac.jp の受信箱に届く | **要・実環境**（ドメイン認証後に3宛先へ実送信） |
| メール内の資料リンク・日程調整リンクが両方開く | **要・実環境** |
| サンクスページにSpirの空き時間URLが埋め込み表示される | 済（実URL設定済み・読込失敗時の代替表示も検証済み）／表示は**要・実環境** |
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
- メール到達率: `SELECT mail_status, count(*) FROM leads GROUP BY 1;`
- 日程調整率: `SELECT count(booked_at)::float / count(*) FROM leads WHERE asset_id <> 'direct_booking';`
- GA4イベント: `form_view` / `form_submit` / `booking_complete`（既存の `scroll_depth` 等と同様にGA4管理画面でカスタムイベント登録）

## 運用メモ

- 資料の追加: `assets/data/lead-assets.json` に1件追加 → `materials/<id>/index.html` を作成（noindex）→ 記事CTAの `asset=` を変えたい場合は `scripts/build-articles.js` の `requestHref`
- 自動返信メールの文面: `lib/mailer.js`（HTML/テキスト両方を更新すること）
- プライバシーポリシー（/privacy/）は雛形。**公開前に法務観点の確認を推奨**
