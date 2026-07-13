/*
 * BOATship Notes — English editions
 *
 * 英語版記事のデータ。日本語記事（notes.js の NOTES）とはライフサイクルを
 * 分離するため別ファイルで管理する（admin・週次自動更新は notes.js のみを
 * 対象とし、本ファイルには触れない）。
 *
 * フィールドは NOTES と共通 + 以下:
 *   lang     … "en" 固定
 *   sourceId … 元になった日本語記事の id（hreflang の相互リンクに使用）
 *
 * ビルド: scripts/build-articles.js が /en/notes/<slug>/index.html を生成し、
 * 対応する日本語記事ページと hreflang（ja/en/x-default）を相互設定する。
 */
const NOTES_EN = [
  {
    id: "n01-en",
    lang: "en",
    sourceId: "n01",
    slug: "equal-exchange-compensation",
    num: "#01E",
    category: "Essay",
    title: "Why We Accept Vegetables as Payment: BOATship's Equal Exchange Model",
    date: "2026.07.13",
    readTime: 6,
    theme: "culture",
    image: "../images/pine-note-imege.png",
    evidence: [{"title":"The Gift (Essai sur le don) — how reciprocity binds communities","source":"Mauss, M. (1925)","url":""},{"title":"Influence: The Psychology of Persuasion — the reciprocity principle","source":"Cialdini, R. B. (1984)","url":""}],
    kpi: {"views":null,"readRate":null,"reactions":null,"recordedAt":""},
    tuningMemo: "English edition of n01. Watch inbound queries from overseas; if read rate is low, try a case-study-first structure.",
    excerpt: "A Tokyo design studio that takes fresh produce, workspace, and skills as payment. Why we built an equal exchange model — and how it actually works.",
    body: `<p>"We'd love to work with you, but we don't have the budget." Every time we heard this, something felt wasted. The project's potential and the passion behind it were real — the only thing missing was money. That discomfort is where BOATship's <em>equal exchange compensation</em> model began.</p>
<h2>How the model works</h2>
<p>Equal exchange compensation means BOATship accepts payment for design, PR, and production work in forms of value other than money. Skills, space, connections, services, goods — anything both sides can agree is a fair trade becomes the fee. (To be clear: we also happily accept yen. This model runs alongside standard billing, not instead of it.)</p>
<h2>Why we needed it</h2>
<p>Regional producers, startups, NPOs, independent creators — many of them have something worth telling the world about, but no marketing budget. In Japan, this is especially true outside the big cities: family farms and small manufacturers in regional areas often carry decades of craft with no communications budget at all. What BOATship has is design and PR skills. Exchange the two, and work that matters to both sides becomes possible.</p>
<h2>What it looks like in practice</h2>
<p>One farm pays for its website with a monthly box of fresh vegetables. A shared-office brand traded co-working space for its branding work. In both cases, the relationship went deeper than a standard client engagement — because both sides keep asking what the work is really worth to them.</p>
<h2>How do you decide what's "equal"?</h2>
<p>The hard part is judging equivalence. Our answer is deliberately simple: both sides confirm, "Am I genuinely satisfied with this trade?" Not market price, but each party's situation and intent. That flatness — no one is the buyer, no one is the vendor — is the heart of the model. If you know the Japanese phrase <em>o-tagai-sama</em> (roughly, "we're in this together"), that's the cultural instinct it draws on.</p>
<h2>Where this goes next</h2>
<p>Equal exchange compensation is also an experiment in how we want to work. Money is not the only measure of value — we want to prove that one project at a time, including with partners outside Japan. If the model interests you, <a href="/en/contact/">start a conversation</a>. Tell us what you make; we'll tell you what we make. Maybe it's a trade.</p>`
  }
];
