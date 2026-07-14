# Clutch 登録プレイブック

> 目的: 海外KPI（問い合わせ30件）と被リンク獲得を同時に取りに行く。Clutchは海外企業が
> 日本のB2Bサービス提供者を探す主要経路であり、第三者ドメインからの被リンク源にもなる。
>
> ⚠️ **無料プランの範囲・審査基準・レビュー収集の仕組みは変動します。登録前に必ず
> 公式サイトで最新条件を確認**してください。本書は手順の流れと確認項目のみを示します。
> - 登録の入口: https://clutch.co/get-listed
> - 掲載条件のヘルプ: https://help.clutch.co/en/knowledge/fit-for-clutch

## 0. 登録前チェックリスト（公式サイトで確認する項目）

- [ ] 掲載条件（B2Bサービス提供者であること。ブランディング・デザインは対象カテゴリに含まれるが、最新の分類を確認）
- [ ] 無料プランでできる範囲（プロフィール項目・レビュー収集・リンク設定）
- [ ] 審査の有無・所要期間
- [ ] レビューの収集方法（クライアントへのリンク送付 / Clutch側の電話インタビュー等、現行の仕組み）
- [ ] レビュー対象の条件（金銭契約が必須か。等価交換案件が対象になるか）

## 1. 登録フロー

1. **アカウント作成**: https://clutch.co/get-listed から会社アカウントを作成
2. **プロフィール入力**: `clutch-profile-en.md` の下書きを入力欄に合わせて転記
   - 会社概要は入力欄の文字数制限に応じて50語版/150語版を使い分け
   - Service lines の構成比は同ファイルの提案（Branding 35 / Content・Company media 35 / PR 30）
   - **差別化要素として equal exchange compensation を必ず前面に**（海外バイヤーの記憶に残る一点）
   - 表現は /en/about/ と統一（矛盾する会社説明を作らない）
3. **ケーススタディ登録**: `clutch-case-studies-en.md` の2本（Shake Shack / 等価交換の農家サイト）。クライアント名の公開可否を事前確認し、不可なら "Confidential" 扱いで登録
4. **審査**: Clutch側の審査を待つ（期間は要確認）。差し戻しがあれば指摘に沿って修正
5. **レビュー依頼**: 公開されたら `review-request-templates.md` を使って既存クライアントに依頼（**ここが可視性の鍵。登録だけでは効果が薄い**）
6. **公開後の設定**: 下記2をすぐ実施

## 2. 登録完了後にやること

- [ ] **Webサイトリンクの設定**: プロフィールの Website に UTM付きURLを設定
  `https://www.boatship.jp/?utm_source=clutch&utm_medium=referral&utm_campaign=directory`
- [ ] **被リンクの記録**: `news/news.js` にエントリを追加してコミット（被リンク資産として管理）:
  ```javascript
  {
    id: "mcXX",  // 連番
    type: "media-coverage",
    slug: null,
    title: "Clutch にBOATshipのプロフィールを掲載",
    subtitle: null,
    date: "YYYY-MM-DD",
    body: null,
    ogImage: null,
    distribution: null,
    mediaOutlet: "Clutch",
    externalUrl: "（ClutchのプロフィールURL）",
    isBacklink: true,  // プロフィールからのリンクがfollowか確認して記録
    kpi: { views: null, readRate: null, recordedAt: null }
  }
  ```
- [ ] GA4で `clutch.co / referral` の流入を月次確認（手順は docs/press-distribution-playbook.md 付録F）
- [ ] レビュー獲得数を月次レビュー（reviews/YYYY-MM.md）に累計で記録

## 3. 運用のリズム

- プロジェクト完了のたびにレビュー依頼（完了直後が最も応じてもらいやすい）
- 四半期に一度、プロフィール・ケーススタディを見直し（新しい実績・数値の追記）
- Clutchプロフィール経由の問い合わせは「海外KPI 30件」にカウントし、月次レビューの海外欄に記録

## 4. 将来の追加候補: 他の海外ディレクトリ（今回は登録しない）

追加するときは、以下のチェックリストで媒体ごとに判断する:

- [ ] 掲載は無料か（有料なら被リンク+流入の期待値が費用に見合うか）
- [ ] 自社サイトへのリンクは follow か（nofollowなら被リンク価値なし。発見経路としての価値のみで判断）
- [ ] ターゲット（日本市場に関心のある海外企業）がその媒体を実際に使っているか
- [ ] レビュー・掲載維持の運用負荷（Clutchと二重にレビュー依頼する負荷に耐えられるか）
- [ ] プロフィール表現は /en/about/・Clutch と矛盾しないか

候補: **Sortlist**（欧州圏に強いとされる）/ **DesignRush** / **Agency Spotter**。いずれも条件・実勢は変動するため、追加検討時に公式サイトで確認する。
