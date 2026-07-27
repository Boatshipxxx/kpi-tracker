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
 *
 * 翻訳方針: 直訳ではなく海外読者（日本市場参入を検討する企業・エージェント）
 * 向けに再構成する。日本の商習慣・地方企業の文脈など馴染みのない前提には
 * 1〜2文の補足を入れる。本文中の内部リンクは /en/notes/<slug>/ を指す。
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
    related: ["n04-en", "n07-en"],
    evidence: [{"title":"The Gift (Essai sur le don) — how reciprocity binds communities","source":"Mauss, M. (1925)","url":""},{"title":"Influence: The Psychology of Persuasion — the reciprocity principle","source":"Cialdini, R. B. (1984)","url":""}],
    kpi: {"views":null,"readRate":null,"reactions":null,"recordedAt":""},
    tuningMemo: "English edition of n01. Watch inbound queries from overseas; if read rate is low, try a case-study-first structure.",
    excerpt: "A Tokyo design studio that takes fresh produce, workspace, and skills as payment. Why we built an equal exchange model — and how it actually works.",
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
<p>Equal exchange compensation is also <a href="/en/notes/barter-and-resource-sharing/">an experiment in how we want to work</a>. Money is not the only measure of value — we want to prove that one project at a time, including with partners outside Japan. If the model interests you, <a href="/en/contact/">start a conversation</a>. Tell us what you make; we'll tell you what we make. Maybe it's a trade.</p>`
  },
  {
    id: "n02-en",
    lang: "en",
    sourceId: "n02",
    slug: "regional-brand-development",
    num: "#02E",
    category: "Column",
    title: "What Building Brands Outside Tokyo Taught Us",
    date: "2026.07.27",
    readTime: 5,
    theme: "pr-planning",
    image: "../images/pine-note-imege.png",
    related: ["n06-en", "n03-en"],
    evidence: [{"title":"Competitive Identity — place brands are edited, not invented","source":"Anholt, S. (2007). Palgrave Macmillan","url":""}],
    kpi: {"views":null,"readRate":null,"reactions":null,"recordedAt":""},
    tuningMemo: "English edition of n02. Aimed at overseas readers considering regional Japan. If read rate is low, lead with a concrete client scenario.",
    excerpt: "Outside Japan's major cities, brands already have what city brands try to manufacture: context. Here is what changes when you build a brand there.",
    body: `<p>Looking back at the regional projects BOATship has worked on, one pattern repeats: these companies have real strengths they cannot see themselves. (A note for readers outside Japan — "regional" here means the vast part of the country outside Tokyo and Osaka, where family-run makers and producers often operate for generations with no marketing function at all.)</p>
<h2>A regional brand's strength is its context</h2>
<p>City brands work hard to manufacture distinctiveness. Regional brands already have it. The land, the history, the people, the way something is made — these are genuine assets that cannot be reproduced in a city. Simon Anholt's work on competitive identity makes the same point about places: you do not invent a place brand, you edit what is already there. Our job in branding is to turn that existing context into language a brand can actually speak.</p>
<h2>Do not treat "local" as a weakness</h2>
<p>People often say that <a href="/en/notes/pr-planning-peso-model/">getting the word out</a> is harder from a regional base. We find the opposite. Being close to production means the distance between maker and customer is short, and relationships can have faces attached. With a website and social channels, that closeness becomes content in itself — something a Tokyo head office cannot fake.</p>
<h2>What we hold to</h2>
<p>When we work with a regional company, we consciously avoid importing "the Tokyo sensibility." We first understand the place and the people the brand lives among; only then do <a href="/en/notes/design-thinking-business-art/">language and design</a> come. An outside perspective combined with material that is already there — that combination is what builds the brand.</p>
<h2>What it takes to actually land</h2>
<p>The most important variable in regional brand development is the resolution of "who are we reaching." Try to reach everyone and you reach no one. Words written for one person you can picture end up traveling much further.</p>`
  },
  {
    id: "n03-en",
    lang: "en",
    sourceId: "n03",
    slug: "design-thinking-business-art",
    num: "#03E",
    category: "Essay",
    title: "Where Design Thinking Ends and Business Art Begins",
    date: "2026.07.27",
    readTime: 6,
    theme: "culture",
    image: "../images/pine-note-imege.png",
    related: ["n01-en", "n02-en"],
    evidence: [{"title":"Design Thinking — the article that brought design thinking into management","source":"Brown, T. (2008). Harvard Business Review, 86(6)","url":"https://hbr.org/2008/06/design-thinking"}],
    kpi: {"views":null,"readRate":null,"reactions":null,"recordedAt":""},
    tuningMemo: "English edition of n03. Explains the 'Business Art Team' positioning to overseas readers. Consider adding a concrete project example if read rate is low.",
    excerpt: "Why we call ourselves a Business Art Team rather than a design studio — and why we deliberately blur the line between design and business.",
    body: `<p>When we started calling ourselves a "Business Art Team," we hesitated. "Design studio" or "creative agency" would communicate faster. But those words were missing something. What BOATship wants to do is deliberately blur the line between design and business.</p>
