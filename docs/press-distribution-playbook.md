# 配信実務プレイブック — PR TIMES / LinkedIn / UTM

> この手順書だけを見て、人間が配信を完了できることを目的にしたマニュアル。
> 対象成果物: `docs/press/pr01-*.md`（原本は `/news/equal-exchange-compensation-launch/`）。
> 以降のリリース（pr02〜）も同じ手順で回す。
>
> **大原則**: 自社サイトの `/news/{slug}/` が原本。外部媒体は入口。
> 配信の役割分担 — PR TIMES = 被リンク獲得・国内露出 / LinkedIn = 海外接点（**nofollowのためSEO効果はゼロ。被リンク目的で使わない**）/ Clutch = 被リンク + 海外からの発見（→ docs/directories/clutch-playbook.md）。

---

## A. 配信前チェックリスト

順序を間違えないこと。**必ず自社サイトの公開が先**（外部が先だと、原本のないコピーが世に出る）。

- [ ] 1. 自社サイトの `/news/{slug}/` が**本番公開済み**（PRマージ → Vercelデプロイ完了をブラウザで確認）
- [ ] 2. `[[代表コメント:要記入]]` が実文言に置換済み（`news/news.js` を編集 → コミット → 自動再ビルド）
- [ ] 3. OGP画像がSNSシェアで正しく表示される
  - 検証手順: 該当URLを [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) に貼って画像・タイトルを確認。表示が古い場合はここで再スクレイプさせる
- [ ] 4. 下記 D のUTM付きリンクがコピペできる状態（このファイルからコピー）
- [ ] 5. 配信用原稿の最終確認（PR TIMES版は要約になっているか / LinkedIn版はプレスリリース文体になっていないか）

## B. PR TIMES 配信手順

**主目的は「二次掲載による被リンク獲得」**。配信そのものより、配信後にどのメディアに転載され、被リンク（follow）が発生したかの記録が重要。

### B-1. 事前確認（条件は変動するため断定しない）

> ⚠️ 無料枠（スタートアップチャレンジ等）の適用条件は変動します。**申込前に必ず公式サイト（https://prtimes.jp/）で最新条件を確認**してください。確認すべき項目:
- [ ] 適用条件（設立年数・資本金など。BOATshipは2022年4月設立）
- [ ] 必要書類（登記簿謄本等）
- [ ] 無料配信の回数上限
- [ ] 審査期間（配信予定日から逆算して間に合うか）

**無料枠が使えない場合の代替案と判断基準**: 従量課金の単発配信を使う。判断基準は「このリリースに配信料金分の被リンク・露出価値があるか」。初回（pr01）は「野菜×デザイン」の絵になるネタで転載可能性が比較的高いため単発課金でも試す価値がある。以降は初回の二次掲載実績を見て判断する。使わない場合は LinkedIn + 自社SNS + ニュースレターのみで配信し、Clutch側の被リンクで補完する。

### B-2. 配信手順（画面遷移レベル）

1. https://prtimes.jp/ → 右上「企業登録申請」からアカウント登録（会社情報・担当者情報を入力 → 審査を待つ）
2. ログイン → 管理画面「プレスリリースを作る」
3. タイトル・サブタイトルに `docs/press/pr01-prtimes.md` の該当欄を貼り付け
4. 本文に**要約版**を貼り付け（**全文を載せない**。「詳細はこちら」のUTM付きリンクが原本へ誘導する構造を崩さない）
5. 画像をアップロード（【画像1】= 交換した野菜など絵になる実物、【画像2】= ロゴ。アイキャッチはロゴのみを避ける）
6. カテゴリ選択（例:「働き方・人事」「デザイン」）、配信日時を設定（火〜木の10〜11時が定石。月曜朝・金曜夕方は避ける）
7. プレビューで リンクのUTMが欠けていないか を確認 → 配信予約

### B-3. 配信後: 二次掲載と被リンクの記録

