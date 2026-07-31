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

## 🙋 人間タスク（この順で。1と2は待ち時間が発生するため初日に）

### 1. Resend のドメイン認証（SPF / DKIM / DMARC）★DNS反映待ちあり

1. Resend にサインアップ → Domains → `boatship.jp` を追加
2. 表示される DNS レコード（SPF・DKIM）をドメインのDNSに追加
3. DMARC レコードを追加（例: `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:contact@boatship.jp`）
4. Resend 上で3つとも Verified になることを確認
5. API Key を発行 → Vercel の環境変数 `RESEND_API_KEY` に設定

### 2. Spir の設定 ★Webhook利用申込に承認待ちあり

1. **Webhook の利用申込を初日に出す**（チームプラン契約だけでは有効にならない）
2. リード用の**空き時間URL**を作成（確定型は不可。iframe/Webhook/リダイレクト/質問フォームは空き時間URL限定）
3. 質問フォームに「会社・団体名」を**必須**で追加（氏名・メールは標準取得）
4. 日程確定後のリダイレクト先を `https://www.boatship.jp/booking-complete/` に設定
5. Webhook 送信先を `https://www.boatship.jp/api/spir-webhook?token=<ランダム文字列>` に設定
   （`<ランダム文字列>` は環境変数 `SPIR_WEBHOOK_TOKEN` と同じ値にする）
6. 空き時間URLのURL識別子（URL中の一意な部分）を環境変数 `SPIR_LEAD_URL_IDS` に設定
7. 空き時間URLを `assets/js/lead-config.js` の `SPIR_BOOKING_URL` に貼ってコミット
8. **最初のWebhook受信時にペイロードを確認し、`lib/spir-payload.js` の防御的パースが
   正しく メール/開始時刻/会社名 を拾えているか検証する**（現状はスキーマ非依存の走査で実装）

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
| `SPIR_LEAD_URL_IDS` | ✓ | リード用空き時間URLの識別子（カンマ区切り可）。未設定時は処理せずSlack警告 |
| `SPIR_WEBHOOK_TOKEN` | 推奨 | Webhook URL の `?token=` と一致させる |
| `SPIR_BOOKING_URL` | | メール本文の日程調整リンク（`lead-config.js` と同じURL） |
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
| サンクスページにSpirの空き時間URLが埋め込み表示される | **要・実環境**（未設定時の代替表示は検証済み） |
| 予約でWebhookが届きメール突合で booked_at 更新 | ロジック済（ユニットテスト）／**要・実環境** |
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