<h2>What design thinking actually is</h2>
<p>Design thinking is a process for solving problems: observe, define, ideate, prototype, test. Run the cycle and you converge on a better answer. It originated in product design, but the same thinking applies to business development and communication design — which is exactly why Tim Brown's 2008 argument for bringing it into management landed so widely.</p>
<h2>The idea behind "business art"</h2>
<p>Art is self-expression; business is <a href="/en/notes/equal-exchange-compensation/">an exchange of value</a>. They look like opposites, but the strongest businesses have expression in them. Apple and Nike both carry an artistic intent in their products and their communication. What BOATship aims for is bringing the artist's perspective into the business.</p>
<h2>Why blur the line on purpose</h2>
<p>Design alone produces things detached from business context. Business alone produces nothing that moves people. The people who can blur that line are the ones most needed right now. That is the position BOATship works from.</p>
<h2>"Business Art" as practice</h2>
<p>Concretely: we interview the client about their business problem, then approach it from <a href="/en/notes/pr-planning-peso-model/">both the design and the PR side</a>. Even when making a single logo, we ask what role it plays in the business. We are not chasing surface beauty — we are chasing beauty that functions.</p>`
  },
  {
    id: "n04-en",
    lang: "en",
    sourceId: "n04",
    slug: "barter-and-resource-sharing",
    num: "#04E",
    category: "Column",
    title: "Six Months of Getting Paid in Vegetables, Studio Space, and Skills",
    date: "2026.07.27",
    readTime: 4,
    theme: "culture",
    image: "../images/pine-note-imege.png",
    related: ["n01-en", "n03-en"],
    evidence: [{"title":"You are what you can access — research on sharing and collaborative consumption","source":"Belk, R. (2014). Journal of Business Research, 67(8)","url":"https://doi.org/10.1016/j.jbusres.2013.10.001"}],
    kpi: {"views":null,"readRate":null,"reactions":null,"recordedAt":""},
    tuningMemo: "English edition of n04. The operational-reality piece that pairs with n01. If read rate is low, move the 'what doesn't work' section higher.",
    excerpt: "What actually changes when money leaves the transaction — including the parts that are harder than they sound.",
    body: `<p>It has been six months since we started <a href="/en/notes/equal-exchange-compensation/">equal exchange compensation</a>. Here is an honest look at how the work itself changed when we began accepting value instead of money.</p>
<h2>Barter in practice is smoother than it sounds</h2>
<p>"Barter" can sound primitive. In practice it runs surprisingly smoothly. Without the transfer of money, the way both sides approach the project changes. You stop being the party who pays and the party who is paid, and become partners producing value together.</p>
<h2>The interesting part: sharing resources</h2>
<p>The most common trade turned out to be skill for skill. With one photographer we exchanged web design for a shoot. With a chef we exchanged restaurant <a href="/en/notes/regional-brand-development/">branding</a> for a monthly staff meal. Because money is not in the middle, the connection between people is direct. Russell Belk's research on access-based consumption makes a related point: what you can access increasingly defines you more than what you own.</p>
<h2>The problems we ran into</h2>
<p>There are real difficulties. Agreeing on what counts as "equal" is sometimes hard. And exchanges that span time — we produce first, receive later — rest entirely on trust. Even so, the projects that got through those difficulties are the ones that lasted.</p>
<h2>What money cannot buy</h2>
<p>The greatest value from equal exchange is the part money cannot buy: trust, relationship, experience, community. These accumulate through money and time as well, but the equal exchange process concentrates them. We intend to keep running this model.</p>`
  },
  {
    id: "n05-en",
    lang: "en",
    sourceId: "n05",
    slug: "inner-branding-organizational-identification",
    num: "#05E",
    category: "Research",
    title: "Why Internal Branding Makes Organizations Stronger — The Research on Organizational Identification",
    date: "2026.07.27",
    readTime: 8,
    theme: "inner-branding",
    image: "../images/pine-note-imege.png",
    related: ["n07-en", "n06-en"],
    evidence: [{"title":"Social Identity Theory and the Organization — the foundational theory of organizational identification","source":"Ashforth, B. E., & Mael, F. (1989). Academy of Management Review, 14(1)","url":"https://doi.org/10.5465/amr.1989.4278999"},{"title":"Antecedents and consequences of employee engagement","source":"Saks, A. M. (2006). Journal of Managerial Psychology, 21(7)","url":"https://doi.org/10.1108/02683940610690169"},{"title":"Strategic Internal Communication — empirical work on internal communication and employee satisfaction","source":"Men, L. R. (2014). Management Communication Quarterly, 28(2)","url":"https://doi.org/10.1177/0893318914524536"},{"title":"State of the Global Workplace — international engagement survey","source":"Gallup (2024)","url":"https://www.gallup.com/workplace/349484/state-of-the-global-workplace.aspx"}],
    kpi: {"views":null,"readRate":null,"reactions":null,"recordedAt":""},
    tuningMemo: "English edition of n05. Core research piece for the internal branding cluster. Target search intent: 'internal branding' / 'organizational identification'.",
    excerpt: "Internal branding is not a motivational poster exercise. Social identity theory and engagement research explain the conditions under which it actually works.",
    body: `<p>Say "internal branding" and some people picture staff reciting a company creed or posters on a wall. What BOATship means by it is something else entirely: creating a state where the people inside an organization genuinely feel "I am part of this team." And this is not a matter of sentiment — it is a field with research behind it.</p>
