# セキュリティ対応 手順書（/admin/ 認証・Spir Webhook 認証）

2026-10-22 のセキュリティ調査で見つかった2件への対応手順。
**手順の順序に意味がある**ため、飛ばさずに上から実行すること。

> 補足: 同日に報じられた PHP の RCE 脆弱性（CVE-2026-109618 / 109619）は、
> 本サイトが PHP を使っていないため影響しない。調査で改ざんの痕跡も無かった。
> 本書はそれとは別に見つかった2件の対応を扱う。

---

## 対応する問題

| # | 問題 | 影響 |
|---|---|---|
| 1 | `/api/spir-webhook` が無認証 | 偽の予約イベントを投げられ、任意アドレスへ BOATship 名義の確定メール送信・既存リードの `booked_at` 書き換え・Slack通知の濫用が可能 |
| 2 | `/admin/` が公開＋パスワードが配信HTMLに平文 | ソースを見れば誰でもパスワードを読める（＝認証として機能していない） |

---

## 問題1: Spir Webhook のトークン認証

### なぜ順序が重要か

`api/spir-webhook.js` は環境変数 `SPIR_WEBHOOK_TOKEN` を**必須**として検証する。
Spir 側の登録URLにトークンが付いていない状態で環境変数だけ設定すると、
**正規の予約通知が 401 で弾かれる**。Spir は非200を10秒間隔で4回リトライし、
最終失敗でチーム管理者全員にエラーメールを送るため、業務影響が出る。

→ 必ず **「Spir 側を先、Vercel を後」** の順で行う。

### 手順

**Step 1-1. トークンを決める**

```bash
node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"
```

出力をパスワードマネージャーに控える。
**この値をリポジトリ内のファイルに書かないこと**（置き場所は Vercel の環境変数と
Spir の登録URLだけ）。

**Step 1-2. Spir 側の Webhook URL を再登録する（先にこちら）**

Spir の管理画面 → Webhook サービス連携 → 登録済みURLを次に差し替える。

```
https://www.boatship.jp/api/spir-webhook?token=<Step 1-1 のトークン>
```

この時点では本番コードは旧仕様（環境変数が未設定なので検証しない）なので、
`?token=` が付いても**何も壊れない**。

**Step 1-3. Vercel に環境変数を登録する**

Vercel → プロジェクト `kpi-tracker` → Settings → Environment Variables

| Key | Value | Type | Environments |
|---|---|---|---|
| `SPIR_WEBHOOK_TOKEN` | Step 1-1 のトークン | Sensitive | Production, Preview |

登録した時点で**旧コードでも検証が有効**になる。Step 1-2 を済ませてあれば正常に通る。

**Step 1-4. 本PRをマージする**

マージ後のコードは「環境変数が無ければ 503 で閉じる」フェイルクローズになる。
Step 1-3 を済ませてからマージすること。

**Step 1-5. 動作確認**

```bash
# トークン無し → 401 になること
curl -i -X POST -H 'Content-Type: application/json' -d '{}' \
  https://www.boatship.jp/api/spir-webhook/

# 正しいトークン → 200 {"ok":true,...} になること
curl -i -X POST -H 'Content-Type: application/json' -d '{}' \
  "https://www.boatship.jp/api/spir-webhook/?token=<トークン>"
```

そのうえで**実際に1件テスト予約を入れ**、確定メールと Slack 通知が届くことを確認する。

---

## 問題2: /admin/ の Basic 認証

### 設計

パスワードを静的HTMLに置く限り、どう書いても閲覧者側で読める／回避できる。
そのため判定を Vercel のエッジ（Routing Middleware = `proxy.ts`）に移し、
正解値は環境変数にだけ置く。HTMLにはパスワードを一切含めない。

- `proxy.ts` … `/admin` 配下のみ Basic 認証。環境変数が無ければ 503（フェイルクローズ）
- `vercel.json` の `proxy.matcher` で `/admin`, `/admin/:path*` に限定
- `admin/index.html` から平文パスワードと JS 認証画面を削除

> ミドルウェアを **TypeScript (`proxy.ts`)** にしている理由:
> `vercel.json` の `proxy.entrypoint` は `.js` / `.ts` / `.py` しか受け付けず
> （`.mjs` はスキーマ検証で落ちる）、一方でミドルウェアは default export（ESM）
> 必須。このプロジェクトは `api/*.js`・`lib/*.js` が CommonJS なので
> `package.json` に `"type": "module"` を足す手は使えない。`.ts` なら常に
> ESM として扱われ、`package.json` の type に影響されない。

### 手順

**Step 2-1. Vercel に環境変数を登録する（対応済み）**

| Key | Value | Type | Environments | 状態 |
|---|---|---|---|---|
| `ADMIN_PASSWORD` | 新パスワード | Sensitive | Production, Preview | ✅ 登録済み（`kpi-tracker` / `kpi-tracker-8ezk` 両方） |
| `ADMIN_USER` | 任意（既定 `admin`） | — | — | 未設定（既定のまま） |

パスワードは Vercel にのみ保存され、リポジトリにも配信HTMLにも含まれない。
**手元のパスワードマネージャーにも控えておくこと**（Sensitive 型は後から閲覧できない）。

**Step 2-2. 本PRをマージする**

**Step 2-3. 動作確認**

1. ブラウザで `https://www.boatship.jp/admin/` を開く
2. ブラウザ標準の認証ダイアログが出る
   - ユーザー名: `admin`
   - パスワード: Step 2-1 の値
3. 認証後、管理画面が表示されること
4. ページのソースを表示し、パスワード文字列が**含まれていない**ことを確認

```bash
# 認証なし → 401 になること
curl -i https://www.boatship.jp/admin/ | head -5

# ソースにパスワードが出ないこと（0件ならOK）
curl -s -u admin:<パスワード> https://www.boatship.jp/admin/ | grep -c '<パスワード>'
```

### パスワードを変更したくなったら

Vercel の `ADMIN_PASSWORD` を書き換えて**再デプロイ**するだけ。
コードの変更もリリースも不要。`admin/index.html` には二度と書かないこと。

---

## 補足: 今回対応しない項目

| 項目 | 判断 |
|---|---|
| three.js を cdnjs から SRI 無しで読み込み（`index.html`） | 侵害の痕跡は無い。別途 SRI 付与かセルフホストを検討 |
| GitHub PAT を localStorage に保存（管理画面の公開機能） | 書き込みには引き続き PAT が必要。Basic 認証が入ることで露出面は縮小 |
| Neon DB 内の不正レコード確認 | 要・人手。下記クエリを Neon の SQL Editor で実行 |

```sql
-- Webhook 悪用の痕跡確認（身に覚えのない direct_booking が無いか）
SELECT id, email, name, company, booked_at, created_at
FROM leads
WHERE asset_id = 'direct_booking'
ORDER BY created_at DESC
LIMIT 50;
```