1. 配信後2〜3日、PR TIMES管理画面の掲載レポートと、Google検索（`"リリースタイトル" -site:prtimes.jp`）で転載先を確認
2. 転載ページのリンクが**被リンク(follow)か**を確認: 転載記事内の自社サイトへのリンクを右クリック → 検証 → `rel="nofollow"` が**付いていなければ** follow（被リンク獲得）
3. 被リンクが発生した転載は `news/news.js` に記録してコミット:
   ```javascript
   {
     id: "mc01",  // 連番
     type: "media-coverage",
     slug: null,
     title: "（転載記事のタイトル）",
     subtitle: null,
     date: "YYYY-MM-DD",
     body: null,
     ogImage: null,
     distribution: null,
     mediaOutlet: "（媒体名）",
     externalUrl: "（転載先URL）",
     isBacklink: true,   // followリンクなら true / nofollowなら false
     kpi: { views: null, readRate: null, recordedAt: null }
   }
   ```
4. あわせて pr01 の `distribution.prtimes.url` に PR TIMES の配信URLを記入（→ /news/ 個別ページに「掲載先」リンクが自動表示される）

## C. LinkedIn 投稿手順

**役割は海外接点（KPI 30件）**。リンクは nofollow のためSEO・被リンク目的では使わない。見るべきは「海外企業・エージェントからの反応（コメント・DM・プロフィール閲覧）」。

### C-1. 前提となるアカウント整備（人間の作業・初回のみ）

- [ ] **代表個人のプロフィール整備**（最優先。海外KPIの窓口になる）
  - 氏名・肩書・自己紹介に**英語を併記**（例: Founder, BOATship — Design & PR studio in Tokyo. We help brands enter the Japanese market.）
  - プロフィール写真・背景画像・boatship.jp へのリンク
- [ ] **会社ページ（BOATship）を作成**（ロゴ・英語の概要・Webサイト）
- 役割分担: **投稿は原則、代表個人アカウントから**（企業ページより個人投稿のほうがリーチが伸びやすいとされるため）。**会社ページは個人投稿をリポストして補助**する

### C-2. 投稿手順

1. `docs/press/pr01-linkedin-ja.md` の**パターンA**本文をコピーして代表個人アカウントで投稿（初回はA）
2. 会社ページで当該投稿をリポスト
3. **数日空けて**、`pr01-linkedin-en.md` の英語版を投稿（**日本語版と同日連投しない**。英語版も初回はA、次の機会にB）
4. パターンBで投稿する場合: 本文投稿の**直後に自分で1つ目のコメント**（各mdファイルに記載のコメント文）を入れる
5. 投稿URLを `news/news.js` の `distribution.linkedin.urlJa / urlEn` に記入してコミット

### C-3. 投稿後の運用（48時間が勝負）

- [ ] **48時間以内にすべてのコメントへ返信**（エンゲージメントがリーチに影響するため）
- [ ] 海外からの反応（コメント・DM・プロフィール閲覧）は**海外KPI 30件への最重要シグナル**。すぐ返信する
- 返信テンプレート（英語・対話の入口。売り込まない）:
  > Thanks for reading, [Name]! The barter cases surprise people, but the interesting part is really how the relationship changes. Curious what prompted your interest — are you working on something related to Japan? Happy to share what we've learned (no sales pitch, promise).

### C-4. パターンA/B リーチ比較の記録欄

> リンク付き投稿はリーチが下がる傾向があるとされるが断定はできない。**2〜3回の実測で自社にとっての正解を判断**する。

| 回 | 日付 | 言語 | パターン | インプレッション | リアクション | コメント | クリック(GA4流入) | メモ |
|---|---|---|---|---|---|---|---|---|
| 1 | | ja | A | | | | | |
| 2 | | en | A | | | | | |
| 3 | | ja | B | | | | | |
| 4 | | en | B | | | | | |