<h2>The key concept: organizational identification</h2>
<p>Ashforth and Mael's 1989 work applied social identity theory to organizations and formalized the concept of <em>organizational identification</em>. People absorb the groups they belong to into their own self-definition. The stronger someone's sense of "I am one of them," the more they experience the organization's success as their own success, and the more they act on the organization's behalf without being told to. That is the skeleton of the theory.</p>
<p>Which means the goal of internal branding is not to constrain people with rules, but to grow a story inside the organization that makes belonging a source of pride.</p>
<h2>Engagement connects directly to performance</h2>
<p>Saks' 2006 empirical study showed that employee engagement raises job satisfaction and organizational commitment while lowering intention to quit. Gallup's international survey continues to report that employees who bring genuine enthusiasm to their work remain a minority worldwide, and that low engagement represents a substantial productivity loss. Read the other way: this is the management resource with the most room for improvement.</p>
<h2>Not "broadcasting" — dialogue</h2>
<p>So what works? Men's 2014 research focused on the channels and quality of internal communication. Organizations that prioritize face-to-face and two-way communication over one-directional announcements show higher employee satisfaction and engagement. The dividing line is whether leadership's words arrive as broadcast or as conversation.</p>
<h2>How BOATship practices this — systems are the strongest message</h2>
<p>In our internal branding work, we design systems and experiences before slogans. As with <a href="/en/notes/equal-exchange-compensation/">our equal exchange compensation model</a>, what an organization truly values shows up in its mechanisms, not its language. When system, behavior, and language align, a set of stated values finally becomes a culture.</p>
<h2>How to use this piece</h2>
<p>This article is updated continuously based on access data and read rate, in line with how we run <a href="/en/notes/pr-planning-peso-model/">our owned media</a>. The studies cited are listed in the evidence section below. Use them directly in internal newsletters, values work, or organizational development proposals.</p>`
  },
  {
    id: "n06-en",
    lang: "en",
    sourceId: "n06",
    slug: "pr-planning-peso-model",
    num: "#06E",
    category: "Playbook",
    title: "PR That Isn't a Firework — The PESO Model and the Science of Story",
    date: "2026.07.27",
    readTime: 7,
    theme: "pr-planning",
    image: "../images/pine-note-imege.png",
    related: ["n05-en", "n02-en"],
    evidence: [{"title":"Spin Sucks — origin of the PESO model (Paid / Earned / Shared / Owned)","source":"Dietrich, G. (2014). Que Publishing","url":""},{"title":"The Role of Transportation in the Persuasiveness of Public Narratives","source":"Green, M. C., & Brock, T. C. (2000). Journal of Personality and Social Psychology, 79(5)","url":"https://doi.org/10.1037/0022-3514.79.5.701"},{"title":"Attitudinal Effects of Mere Exposure","source":"Zajonc, R. B. (1968). Journal of Personality and Social Psychology, 9(2, Pt.2)","url":"https://doi.org/10.1037/h0025848"},{"title":"Edelman Trust Barometer — international survey on whose words are trusted","source":"Edelman (2025)","url":"https://www.edelman.com/trust/trust-barometer"}],
    kpi: {"views":null,"readRate":null,"reactions":null,"recordedAt":""},
    tuningMemo: "English edition of n06. Foundational PR piece; n10-en depends on it. Target search intent: 'PESO model' / 'PR strategy Japan'.",
    excerpt: "Most PR fails because it is designed as a single event. Here is how to design it as a voyage instead — with the psychology of why story moves people.",
    body: `<p>Anyone who has worked in PR has heard it: "We put out the release and nothing happened." Usually the cause is that the PR was designed as a one-time event. BOATship designs PR as a voyage — not a single firework, but a route that moves between several media and accumulates relationships along the way.</p>
