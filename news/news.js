/*
 * BOATship News — プレスリリース・メディア掲載・お知らせのデータ
 *
 * 設計思想: 自社サイトが原本（canonical）。外部媒体（PR TIMES / LinkedIn /
 * Clutch 等）は入口であり、すべての流入を /news/ に集めて読了計測とCTAで
 * 問い合わせに転換する。
 *
 * フィールド:
 *   type         … "press-release" | "media-coverage" | "announcement"
 *                  press-release / announcement は /news/<slug>/ を静的生成。
 *                  media-coverage は一覧に外部リンクとして表示するだけ（ページ生成なし）
 *   slug         … 個別ページのURL（英数字ケバブケース）。media-coverage は null 可
 *   subtitle     … PR TIMES のサブタイトル相当（一覧・個別ページのリードに表示）
 *   body         … 原本全文（HTML）。media-coverage は null 可
 *   distribution … 外部配信の記録。配信後に人間がURLを追記してコミットすると
 *                  個別ページ下部に「掲載先」リンクが自動表示される
 *   mediaOutlet  … type: media-coverage のときの媒体名
 *   externalUrl  … 掲載先URL（media-coverage）
 *   isBacklink   … 被リンク(follow)を獲得できたか。LinkedIn は nofollow のため
 *                  被リンク獲得は PR TIMES 二次掲載・Clutch 等が担う。
 *                  どの発信が被リンクを生んだかを記録し翌年の媒体選定に使う
 *   kpi          … 実測値（scripts/update-kpi.js --target news で更新）
 */
const NEWS = [
  {
    id: "an01",
    type: "announcement",
    slug: "owned-media-launch",
    title: "コーポレートサイトを刷新し、オウンドメディア「Notes」を本格始動しました",
    subtitle: "学術エビデンスとアクセス実績で記事を育てる自動更新型オウンドメディア。英語ページ・問い合わせ窓口も開設",
    date: "2026-07-13",
    readTime: 3,
    body: `<p>BOATshipは、コーポレートサイト（www.boatship.jp）を刷新し、インナーブランディングと広報企画に特化したオウンドメディア「Notes」を本格始動しました。あわせて、海外企業・エージェント向けの英語ページと、問い合わせ窓口を開設しています。</p>
<h2>Notes — 学術エビデンスとアクセス実績で記事を育てる</h2>
<p>「<a href="/notes/">Notes</a>」は、インナーブランディング・広報企画の実務に使える記事を、実在の学術文献にもとづいて公開するオウンドメディアです。各記事は読了率などのアクセス実績を計測し、実測値にもとづいて継続的にチューニングします。記事の一部は週次で自動生成され、人間のレビューを経て公開される運用です。</p>
<h2>英語ページと問い合わせ窓口</h2>
<p>日本市場への参入を検討する海外企業・エージェント向けに<a href="/en/about/">英語ページ</a>を開設しました。ブランド開発・カンパニーメディア制作・PR戦略の3領域でご相談いただけます。お問い合わせは<a href="/contact/">問い合わせページ</a>から。等価交換報酬制度（お金以外の価値での対価）でのご依頼も歓迎します。</p>`,
    ogImage: "../images/og-image.png",
    distribution: {
      prtimes:  { url: null, publishedAt: null },
      linkedin: { urlJa: null, urlEn: null, publishedAt: null }
    },
    mediaOutlet: null,
    externalUrl: null,
    isBacklink: null,
    kpi: { views: null, readRate: null, recordedAt: null }
  }
];
