/*
 * BOATship News — English editions
 *
 * 英語版ニュースのデータ。日本語版（news/news.js の NEWS）とはライフサイクルを
 * 分離するため別ファイルで管理する。
 *
 * フィールドは NEWS と共通 + 以下:
 *   lang     … "en" 固定
 *   sourceId … 元になった日本語ニュースの id（hreflang の相互リンクに使用）
 *
 * ビルド: scripts/build-articles.js が /en/news/<slug>/index.html を生成し、
 * 対応する日本語ページと hreflang（ja/en/x-default）を相互設定する。
 *
 * 配信URL（distribution）は日本語版に記録する運用のため、本ファイルでは
 * 原則 null のままとし、必要な場合のみ英語配信先を記録する。
 */
const NEWS_EN = [
  {
    id: "pr01-en",
    lang: "en",
    sourceId: "pr01",
    type: "press-release",
    slug: "equal-exchange-compensation-launch",
    title: "Paid in Vegetables and Workspace: BOATship Publishes Results From Its Equal Exchange Compensation Model",
    subtitle: "A Tokyo design and PR studio that accepts value other than money — a website traded for a monthly vegetable box, branding traded for co-working access",
    date: "2026-07-14",
    readTime: 5,
    body: `<p>BOATship, a design and PR studio based in Jimbocho, Tokyo, has published operating results from its <em>equal exchange compensation</em> model, under which the studio accepts payment for its work in forms of value other than money. A farm pays for its website with a monthly box of vegetables; a shared-office brand traded co-working access for its branding. The model is an experiment in restarting projects that had stalled purely on budget.</p>
<h2>What equal exchange compensation is</h2>
<p>Equal exchange compensation lets clients pay for BOATship's design, PR, and production work with value other than money. Skills, space, connections, services, goods — anything both sides can agree is a fair trade becomes the fee.</p>
<p>The test for "equal" is not a market-price appraisal. Both sides simply confirm: "am I genuinely satisfied with this trade?" That flatness — decided by each party's situation and intent — is the core of the model. The process runs in three steps: (1) the client proposes what value they can offer, (2) both sides align on scope and scale, (3) once both agree, the terms of the exchange are documented and work begins. The model runs alongside conventional paid contracts and is selected per project.</p>
<h2>Who it is for, and what kinds of payment</h2>
<p>The model is aimed primarily at organizations that have something worth communicating but struggle to secure a communications or design budget: regional producers, startups, NPOs, and independent creators. (For readers outside Japan: "regional" here means the parts of the country outside the major metropolitan areas, where family-run makers frequently operate for generations without a marketing function.) Accepted value has ranged from produce and access to space, through skills such as photography, cooking, and construction, to services and goods — and can be combined with partial payment in yen.</p>
<h2>Why we started it</h2>
<p>The origin was discomfort with a sentence we kept hearing: "we don't have the budget, so we can't ask you." The potential and the passion behind the project were real; it seemed wasteful to be unable to work together purely for lack of money. The fuller account is published on our owned media as <a href="/en/notes/equal-exchange-compensation/">Why We Accept Vegetables as Payment</a>.</p>
<h2>Operating examples</h2>
<p><strong>Example 1: Website production × a monthly box of fresh vegetables</strong> — With one farm, we contracted to receive fresh produce monthly in exchange for building their website. With no money changing hands, the relationship became less "client and vendor" and more "partners producing value together," and we have continued supporting improvements after launch.</p>
<p><strong>Example 2: Branding × co-working space access</strong> — With a shared-office operator, we exchanged branding work for access to their co-working space. Without money in the middle, a relationship of deeper understanding of their business has continued. Skill-for-skill exchanges, such as trading web design with a photographer for a shoot, remain the most common pattern in practice.</p>
<h2>What six months of operation revealed</h2>
<p>Running the model for six months surfaced real challenges. Reaching agreement on what is "equal" requires time in conversation, and exchanges that span time — producing first, receiving later — rest on trust. That said, projects that went through that agreement process have proved to be the longest-lasting relationships. The greatest value from equal exchange is the part money cannot buy: trust, relationship, experience, and community. The operating record is published as <a href="/en/notes/barter-and-resource-sharing/">Six Months of Getting Paid in Vegetables, Studio Space, and Skills</a>.</p>
<h2>What comes next</h2>
<p>BOATship will continue the model as an experiment in working where money is not the only measure of value. We plan to extend equal exchange to overseas partners, and have published <a href="/en/about/">English pages</a> introducing the studio and the model. Findings and measured data will continue to be published on our owned media.</p>
<h2>Comment from the representative</h2>
<p>[[代表コメント:要記入 — 英訳も必要]]</p>
<h2>Enquiries and press</h2>
<p>Enquiries about working with us under equal exchange compensation are accepted through our <a href="/en/contact/">contact page</a>. Please tell us what value you can offer. We also welcome press enquiries about the model.</p>
<h2>Company information</h2>
<p>Name: BOATship Inc. / Location: Jimbocho, Tokyo, Japan / Founded: April 2022 / Representative: Simon Kosaka / Business: company media production, PR strategy, brand consulting (BOAT division); product development, creative direction, craft planning (ship division) / URL: https://www.boatship.jp/ / Contact: contact@boatship.jp</p>`,
    ogImage: "../images/og-image.png",
    distribution: {
      prtimes:  { url: null, publishedAt: null },
      linkedin: { urlJa: null, urlEn: null, publishedAt: null }
    },
    mediaOutlet: null,
    externalUrl: null,
    isBacklink: null,
    kpi: { views: null, readRate: null, recordedAt: null }
  },
  {
    id: "an01-en",
    lang: "en",
    sourceId: "an01",
    type: "announcement",
    slug: "owned-media-launch",
    title: "BOATship Relaunches Its Corporate Site and Opens \"Notes,\" an Evidence-Based Owned Media",
    subtitle: "Articles tuned against academic evidence and real access metrics. English pages and an enquiry channel are now open.",
    date: "2026-07-13",
    readTime: 3,
    body: `<p>BOATship has relaunched its corporate site (www.boatship.jp) and formally opened <em>Notes</em>, an owned media specializing in internal branding and PR planning. English pages for overseas companies and agencies, along with an enquiry channel, have opened alongside it.</p>
<h2>Notes — articles grown from academic evidence and access data</h2>
<p><a href="/en/notes/">Notes</a> publishes practical articles on internal branding and PR planning, each grounded in real academic literature. Every article measures access data including read rate, and is tuned continuously against those measured values. Part of the publishing schedule is generated weekly and published after human review.</p>
<h2>English pages and enquiries</h2>
<p>We have opened <a href="/en/about/">English pages</a> for international companies and agencies considering the Japanese market. We work across three areas: brand development for the Japanese market, company media production, and PR strategy. Enquiries go through our <a href="/en/contact/">contact page</a>. We also welcome enquiries under our equal exchange compensation model, where part of the fee is paid in value other than money.</p>`,
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