<h2>The PESO model — four media on one map</h2>
<p>Gini Dietrich's PESO model organizes the media available to PR into four types: Paid (advertising), Earned (press coverage), Shared (social and word of mouth), and Owned (your own media). What matters is designing these four not as separate initiatives but as a circulation. A story told on Owned leads to Earned coverage, spreads through Shared, and gets amplified with Paid only where needed. The starting point of that circulation is owned media — media like this one.</p>
<h2>There is evidence that story moves people</h2>
<p>Green and Brock's 2000 study demonstrated experimentally that the more a person is transported into a narrative, the more persuasive the messages inside that narrative become. A story with specific names and scenes changes attitudes more than a list of facts. This is why PR material should be prepared in two layers: a fact sheet and a story.</p>
<h2>Frequency of contact is the currency of trust</h2>
<p>As Zajonc's mere exposure research shows, people tend to develop preference for what they encounter repeatedly. Rather than aiming to capture awareness in one shot, it is more rational to design small, continuous contact. One small transmission per week beats one large release per month. An automated publishing rhythm for owned media exists precisely to sustain that frequency.</p>
<h2>Design who does the talking</h2>
<p>What the Edelman Trust Barometer shows year after year is that "someone like me" and "a technical expert" are trusted more than official company statements. So a PR plan should prepare material that people other than the CEO can speak — frontline members, partners. This is where <a href="/en/notes/inner-branding-organizational-identification/">internal branding and PR turn out to be the same continuous surface</a>. An organization whose people <a href="/en/notes/inner-branding-brand-behavior/">speak about it with pride</a> is itself the strongest PR channel you have.</p>
<h2>The BOATship PR planning checklist</h2>
<p>Finally, the questions we use when planning. (1) Where in PESO does this start, and where does it circulate to? (2) Is there a story, not only facts? (3) Is it designed as a sequence of contacts rather than a single hit? (4) Is there a speaker other than the official account? (5) By what metric will we measure effect, and how will it feed the next plan? To answer that fifth question, this media has measurement and tuning built into it.</p>`
  },
  {
    id: "n07-en",
    lang: "en",
    sourceId: "n07",
    slug: "inner-branding-brand-behavior",
    num: "#07E",
    category: "Playbook",
    title: "Turning Values Into Behavior — Brand Citizenship, Job Crafting, and Psychological Safety",
    date: "2026.07.27",
    readTime: 8,
    theme: "inner-branding",
    image: "../images/pine-note-imege.png",
    related: ["n05-en", "n01-en"],
    evidence: [{"title":"Building brand commitment — a behavioral approach to internal brand management","source":"Burmann, C., & Zeplin, S. (2005). Journal of Brand Management, 12(4)","url":""},{"title":"Building and measuring employee-based brand equity","source":"King, C., & Grace, D. (2010). European Journal of Marketing, 44(7/8)","url":""},{"title":"Crafting a Job — reframing employees as active crafters of their work","source":"Wrzesniewski, A., & Dutton, J. E. (2001). Academy of Management Review, 26(2)","url":""},{"title":"Psychological Safety and Learning Behavior in Work Teams","source":"Edmondson, A. (1999). Administrative Science Quarterly, 44(2)","url":"https://doi.org/10.2307/2666999"}],
    kpi: {"views":null,"readRate":null,"reactions":null,"recordedAt":""},
    tuningMemo: "English edition of n07. The 'how' companion to n05's 'why'. Target search intent: 'values into behavior' / 'brand citizenship behavior'.",
    excerpt: "Why stated values so often fail to change behavior — and the behavioral design that closes the gap between knowing and doing.",
    body: `<p>Plenty of organizations have well-crafted values. Behavior on the ground still does not change. The goal of internal branding, as we see it, is not a state where people <em>know</em> the values but one where each person expresses them in their own words and decisions, daily. Getting there takes behavioral design, not posters and recitation.</p>
