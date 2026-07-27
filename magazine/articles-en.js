// Magazine 記事の英語メタデータ。
//
// 記事本文は日本語のまま公開し、/en/magazine/ の一覧だけを英語で出す。
// キーは magazine/articles.js の `id` と一致させること。
//
// ▼ 新しい Magazine 記事を追加したら、ここにも1件足してください。
//    足し忘れた記事は /en/magazine/ の一覧に "Untranslated" として並び、
//    日本語のタイトルがそのまま出ることはありません。
const ARTICLES_EN = {
  '01': {
    title: 'Shake Shack Japan — Site Launch',
    excerpt: 'A new official site for Shake Shack Japan, from UI design through front-end build.'
  },
  '02': {
    title: 'Shopify Liquid: Implementation Tips',
    excerpt: 'Practical Liquid techniques from e-commerce builds — metafields, custom sections, performance.'
  },
  '03': {
    title: 'Bringing Brutalism to the Web',
    excerpt: 'The philosophy behind brutalist design and how it shaped this studio\'s own site.'
  },
  '04': {
    title: 'nahrin — Site Renewal',
    excerpt: 'A full renewal of the nahrin website.'
  },
  '05': {
    title: 'How We Build Custom WordPress Themes',
    excerpt: 'Our approach to custom theme development and client-maintainable builds.'
  },
  '06': {
    title: 'Interview — What Comes Next for BOATship',
    excerpt: 'A conversation with the makers about where the studio is heading.'
  },
  '07': {
    title: 'Where DotGothic16 Works',
    excerpt: 'Choosing and using a pixel typeface with intent.'
  },
  '08': {
    title: 'Running Production on GitHub Pages',
    excerpt: 'Lessons from operating a production site on static hosting.'
  },
  '09': {
    title: 'Now Accepting New Projects',
    excerpt: 'The studio is open for new work.'
  }
};
