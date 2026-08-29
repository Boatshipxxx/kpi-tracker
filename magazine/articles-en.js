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
  },
  '10': {
    // Notes 英語版（旧 theme: culture）から移行したフル英語記事。
    // body があるため /en/magazine/<slug>/ が静的生成され、一覧もそこへリンクする。
    title: "Why We Accept Vegetables as Payment: BOATship's Equal Exchange Model",
    excerpt: "A Tokyo design studio that takes fresh produce, workspace, and skills as payment. Why we built an equal exchange model — and how it actually works.",
    slug: "equal-exchange-compensation",
    num: '#10E',
    lang: 'en',
    category: 'Culture',
    date: "2026.07.13",
    readTime: 6,
    hero: '../images/pine-note-imege.png',
    evidence: [{"title":"The Gift (Essai sur le don) — how reciprocity binds communities","source":"Mauss, M. (1925)","url":""},{"title":"Influence: The Psychology of Persuasion — the reciprocity principle","source":"Cialdini, R. B. (1984)","url":""}],
    body: `<p>"We'd love to work with you, but we don't have the budget." Every time we heard this, something felt wasted. The project's potential and the passion behind it were real — the only thing missing was money. That discomfort is where BOATship's <em>equal exchange compensation</em> model began.</p>
<h2>How the model works</h2>
<p>Equal exchange compensation means BOATship accepts payment for design, PR, and production work in forms of value other than money. Skills, space, connections, services, goods — anything both sides can agree is a fair trade becomes the fee. (To be clear: we also happily accept yen. This model runs alongside standard billing, not instead of it.)</p>
<h2>Why we needed it</h2>
<p><a href="/en/notes/regional-brand-development/">Regional producers</a>, startups, NPOs, independent creators — many of them have something worth telling the world about, but no marketing budget. In Japan, this is especially true outside the big cities: family farms and small manufacturers in regional areas often carry decades of craft with no communications budget at all. What BOATship has is design and PR skills. Exchange the two, and work that matters to both sides becomes possible.</p>
<h2>What it looks like in practice</h2>
<p>One farm pays for its website with a monthly box of fresh vegetables. A shared-office brand traded co-working space for its branding work. In both cases, the relationship went deeper than a standard client engagement — because both sides keep asking what the work is really worth to them.</p>
<h2>How do you decide what's "equal"?</h2>
<p>The hard part is judging equivalence. Our answer is deliberately simple: both sides confirm, "Am I genuinely satisfied with this trade?" Not market price, but each party's situation and intent. That flatness — no one is the buyer, no one is the vendor — is the heart of the model. If you know the Japanese phrase <em>o-tagai-sama</em> (roughly, "we're in this together"), that's the cultural instinct it draws on.</p>
<h2>Where this goes next</h2>
<p>Equal exchange compensation is also <a href="/en/magazine/barter-and-resource-sharing/">an experiment in how we want to work</a>. Money is not the only measure of value — we want to prove that one project at a time, including with partners outside Japan. If the model interests you, <a href="/en/contact/">start a conversation</a>. Tell us what you make; we'll tell you what we make. Maybe it's a trade.</p>`
  },
  '11': {
    // Notes 英語版（旧 theme: culture）から移行したフル英語記事。
    // body があるため /en/magazine/<slug>/ が静的生成され、一覧もそこへリンクする。
    title: "Where Design Thinking Ends and Business Art Begins",
    excerpt: "Why we call ourselves a Business Art Team rather than a design studio — and why we deliberately blur the line between design and business.",
    slug: "design-thinking-business-art",
    num: '#11E',
    lang: 'en',
    category: 'Culture',
    date: "2026.07.27",
    readTime: 6,
    hero: '../images/pine-note-imege.png',
    evidence: [{"title":"Design Thinking — the article that brought design thinking into management","source":"Brown, T. (2008). Harvard Business Review, 86(6)","url":"https://hbr.org/2008/06/design-thinking"}],
    body: `<p>When we started calling ourselves a "Business Art Team," we hesitated. "Design studio" or "creative agency" would communicate faster. But those words were missing something. What BOATship wants to do is deliberately blur the line between design and business.</p>
<h2>What design thinking actually is</h2>
<p>Design thinking is a process for solving problems: observe, define, ideate, prototype, test. Run the cycle and you converge on a better answer. It originated in product design, but the same thinking applies to business development and communication design — which is exactly why Tim Brown's 2008 argument for bringing it into management landed so widely.</p>
<h2>The idea behind "business art"</h2>
<p>Art is self-expression; business is <a href="/en/magazine/equal-exchange-compensation/">an exchange of value</a>. They look like opposites, but the strongest businesses have expression in them. Apple and Nike both carry an artistic intent in their products and their communication. What BOATship aims for is bringing the artist's perspective into the business.</p>
<h2>Why blur the line on purpose</h2>
<p>Design alone produces things detached from business context. Business alone produces nothing that moves people. The people who can blur that line are the ones most needed right now. That is the position BOATship works from.</p>
<h2>"Business Art" as practice</h2>
<p>Concretely: we interview the client about their business problem, then approach it from <a href="/en/notes/pr-planning-peso-model/">both the design and the PR side</a>. Even when making a single logo, we ask what role it plays in the business. We are not chasing surface beauty — we are chasing beauty that functions.</p>`
  },
  '12': {
    // Notes 英語版（旧 theme: culture）から移行したフル英語記事。
    // body があるため /en/magazine/<slug>/ が静的生成され、一覧もそこへリンクする。
    title: "Six Months of Getting Paid in Vegetables, Studio Space, and Skills",
    excerpt: "What actually changes when money leaves the transaction — including the parts that are harder than they sound.",
    slug: "barter-and-resource-sharing",
    num: '#12E',
    lang: 'en',
    category: 'Culture',
    date: "2026.07.27",
    readTime: 4,
    hero: '../images/pine-note-imege.png',
    evidence: [{"title":"You are what you can access — research on sharing and collaborative consumption","source":"Belk, R. (2014). Journal of Business Research, 67(8)","url":"https://doi.org/10.1016/j.jbusres.2013.10.001"}],
    body: `<p>It has been six months since we started <a href="/en/magazine/equal-exchange-compensation/">equal exchange compensation</a>. Here is an honest look at how the work itself changed when we began accepting value instead of money.</p>
<h2>Barter in practice is smoother than it sounds</h2>
<p>"Barter" can sound primitive. In practice it runs surprisingly smoothly. Without the transfer of money, the way both sides approach the project changes. You stop being the party who pays and the party who is paid, and become partners producing value together.</p>
<h2>The interesting part: sharing resources</h2>
<p>The most common trade turned out to be skill for skill. With one photographer we exchanged web design for a shoot. With a chef we exchanged restaurant <a href="/en/notes/regional-brand-development/">branding</a> for a monthly staff meal. Because money is not in the middle, the connection between people is direct. Russell Belk's research on access-based consumption makes a related point: what you can access increasingly defines you more than what you own.</p>
<h2>The problems we ran into</h2>
<p>There are real difficulties. Agreeing on what counts as "equal" is sometimes hard. And exchanges that span time — we produce first, receive later — rest entirely on trust. Even so, the projects that got through those difficulties are the ones that lasted.</p>
<h2>What money cannot buy</h2>
<p>The greatest value from equal exchange is the part money cannot buy: trust, relationship, experience, community. These accumulate through money and time as well, but the equal exchange process concentrates them. We intend to keep running this model.</p>`
  }
};