<h2>Knowing the values does not move anything</h2>
<p>When values fail to take hold, they have usually stopped at awareness. People can recite the values but do not use them as a standard when a deadline looms or a customer complaint lands. The question in internal branding is not "do you remember it" but "can you use it as a guide when you're unsure." How to bridge from awareness to behavior is the center of the design.</p>
<h2>The lens of brand citizenship behavior</h2>
<p>Burmann and Zeplin's 2005 research treated internal brand management behaviorally, emphasizing voluntary employee behavior that embodies the brand promise. King and Grace's 2010 work organized this into a measurable framework as <em>employee-based brand equity</em>. The point is that a brand is built not only from advertising and logos but from the accumulation of each employee's everyday conduct. Values therefore have to be an internal standard for behavior as much as an external expression.</p>
<h2>From obligation to ownership — job crafting</h2>
<p>Behavior does not stick when imposed from above. Wrzesniewski and Dutton's 2001 concept of <em>job crafting</em> reframes employees not as recipients of an assigned role but as crafters who actively edit the meaning and boundaries of their own work. For the same tasks, how someone connects them to the organization's values is theirs to edit. In practice, what works is not distributing values top-down but creating a setting where each member articulates how they express the values in their own work.</p>
<h2>The ground you need first — psychological safety</h2>
<p>For ownership-driven behavior to appear, people need to believe that trying and getting it wrong is safe. Edmondson's 1999 research demonstrated that teams with higher psychological safety — the shared belief that interpersonal risk is acceptable — show far more learning behavior: asking questions, requesting help, sharing failures. Trying a new way of working in line with stated values <em>is</em> an interpersonal risk. Ordering people to "take initiative" without psychological safety only produces shrinkage. Design the safe ground before you push for behavior. A surprising number of organizations have this order backwards.</p>
<h2>How BOATship practices this — systems grow ownership</h2>
<p>We build internal branding into <a href="/en/notes/inner-branding-organizational-identification/">systems and experiences</a> rather than slogans. <a href="/en/notes/equal-exchange-compensation/">Equal exchange compensation</a> is the clearest example. Because it exchanges value other than money, it asks members and partners every time: "Am I genuinely satisfied with this trade?" The subject of the judgment returns from the organization to the individual, so ownership grows by necessity. When the system embodies the values, behavior aligns without orders. System, behavior, language — when those three agree, values finally become culture.</p>
<h2>A design checklist</h2>
<p>The questions we use when designing internal branding. (1) Have the values stopped at awareness, or are they granular enough to guide a difficult decision? (2) Is there a setting where employees connect their own work to the values and give it meaning? (3) Is psychological safety in place so trying new behavior feels survivable? (4) Are the values embedded in systems and experiences rather than wall displays? (5) How will change be measured and fed into the next move? This article is also updated continuously against access data and read rate. Cited studies are in the evidence section below.</p>`
  },
  {
    id: "n08-en",
    lang: "en",
    sourceId: "n08",
    slug: "pr-measurement-outputs-to-outcomes",
    num: "#08E",
    category: "Research",
    title: "Coverage Is Not a Result — Designing PR Measurement From Outputs to Outcomes",
    date: "2026.07.27",
    readTime: 8,
    theme: "pr-planning",
    image: "../images/pine-note-imege.png",
    related: ["n06-en", "n02-en"],
    evidence: [{"title":"Managing Public Relations — the four models of PR and two-way symmetrical communication","source":"Grunig, J. E., & Hunt, T. (1984). Holt, Rinehart and Winston","url":""},{"title":"An 'effectiveness yardstick' to measure public relations success — the outputs / outtakes / outcomes model","source":"Lindenmann, W. K. (1993). Public Relations Quarterly, 38(1)","url":""},{"title":"Barcelona Principles 3.0 — the international standard that rejected AVE and made outcome measurement the norm","source":"AMEC / International Association for the Measurement and Evaluation of Communication (2020)","url":"https://amecorg.com/2020/07/barcelona-principles-3-0/"},{"title":"Evaluating Public Relations — planning, research and measurement as one continuous design","source":"Watson, T., & Noble, P. (2014). Kogan Page (3rd ed.)","url":""}],
    kpi: {"views":null,"readRate":null,"reactions":null,"recordedAt":""},
    tuningMemo: "English edition of n08. Pairs with n10-en (planning) as the measurement half. Target search intent: 'PR measurement' / 'Barcelona Principles'.",
    excerpt: "\"We got picked up by a major outlet\" is something that happened, not something that changed. How to measure PR through outputs, outtakes, and outcomes.",
    body: `<p>"We were picked up by a major outlet." It is a familiar line in PR reporting, and of course it is good news. But we do not stop there, because coverage is something that <em>happened</em>, not something that <em>changed</em>. If PR is a voyage, coverage proves you left the harbor — not that you arrived. This article sets out how to design measurement so PR does not end at coverage.</p>
