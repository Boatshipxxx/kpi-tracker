-- リード獲得導線: leads テーブル
-- 適用: DATABASE_URL を設定して `npm run setup:leads-db`
-- （Neon の SQL Editor に貼り付けても可）

CREATE TABLE IF NOT EXISTS leads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at    timestamptz NOT NULL DEFAULT now(),
  company       text NOT NULL,
  name          text NOT NULL,
  email         text NOT NULL,
  department    text,
  asset_id      text NOT NULL,
  landing_url   text NOT NULL,
  form_url      text NOT NULL,
  referrer      text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  consent_at    timestamptz NOT NULL,
  mail_status   text NOT NULL DEFAULT 'queued'
                CHECK (mail_status IN ('queued', 'sent', 'failed')),
  mail_sent_at  timestamptz,
  booked_at     timestamptz
);

-- Spir Webhook のメールアドレス突合（最新レコード優先）用
CREATE INDEX IF NOT EXISTS leads_email_created_idx
  ON leads (lower(email), created_at DESC);

-- 記事別リード数の集計用
CREATE INDEX IF NOT EXISTS leads_landing_url_idx
  ON leads (landing_url);

-- Spir Webhook の重複排除（失敗時10秒×4回のリトライがあるため）。
-- webhookEventId を主キーで記録し、二重に届いたイベントを一度だけ処理する。
CREATE TABLE IF NOT EXISTS webhook_events (
  id          text PRIMARY KEY,
  received_at timestamptz NOT NULL DEFAULT now()
);

-- 資料ダウンロードの記録（ダウンロード率の計測用）。
-- /api/download 経由のダウンロードを1行ずつ記録する。
-- source: mail（自動返信メール）/ thanks（サンクスページ）/ material（資料ページ）
CREATE TABLE IF NOT EXISTS asset_downloads (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id      text NOT NULL,
  lead_id       uuid,
  source        text,
  downloaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS asset_downloads_asset_idx
  ON asset_downloads (asset_id, downloaded_at DESC);