## D. UTMパラメータ規則

**命名規則**: `utm_campaign` は `{news_id}_{短いテーマ名}`。`utm_content` で言語を分離（日本語投稿と英語投稿のどちらが効いたかを分けて計測 = 海外KPI判断に直結）。

pr01 用のコピペ可能な完成形URL:

| 用途 | URL |
|---|---|
| PR TIMES | `https://www.boatship.jp/news/equal-exchange-compensation-launch/?utm_source=prtimes&utm_medium=referral&utm_campaign=pr01_equal_exchange` |
| LinkedIn（日） | `https://www.boatship.jp/news/equal-exchange-compensation-launch/?utm_source=linkedin&utm_medium=social&utm_campaign=pr01_equal_exchange&utm_content=ja` |
| LinkedIn（英） | `https://www.boatship.jp/news/equal-exchange-compensation-launch/?utm_source=linkedin&utm_medium=social&utm_campaign=pr01_equal_exchange&utm_content=en` |
| Clutch | `https://www.boatship.jp/?utm_source=clutch&utm_medium=referral&utm_campaign=directory` |

以降のリリースは `pr02_{テーマ名}` の形式で同様に作る（source / medium は媒体ごとに固定）。

## E. 配信後にやること（チェックリスト）

- [ ] 1. 配信URLを `news/news.js` の `distribution` に記入してコミット（→ /news/ 個別ページに「掲載先」リンクが自動表示）
- [ ] 2. PR TIMES の二次掲載を確認し、被リンクを `type: "media-coverage"` + `isBacklink: true/false` として登録（B-3）
- [ ] 3. **1週間後・1ヶ月後**: GA4で流入を確認し、`news/news.js` の `kpi` に記録（手順は付録F。転記は `scripts/update-kpi.js --target news`）
- [ ] 4. LinkedInのリーチ・エンゲージメント数値を C-4 の記録欄に転記
- [ ] 5. 月次レビュー（`reviews/YYYY-MM.md`）の発信欄に反映

## F. 付録: GA4での効果測定手順（Task 7-4）

「発信 → 流入 → 読了 → 問い合わせ」を数字で追う。特に**海外KPI（30件）への寄与を分離**して見る。

### F-1. 参照元/メディア別の流入確認

1. [GA4](https://analytics.google.com/) →「レポート」→「集客」→「トラフィック獲得」
2. ディメンションを「セッションの参照元/メディア」にすると `prtimes.jp / referral`、`linkedin.com / social`、`clutch.co / referral` が並ぶ
3. より正確にはディメンション「セッションのキャンペーン」で `pr01_equal_exchange` に絞る（UTMが効いている流入だけを見る）

### F-2. 英語LinkedIn経由（= 海外KPIの先行指標）を分離して見る

1. 「探索」→ 自由形式レポートを作成
2. ディメンション: 「セッションの手動広告コンテンツ」（= `utm_content`）、指標: セッション・エンゲージメント
3. `utm_content = en` の行が**英語投稿経由の流入**。この数字が動き始めたら、LinkedInのDM・コメントと突き合わせて海外KPI（問い合わせ30件）の先行指標として月次レビューに記録する

### F-3. /news/ 配下の閲覧・読了・CTAクリック

- **閲覧数**: 「レポート」→「エンゲージメント」→「ページとスクリーン」でページパス `/news/` をフィルタ
- **読了率**: 「探索」でイベント `read_complete` をイベントパラメータ `article_id`（例: pr01）で絞る。読了率 = read_complete数 ÷ 該当ページ表示回数
- **CTAクリック**: 同様にイベント `cta_click` を `article_id` で絞る。/news/ 経由の問い合わせ転換の先行指標
- 月次転記: `article_id, views, read_complete` のCSVを作り `node scripts/update-kpi.js <csv> --target news` で `news/news.js` の kpi に反映（Task 7-4 で対応）