<h2>"Did it run" and "did anything change" are different questions</h2>
<p>PR is hard to evaluate because there is distance between the easily visible metrics (placements, reach, impressions) and the change you actually want (awareness, attitude, behavior). While you chase the former, no amount of growth answers "so how did the business change?" Measurement starts with refusing to conflate the two.</p>
<h2>Three layers — outputs, outtakes, outcomes</h2>
<p>Lindenmann's 1993 model captures PR effect in stages: <strong>outputs</strong> (how much you published, how much ran), <strong>outtakes</strong> (how much the audience received and retained), and <strong>outcomes</strong> (how awareness, attitude, and behavior changed). Most PR stops measuring at outputs, but what management wants to know is the outcome. Simply holding these three layers in mind makes it obvious what you are failing to measure.</p>
<h2>Graduating from AVE — what the Barcelona Principles established</h2>
<p>For a long time PR converted coverage into advertising value equivalency (AVE) — "what would this have cost as an ad?" The <strong>Barcelona Principles</strong> (AMEC), begun in 2010 and updated to 3.0 in 2020, explicitly rejected AVE as a measure of PR value. Volume of coverage is not a result. What should be measured is what outcomes were produced against the goal, evaluated through a combination of qualitative and quantitative indicators. Decide the goal — "what was this meant to change?" — before selecting metrics. That order is what the principles repeatedly stress.</p>
<h2>Measurement turns one-way into dialogue</h2>
<p>Of the four models of PR that Grunig and Hunt set out in 1984, the most mature is <em>two-way symmetrical</em> communication. Rather than broadcasting, the organization continuously measures the audience's response and adjusts the relationship accordingly. Measurement is the mechanism that supports that two-way quality. Looking at numbers is not about issuing a report card; it is about listening to the response and redesigning <a href="/en/notes/pr-planning-peso-model/">the media circulation</a>. Framed that way, measurement becomes a far more constructive act.</p>
<h2>How BOATship practices this — measurement grows the plan</h2>
<p>As a "Business Art Team," we do not make PR and walk away. As Watson and Noble argue in <em>Evaluating Public Relations</em>, planning, research, and measurement are not separate stages but one continuous design. This owned media is our own testbed. We measure views, read rate, and reaction rate per article, tune headlines and CTAs against decision rules, and measure again. Just as <a href="/en/notes/equal-exchange-compensation/">equal exchange compensation</a> asks "am I satisfied with this trade?" each time, PR planning keeps asking whether these numbers represent a change worth the goal. In <a href="/en/notes/regional-brand-development/">regional brand development</a>, too, what mattered was never placement count but whose behavior changed.</p>
<h2>A measurement design checklist</h2>
<p>The questions we use. (1) Are there metrics for outtakes and outcomes, not just outputs? (2) Was the goal — what this plan intends to change — decided before the metrics? (3) Are you relying on apparent value like AVE? (4) Does the result feed back into the next plan as a two-way loop? (5) Are qualitative shifts in attitude and relationship captured alongside the quantitative? This article is updated continuously against access data and read rate.</p>`
  },
  {
    id: "n09-en",
    lang: "en",
    sourceId: "n09",
    slug: "inner-branding-initiatives",
    num: "#09E",
    category: "Playbook",
    title: "Ten Internal Branding Initiatives — Sorted by Awareness, Empathy, and Behavior",
    date: "2026.07.27",
    readTime: 9,
    theme: "inner-branding",
    image: "../images/pine-note-imege.png",
    related: ["n05-en", "n07-en"],
    evidence: [{"title":"Psychological Conditions of Personal Engagement and Disengagement at Work","source":"Kahn, W. A. (1990). Academy of Management Journal, 33(4)","url":"https://doi.org/10.5465/256287"},{"title":"A three-component conceptualization of organizational commitment","source":"Meyer, J. P., & Allen, N. J. (1991). Human Resource Management Review, 1(1)","url":"https://doi.org/10.1016/1053-4822(91)90011-Z"},{"title":"Leading Change: Why Transformation Efforts Fail","source":"Kotter, J. P. (1995). Harvard Business Review, 73(2)","url":"https://hbr.org/1995/05/leading-change-why-transformation-efforts-fail-2"},{"title":"Organizational Culture and Leadership — culture as artifacts, espoused values, and basic assumptions","source":"Schein, E. H. (2010). Jossey-Bass (4th ed.)","url":""}],
    kpi: {"views":null,"readRate":null,"reactions":null,"recordedAt":""},
    tuningMemo: "English edition of n09. Practical initiative list; highest commercial intent of the internal branding cluster. Target search intent: 'internal branding initiatives'.",
    excerpt: "Before you pick initiatives, sort them by stage. A three-stage map plus ten concrete initiatives that keep internal branding from spinning its wheels.",
    body: `<p>This is a guide for executives, HR, and communications practitioners looking for internal branding initiatives. What makes it different from the usual list is that we sort initiatives into three stages — awareness, empathy, behavior — grounded in the research on <a href="/en/notes/inner-branding-organizational-identification/">organizational identification</a>, before choosing any of them. By the end you should be able to tell which stage your own organization actually needs.</p>
<h2>Why initiatives spin their wheels — skipping stages</h2>
<p>The most common failure pattern is demanding behavior before awareness exists. Put people who neither know nor accept the values through a behavior-change workshop and all that remains is a sense of being made to do it. As Kotter listed insufficient urgency and the absence of short-term wins among the reasons transformation fails, change that skips stages stalls with high probability. Diagnose which stage you are in first.</p>
<h2>The three-stage map</h2>
<p><em>Awareness</em> is knowing the values exist and what they mean. <em>Empathy</em> is finding the overlap with your own values and accepting them emotionally. <em>Behavior</em> is having the values show up in daily judgment and how work gets done. As Meyer and Allen's commitment research treats affective commitment — staying because you want to — as the most desirable form, the target is behavior arrived at through emotional acceptance, not obligation.</p>
<h2>Awareness initiatives (1–3) — eliminate "I didn't know"</h2>
<p>(1) <strong>A values translation document</strong>: one page translating values into examples of on-the-ground judgment. Abstract words cannot be used. (2) <strong>Build it into onboarding</strong>: always set aside time in the first week to tell the founding story and the reasoning behind the values — kept separate from the benefits briefing. (3) <strong>An internal publication</strong>: write up work that embodied the values once a month, with real names attached. Having a medium people encounter repeatedly beats one-off announcements.</p>
<h2>Empathy initiatives (4–6) — settings that translate values into your own words</h2>
<p>(4) <strong>Storytelling sessions</strong>: once a quarter, create a space where members themselves describe a moment they felt the values. A colleague's story lands more personally than leadership's. (5) <strong>Values awards</strong>: recognize behavior that is characteristic rather than results. What gets praised is the strongest signal of what is meant seriously. (6) <strong>Dialogue-format town halls</strong>: not a one-way presentation but a session where leadership answers questions and objections. As Kahn's research showed, bringing yourself to your work requires psychological safety and a felt sense of meaning.</p>
<h2>Behavior initiatives (7–10) — embed them in systems and daily work</h2>
<p>(7) <strong>Into evaluation and hiring criteria</strong>: turn values into review items and interview questions. (8) <strong>Job crafting sessions</strong>: have each person articulate how they express the values in their own work (the design detail is in <a href="/en/notes/inner-branding-brand-behavior/">Turning Values Into Behavior</a>). (9) <strong>Make the system itself embody the values</strong>: as with our equal exchange compensation model, embed values into mechanisms. As Schein argues, the deep layer of culture appears in how things are actually operated, not in what is displayed. (10) <strong>Publish the decisions to walk away</strong>: share internally why you declined work that would have been profitable. That is the moment values as a behavioral standard come through most clearly.</p>
<h2>An implementation checklist</h2>
<p>Questions to ask before choosing. (1) Which stage — awareness, empathy, behavior — is your organization stuck at? (2) Does the chosen initiative match that stage, or are you skipping? (3) Is it designed as repeated contact rather than a one-off event? (4) How will you measure effect (survey, behavioral indicator, retention)? (5) Is leadership prepared to change its own behavior first? This article is updated continuously against access data and read rate.</p>`
  },
  {
    id: "n10-en",
    lang: "en",
    sourceId: "n10",
    slug: "pr-planning-proposal-template",
    num: "#10E",
    category: "Playbook",
    title: "How to Build a PR Plan — A Seven-Part Template You Fill In Order",
    date: "2026.07.27",
    readTime: 8,
    theme: "pr-planning",
    image: "../images/pine-note-imege.png",
    related: ["n06-en", "n02-en"],
    evidence: [{"title":"Managing Public Relations — the four models of PR, from one-way publicity to two-way symmetry","source":"Grunig, J. E., & Hunt, T. (1984). Holt, Rinehart and Winston","url":""},{"title":"Effective Public Relations — the RACE planning process (research, action, communication, evaluation)","source":"Cutlip, S. M., Center, A. H., & Broom, G. M. (2012). Pearson (11th ed.)","url":""},{"title":"AMEC Integrated Evaluation Framework — the international standard framework for PR measurement","source":"AMEC (2016)","url":"https://amecorg.com/amecframework/"}],
    kpi: {"views":null,"readRate":null,"reactions":null,"recordedAt":""},
    tuningMemo: "English edition of n10. Practical template; pairs with n08-en (measurement). Target search intent: 'PR plan template' / 'how to write a PR plan'.",
    excerpt: "Do not start by writing the press release. Fill in seven items in order and you have a coherent PR plan — from business goal through to KPIs.",
    body: `<p>This guide is for people writing their first PR plan, and for practitioners whose plans keep turning into a list of tactics. We have taken the standard PR planning process (research → planning → execution → evaluation, as organized by Cutlip and colleagues) and reduced it to a seven-part template you can fill in order. It assumes <a href="/en/notes/pr-planning-peso-model/">the PESO model</a>, so start there if you have not read it.</p>
<h2>Do not start by writing the press release</h2>
<p>The classic way PR planning goes wrong is starting from the tactic — release, social, event. As Grunig and Hunt showed with the four models of PR, one-way publicity and two-way communication that incorporates the audience's response are designed completely differently. Before the tactic, start from "whose perception or relationship are we trying to change?" The seven items below follow that order.</p>
<h2>Items 1–3: purpose, audience, change — the spine of the plan</h2>
<p><strong>1. Connection to a business goal</strong>: one line on which business goal (revenue, hiring, partnerships) this PR serves. If you cannot write it, the plan is premature. <strong>2. Target public</strong>: not "the general public" but a resolution where you can picture a face (for example: the second-generation owner of a regional food manufacturer). <strong>3. The change you want</strong>: which of awareness, attitude, or behavior you want to move, and from where to where. "Never heard of them → knows the name" is a perfectly respectable change.</p>
<h2>Items 4–5: story and media design — place it on PESO</h2>
<p><strong>4. Core story</strong>: separate from the fact sheet, prepare one narrative with specific names and scenes. Work backwards from what needs to be told for the change to happen. <strong>5. Media design</strong>: diagram where in PESO the story starts and how it circulates. Convention places the start on Owned. The reason, as covered in <a href="/en/notes/pr-planning-peso-model/">the PESO piece</a>, is that it becomes the source material for the other three.</p>
<h2>Items 6–7: team, schedule, and KPIs — designed to continue</h2>
<p><strong>6. Team and schedule</strong>: who publishes what and when, drawn as three months of continuous contact rather than a single hit. Bring the granularity down to something one person can sustain. <strong>7. KPIs and measurement</strong>: following the AMEC framework, separate outputs (placements) from outcomes (changes in awareness, attitude, behavior). Chase placements alone and you mass-produce plans that ran but changed nothing.</p>
<h2>After the plan is written — operating and tuning</h2>
<p>A plan starts aging the moment it is written. Once a month, compare it against actual KPI figures and update item 5 (media design) and item 6 (schedule). This media of ours has that tuning loop built in, using access data and read rate. If you are applying the template to a regional company, <a href="/en/notes/regional-brand-development/">the piece on regional brand development</a> covers the context-building side.</p>
<h2>PR plan checklist</h2>
<p>A final check before you submit. (1) Can the connection to a business goal be written in one line? (2) Is the target at a resolution where you see a face? (3) Is the desired change clearly one of awareness, attitude, or behavior? (4) Is there a story, not only facts? (5) Is the PESO circulation diagrammed? (6) Is it designed as three months of continuous contact? (7) Are output and outcome KPIs separated? Check all seven and what you have is a plan, not a list of tactics.</p>`
  },
  {
    id: "n11-en",
    lang: "en",
    sourceId: "n11",
    slug: "inner-branding-leadership",
    num: "#11E",
    category: "Research",
    title: "Internal Branding Is Decided by What Leaders Do — The Research on Leadership and Internal Brand Building",
    date: "2026.07.27",
    readTime: 8,
    theme: "inner-branding",
    image: "../images/pine-note-imege.png",
    related: ["n05-en", "n07-en"],
    evidence: [{"title":"Internal brand building and structuration: the role of leadership","source":"Vallaster, C., & de Chernatony, L. (2006). European Journal of Marketing, 40(7/8)","url":"https://doi.org/10.1108/03090560610669982"},{"title":"Social Learning Theory — people learn through observation and modeling","source":"Bandura, A. (1977). Prentice-Hall","url":""},{"title":"Leadership and Performance Beyond Expectations — the origin of transformational leadership","source":"Bass, B. M. (1985). Free Press","url":""},{"title":"Authentic leadership development — leadership grounded in consistency between word and action","source":"Avolio, B. J., & Gardner, W. L. (2005). The Leadership Quarterly, 16(3)","url":"https://doi.org/10.1016/j.leaqua.2005.03.001"}],
    kpi: {"views":null,"readRate":null,"reactions":null,"recordedAt":""},
    tuningMemo: "English edition of n11. Leadership angle on internal branding; useful for management training proposals. Target search intent: 'leadership internal branding'.",
    excerpt: "However carefully values are written, they collapse the moment a manager's behavior contradicts them. Why internal branding starts with what leaders actually do.",
    body: `<p>No matter how carefully values are articulated, whether they get embodied on the ground depends heavily on how the nearest leader behaves. When the values on the wall and the manager in front of you disagree, people believe the manager without hesitation. We design internal branding <a href="/en/notes/inner-branding-organizational-identification/">from systems and experiences</a>, but the way leaders operate those systems day to day is the strongest message running through an organization. This article sets out why, with the research behind it.</p>
<h2>Internal brands are "structurated" — leaders are the origin</h2>
<p>Vallaster and de Chernatony's 2006 research framed internal brand building as a process of <em>structuration</em>: the meaning of the brand rises within the organization through daily interaction. And they identify leadership as decisive in that process. A leader's words and actions shape members' understanding of what this brand cares about, which in turn governs the next round of behavior. A brand is not declared once from the top and finished; it is remade daily in the interaction between leaders and members.</p>
<h2>Why watching works — social learning theory</h2>
<p>Bandura's social learning theory, systematized in 1977, showed that people learn knowledge and rules through observation and modeling rather than memorization. People watch what those around them do and what results follow, then adjust accordingly. Applied to internal branding: how the nearest leader actually decides, what they reward, and what they let slide are imitated far more strongly than any posted statement of values. What gets learned is what is done, not what is said.</p>
<h2>Leaders who give meaning vs. leaders who paper over</h2>
<p>So what kind of leadership works? Bass's 1985 concept of transformational leadership raises the level of motivation itself by presenting a clear vision, giving intellectual stimulation, and paying individual attention. You could restate it as a leader who gives values meaning rather than distributing them. The caution is whether the behavior is genuine. Authentic leadership, as organized by Avolio and Gardner in 2005, centers on self-awareness, transparency, and consistency. By the logic of social learning, vision-talk from a leader whose words and actions diverge is worse than nothing — it teaches that the values are not really held.</p>
<h2>How BOATship practices this — operating the system is the message</h2>
<p>We embed internal branding into systems and experiences rather than slogans, and <a href="/en/notes/equal-exchange-compensation/">equal exchange compensation</a> is our clearest example. But a system does not function merely by existing. Leaders have to be the first to ask, project by project, "are we genuinely satisfied with this trade?" — and sometimes to demonstrate a decision to walk away from profitable work. Watching that, members learn the values. We wrote that <a href="/en/notes/inner-branding-brand-behavior/">turning values into behavior</a> hinges on system, behavior, and language agreeing; the responsibility to demonstrate that agreement first belongs to leaders. When a leader's conduct embodies the meaning of the system, values propagate through the team without orders.</p>
<h2>A leader's checklist — how to use this piece</h2>
<p>Self-check questions for leaders responsible for internal branding. (1) Do the posted values and the decisions you actually make agree? (2) Are you aware that what you reward and what you overlook are both signals about values? (3) Are you giving values meaning in the context of each person's work, not just distributing them? (4) Is there transparency and consistency in your own conduct? (5) Have you designed the way you operate the system as a message worth teaching? This article is updated continuously against access data and read rate, in line with how we run <a href="/en/notes/pr-planning-peso-model/">our owned media</a>. Use it directly in values work or management training design.</p>`
  }
];
