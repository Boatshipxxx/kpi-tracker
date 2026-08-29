const ARTICLES = [
  {
    id: '01',
    slug: 'shake-shack-japan-launch',
    num: '#01',
    category: 'News',
    title: 'Shake Shack Japan — サイトローンチ',
    date: '2026.05.01',
    readTime: 3,
    thumb: '../images/card-01.jpg',
    hero: '../images/works-shakeshack.jpg',
    excerpt: 'Shake Shack日本公式サイトの新デザインがローンチ。UI設計からフロントエンド実装まで、BOATshipが手がけたプロジェクトの全貌。',
    body: `<p>ご依頼主Shake Shack Japan様の公式ウェブサイトが新しくなりました。BOATshipはUI設計からフロントエンド実装まで、プロジェクト全体を担当しました。</p>
<h2>プロジェクト概要</h2>
<p>Shake Shack様は、ニューヨーク発のバーガーブランドです。日本上陸以来、ファンを増やし続けています。今回のリニューアルでは、ブランドのプレミアム感を損なわずに、ユーザビリティを大きく向上させることが求められました。</p>
<h2>実装した機能</h2>
<p>メニューページの再設計、店舗検索機能の改善、ニュースセクションの追加。すべてのページでレスポンシブデザインを徹底し、スマートフォンでの閲覧体験を最優先にしました。</p>
<h2>技術スタック</h2>
<p>HTML / CSS / JavaScript のピュアな実装。フレームワークを使わずに、軽量で高速なサイトを実現しました。表示速度はリニューアル前比で40%改善。Core Web Vitalsのすべての指標でGreenを達成しています。</p>`
  },
  {
    id: '02',
    slug: 'shopify-liquid-tips',
    num: '#02',
    category: 'Tech',
    title: 'Shopify Liquid 実装Tips',
    date: '2026.04.20',
    readTime: 5,
    thumb: '../images/card-02.jpg',
    hero: '../images/card-02.jpg',
    excerpt: 'ECサイト構築プロジェクトで得たShopify Liquidの実装ノウハウ。メタフィールド活用からカスタムセクション設計まで。',
    body: `<p>ECサイト構築プロジェクトで得た、Shopify Liquid実装のTipsをまとめます。Liquidの独特な記法に慣れると、WordPressよりも柔軟な実装が可能です。</p>
<h2>Tip 1: メタフィールドを積極活用する</h2>
<p>商品情報の拡張には、Shopifyのメタフィールドが便利です。成分表、使い方、ストーリーなど、標準フィールドに収まらないデータをメタフィールドで管理することで、管理画面からの編集が容易になります。</p>
<h2>Tip 2: カスタムセクションの設計</h2>
<p>テーマのカスタマイズはセクションとブロックで設計しましょう。schema JSONで編集可能な項目を定義することで、コードを触らずにページレイアウトを変更できます。クライアント様が自分で運用できる仕組みが大切です。</p>
<h2>Tip 3: パフォーマンス最適化</h2>
<p>Shopifyサイトはデフォルトでアプリが多く読み込まれがちです。使っていないアプリのスニペットを削除し、Critical CSSをインライン化することで、Core Web Vitalsのスコアを大きく改善できます。</p>
<h2>Tip 4: metaobjectsでコンテンツ管理</h2>
<p>metaobjectsを使うと、ブランド情報や店舗情報などをコンテンツとして管理できます。各商品のストーリーをmetaobjectで管理し、複数ページで再利用する手法は、多くのECプロジェクトで効果を発揮しています。</p>`
  },
  {
    id: '03',
    slug: 'web-brutalism',
    num: '#03',
    category: 'Design',
    title: 'ブルータリズムをWebに取り入れる',
    date: '2026.04.10',
    readTime: 6,
    thumb: '../images/card-03.jpg',
    hero: '../images/brutalism-hero.svg',
    og: '../images/card-03.jpg',
    excerpt: 'ブルータリストデザインの哲学とWebへの応用。BOATship自身のサイトデザインに込めた思考を解説。',
    body: `<p>ブルータリズム（Brutalism）は、建築からWebデザインに持ち込まれたデザイン哲学です。「飾らない、隠さない、素材をそのまま見せる」という思想が根底にあります。</p>
<h2>ブルータリズムとは何か</h2>
<p>Webブルータリズムの特徴は、太いボーダー、ベタのシャドウ、モノスペースフォント、そして意図的なずれやゆがみです。「美しくない」のではなく、「正直である」のです。</p>
<h2>BOATshipのデザイン判断</h2>
<p>このサイトで使っている黄色（#F5E100）と黒（#111111）の組み合わせ、DotGothic16のピクセルフォント、4pxのbox-shadowは、すべてブルータリズムの文脈で選択しています。「プロらしい洗練」よりも「作り手の個性」を優先しました。</p>
<h2>実装上の注意点</h2>
<p>ブルータリズムはやりすぎると「壊れたサイト」に見えます。ユーザビリティの基本は守りつつ、装飾的なルールを意図的に破る——そのバランスが重要です。ナビゲーション、フォーム、CTAは迷わず使えるように設計してください。</p>
<h2>参考にしたサイト</h2>
<p>Balenciaga、Vogue Italia、Dazed Digital。これらのサイトは、ブランドの力でブルータリズムを成立させています。デザインに「理由」があるとき、荒削りは力になります。</p>`
  },
  {
    id: '04',
    slug: 'nahrin-renewal',
    num: '#04',
    category: 'News',
    title: 'nahrin — サイトリニューアル',
    date: '2022.03.25',
    readTime: 1,
    thumb: '../images/card-04.jpg',
    hero: '../images/works-nahrin.jpg',
    excerpt: 'スイス発ナチュラルコスメブランドnahrin様の公式ECサイトがリニューアルしました。',
    body: `<p>ご依頼主nahrin様の公式ECサイトがリニューアルしました。</p>
<h2>ブランドの世界観を忠実に</h2>
<p>nahrin様は、スイスのアルプスで採取したハーブを原料にした自然派コスメブランドです。「清潔感」「自然」「信頼」というブランドの核心を、デジタルの文脈で表現することが最初の課題でした。</p>`
  },
  {
    id: '05',
    slug: 'wordpress-custom-theme',
    num: '#05',
    category: 'Tech',
    title: 'WordPressカスタムテーマ開発の流儀',
    date: '2026.03.10',
    readTime: 7,
    thumb: '../images/card-05.jpg',
    hero: '../images/works-eyewear.jpg',
    excerpt: 'ご依頼主EYEWEAR MEBIUS様・TEAM JOSAI!様の実装から得た、WordPressカスタムテーマ開発のベストプラクティス。',
    body: `<p>WordPressは「使いこなすのが難しい」と言われますが、カスタムテーマの設計を正しく行えば、クライアント様が自走できる強力なCMSになります。</p>
<h2>ファイル構成の原則</h2>
<p>テンプレートファイルを機能単位に分割し、<code>get_template_part()</code>で呼び出す構成にしましょう。header、footer、single、archive、page——それぞれに役割を持たせ、コードの重複を排除します。</p>
<h2>カスタム投稿タイプの設計</h2>
<p>ご依頼主EYEWEAR MEBIUS様では、ブランドとプロダクトカテゴリをカスタム投稿タイプで管理しています。<code>register_post_type()</code>と<code>register_taxonomy()</code>を使い、管理画面をクライアント様が直感的に操作できる構造にしました。</p>
<h2>ACF（Advanced Custom Fields）活用</h2>
<p>標準のWYSIWYGエディタでは表現できない複雑なレイアウトには、ACFのフレキシブルコンテンツが有効です。ご依頼主TEAM JOSAI!様では、選手インタビュー、試合レポート、ギャラリーなど、記事の種類に応じたレイアウトをフレキシブルコンテンツで管理しています。</p>
<h2>パフォーマンス</h2>
<p>プラグインは最小限に。代わりに<code>functions.php</code>にカスタムコードを書く習慣をつけましょう。不要なスクリプトのエンキューを外し、Critical CSSをインライン化することで、PageSpeedのスコアを大きく改善できます。</p>`
  },
  {
    id: '06',
    slug: 'interview-boatship-future',
    num: '#06',
    category: 'Interview',
    title: '制作者に聞く — BOATshipのこれから',
    date: '2026.03.01',
    readTime: 8,
    thumb: '../images/card-06.jpg',
    hero: '../images/card-06.jpg',
    excerpt: 'BOATshipを立ち上げた理由、Business Art Teamというコンセプト、そしてこれからの展望を語ってもらった。',
    body: `<p>BOATshipは「Business Art Team」というコンセプトを掲げる、デザインとPR/広報を専門とするクリエイティブチームです。設立の背景と今後のビジョンについて聞きました。</p>
<h2>Q. BOATshipを立ち上げたきっかけは？</h2>
<p>「小さな会社や地方のブランドが、素晴らしいプロダクトを持っていても、伝える手段がなくて埋もれているのを何度も見てきました。デザインとPRを組み合わせた支援ができれば、もっと多くのブランドが社会に届くと思ったんです。」</p>
<h2>Q. 「等価交換報酬制度」とは？</h2>
<p>「資金がなくても情熱があるプロジェクトと組める仕組みです。お金ではなく、スキルや場所や人脈で対価を受け取る。それが等価交換報酬制度です。今まで断ってきたプロジェクトが、この仕組みで動き始めています。」</p>
<h2>Q. これからどんな仕事をしていきたい？</h2>
<p>「アジアとヨーロッパを結ぶブランドの仕事をしたいです。日本のブランドをヨーロッパに届けたり、ヨーロッパのブランドを日本のマーケットに根付かせたり。言語や文化を超えて、ブランドの声をつくる仕事をBOATshipでやり続けます。」</p>
<h2>Q. 制作を依頼したい人へメッセージ</h2>
<p>「大きなプロジェクトも小さなプロジェクトも、どちらも歓迎します。まずは話を聞かせてください。一緒に、どんな航海ができるか考えましょう。」</p>`
  },
  {
    id: '07',
    slug: 'dotgothic16-typography',
    num: '#07',
    category: 'Design',
    title: 'DotGothic16の使いどころ',
    date: '2026.02.15',
    readTime: 4,
    thumb: '../images/card-01.jpg',
    hero: '../images/card-01.jpg',
    excerpt: 'Google Fontsで公開されているDotGothic16。このピクセル日本語フォントをWebで使うベストプラクティスを解説。',
    body: `<p>DotGothic16は、ドット絵のような見た目の日本語フォントです。Google Fontsで無料で使えるこのフォントを、Webサイトに取り入れる方法を考えます。</p>
<h2>DotGothic16の特徴</h2>
<p>小さいサイズで使うとドット感が出て、大きいサイズで使うとモダンなピクセルフォントとして機能します。日本語・英語・数字すべてをカバーしており、Webフォントとして読み込むだけで使えます。</p>
<h2>効果的なサイズ設定</h2>
<p>本文テキストには16px〜18px。見出しには24px以上で使うと、ピクセルのエッジが活きます。小さすぎると読みにくくなるので、14px以下はモノスペースフォントと組み合わせることをおすすめします。</p>
<h2>相性の良いフォントの組み合わせ</h2>
<p>BOATshipでは IBM Plex Mono と組み合わせています。日本語にDotGothic16、英数字にIBM Plex Mono——この組み合わせが、テック感とレトロ感を同時に出せます。Silkscreenを小見出しに加えると、ゲームUIのような世界観が完成します。</p>
<h2>使ってはいけない場面</h2>
<p>高級感や洗練を求めるブランドには不向きです。また、長文の本文には読み疲れを感じさせることがあります。アクセント的に使うか、BOATshipのようにブランドコンセプトに合致した場合に採用しましょう。</p>`
  },
  {
    id: '08',
    slug: 'github-pages-production',
    num: '#08',
    category: 'Tech',
    title: 'GitHub Pagesで本番運用するコツ',
    date: '2026.02.01',
    readTime: 5,
    thumb: '../images/card-05.jpg',
    hero: '../images/card-05.jpg',
    excerpt: '静的サイトのホスティングとしてGitHub Pagesを本番環境で使うためのTips。カスタムドメイン、HTTPS、デプロイフローまで。',
    body: `<p>GitHub Pagesは、GitHubリポジトリから静的サイトを無料でホスティングできるサービスです。ポートフォリオや小規模なWebサイトの本番環境として十分に使えます。</p>
<h2>カスタムドメインの設定</h2>
<p>独自ドメインを使うには3ステップ。①ドメインのDNS設定でCNAMEレコードを追加（<code>www</code>→<code>username.github.io</code>）、②リポジトリのSettings→PagesでCustom domainを設定、③リポジトリのルートに<code>CNAME</code>ファイルを追加。DNS反映後（最大48時間）、Enforce HTTPSにチェックを入れます。</p>
<h2>デプロイフローの整備</h2>
<p>mainブランチへのプッシュで自動デプロイされますが、直接pushは危険です。feature ブランチで開発 → プルリクエスト → レビュー → マージ、というフローを習慣にしましょう。GitHub Actionsでテストを挟むとさらに安全です。</p>
<h2>パスの注意点</h2>
<p>リポジトリ名がサブパスになる場合（<code>username.github.io/repo-name/</code>）、すべてのリンクがそのパスからの相対パスである必要があります。絶対パス（<code>/images/logo.jpg</code>）は使わず、相対パス（<code>../images/logo.jpg</code>）で記述しましょう。</p>
<h2>大容量ファイルの扱い</h2>
<p>GitHubは1ファイル100MBまでの制限があります。高解像度の画像はあらかじめ圧縮（TinyPNG等）し、動画はYouTubeやVimeoに外部ホストしてiframeで埋め込むのが定石です。</p>`
  },
  {
    id: '09',
    slug: 'new-project-open',
    num: '#09',
    category: 'News',
    title: '新規プロジェクト受付開始',
    date: '2026.01.20',
    readTime: 2,
    thumb: '../images/card-06.jpg',
    hero: '../images/card-06.jpg',
    excerpt: 'BOATshipが新規プロジェクトの受付を開始。等価交換報酬制度を含む、すべての形態での依頼を歓迎します。',
    body: `<p>BOATshipは、新規プロジェクトの受付を開始しました。Webサイト制作、ECサイト構築、PR戦略策定、ブランドコンサルティング——どんな相談でも歓迎します。</p>
<h2>依頼できること</h2>
<p>カンパニーメディア制作 / Webサイト・ECサイト設計・実装 / PR・広報戦略策定 / ブランドコンサルティング / グラフィックデザイン / ロゴ・VI開発。一部だけの依頼も、フルパッケージでの依頼も対応可能です。</p>
<h2>等価交換報酬制度について</h2>
<p>予算が限られているプロジェクトや、スタートアップ・地方企業のかたには「等価交換報酬制度」でのご依頼も受け付けています。お金ではなく、スキル・場所・人脈・サービスなどで対価をいただく仕組みです。まずはご相談ください。</p>
<h2>ご連絡方法</h2>
<p>このサイトのNewsletter登録フォームからご連絡いただくか、InstagramまたはX（Twitter）のDMまでお気軽にどうぞ。プロジェクトの規模を問わず、まずは話を聞かせてください。</p>`
  },
  {
    // Notes（旧 theme: culture）から移行。旧URL /magazine/equivalent-exchange-compensation/ は vercel.json で301。
    id: '10',
    slug: "equivalent-exchange-compensation",
    num: '#10',
    category: 'Culture',
    title: "等価交換報酬制度を始めた理由",
    date: "2026.04.05",
    readTime: 7,
    thumb: '../images/pine-note-imege.png',
    hero: '../images/pine-note-imege.png',
    evidence: [{"title":"贈与論（Essai sur le don）— 互酬性がコミュニティを結びつける","source":"Mauss, M. (1925)","url":""},{"title":"影響力の武器 — 返報性の原理","source":"Cialdini, R. B. (1984). Influence: The Psychology of Persuasion","url":""}],
    excerpt: "どんな小さな火も消さないために。お金以外の価値交換で、もっと多くのプロジェクトに伴走するための試み。",
    body: `<p>「予算がないからお願いできない」と言われるたびに、何かがもったいないと思っていました。そのプロジェクトが持つ可能性や熱量は本物なのに、お金がないというだけで一緒に動けない。その違和感から、等価交換報酬制度は始まりました。</p>
<h2>制度の仕組み</h2>
<p>等価交換報酬制度とは、BOATshipが提供するデザイン・PR・制作の対価を、お金以外の「価値」で受け取る仕組みです。スキル、場所、人脈、サービス、モノ——何であれ、双方が「等価」と合意できるものならそれが報酬になります。</p>
<h2>なぜこの制度が必要だったのか</h2>
<p><a href="/notes/regional-brand-development/">地方の生産者</a>、スタートアップ、NPO、個人クリエイター——彼らの多くは、お金はないけれど届けたいものを持っています。BOATshipが持っているのはデザインとPRのスキル。これを交換すれば、両者にとって価値のある仕事が生まれます。</p>
<h2>実際にどう機能しているか</h2>
<p>ある農家とは、Webサイト制作の対価として毎月の新鮮な野菜を受け取っています。あるシェアオフィスとは、ブランディングの対価としてコワーキングスペースの利用権を交換しました。どちらのケースも、お金での依頼より深い関係が生まれました。</p>
<h2>「等価」をどう決めるか</h2>
<p>難しいのは「等価かどうか」の判断です。BOATshipではシンプルに、「この取引に納得できるか」を互いに確認するだけです。市場価格ではなく、お互いの状況と意志で決める。そのフラットさが、この制度の核心です。</p>
<h2>これからのこと</h2>
<p>等価交換報酬制度は、BOATshipが理想とする<a href="/magazine/barter-and-resource-sharing/">働き方の実験</a>でもあります。お金だけが価値の尺度ではないことを、一つひとつのプロジェクトで証明していきたい。もしこの制度に興味があれば、まずは話を聞かせてください。</p>`
  },
  {
    // Notes（旧 theme: culture）から移行。旧URL /magazine/design-thinking-and-business-art/ は vercel.json で301。
    id: '11',
    slug: "design-thinking-and-business-art",
    num: '#11',
    category: 'Culture',
    title: "デザイン思考とビジネスアートの境界線",
    date: "2026.03.08",
    readTime: 6,
    thumb: '../images/pine-note-imege.png',
    hero: '../images/pine-note-imege.png',
    evidence: [{"title":"Design Thinking — デザイン思考を経営に持ち込んだ原典","source":"Brown, T. (2008). Harvard Business Review, 86(6)","url":"https://hbr.org/2008/06/design-thinking"}],
    excerpt: "ロゴ、プロダクト、グラフィック、そして事業開発。Business Art Teamが横断するデザインの幅と、その奥にある思考について。",
    body: `<p>「Business Art Team」という言葉を使い始めたとき、少し迷いがありました。「デザインスタジオ」や「クリエイティブエージェンシー」という言葉の方が伝わりやすい。でも、それでは何かが足りない。BOATshipがやりたいことは、デザインとビジネスの境界線を意図的に曖昧にすることでした。</p>
<h2>デザイン思考とは何か</h2>
<p>デザイン思考とは、問題を解決するプロセスのことです。観察、定義、発想、プロトタイプ、テスト——このサイクルを回すことで、より良い答えに近づいていく。これはもともとプロダクトデザインの手法ですが、事業開発やコミュニケーション設計にも同じ思考が使えます。</p>
<h2>「ビジネスアート」という考え方</h2>
<p>アートは自己表現であり、ビジネスは<a href="/magazine/equivalent-exchange-compensation/">価値交換</a>です。一見対極のように見えますが、最も強いビジネスは「表現」を持っています。AppleもNikeも、その製品とコミュニケーションにはアート的な意志があります。BOATshipが目指すのは、ビジネスの中にアートの視点を持ち込むことです。</p>
<h2>境界線を曖昧にする理由</h2>
<p>デザインだけでは、ビジネスの文脈から切り離されたものができます。ビジネスだけでは、人の心を動かすものは生まれません。その境界線を曖昧にする人が、今最も求められている。BOATshipはその立ち位置から仕事をしています。</p>
<h2>実践としての「Business Art」</h2>
<p>具体的には、クライアントの事業課題をヒアリングし、<a href="/notes/pr-planning-peso-model/">デザインとPRの両面</a>からアプローチします。ロゴ一つ作るときも、それが事業においてどんな役割を果たすかを考えます。表面的な美しさではなく、機能する美しさを追いかけています。</p>`
  },
  {
    // Notes（旧 theme: culture）から移行。旧URL /magazine/barter-and-resource-sharing/ は vercel.json で301。
    id: '12',
    slug: "barter-and-resource-sharing",
    num: '#12',
    category: 'Culture',
    title: "物々交換とリソースシェアで成り立つ仕事",
    date: "2026.02.22",
    readTime: 4,
    thumb: '../images/pine-note-imege.png',
    hero: '../images/pine-note-imege.png',
    evidence: [{"title":"You are what you can access — シェアリングと協働消費の研究","source":"Belk, R. (2014). Journal of Business Research, 67(8)","url":"https://doi.org/10.1016/j.jbusres.2013.10.001"}],
    excerpt: "対価はお金だけじゃない。等価交換報酬制度の運用で見えてきた、新しい仕事のかたち。",
    body: `<p><a href="/magazine/equivalent-exchange-compensation/">等価交換報酬制度</a>を始めて半年が経ちました。お金ではなく「価値」で対価を受け取ることで、仕事のあり方がどう変わったかを振り返ります。</p>
<h2>物々交換の現実</h2>
<p>「物々交換」と聞くと原始的に聞こえるかもしれませんが、実際に運用してみると驚くほどスムーズです。お金の授受がないぶん、プロジェクトへの向き合い方が変わります。お金を払う/もらうという関係ではなく、価値を共に生み出すパートナーになります。</p>
<h2>リソースシェアの面白さ</h2>
<p>等価交換で最も多かったのは、スキルとスキルの交換です。あるフォトグラファーとはWebデザインと撮影を交換しました。あるシェフとは、レストランの<a href="/notes/regional-brand-development/">ブランディング</a>と月に一度のまかない食事を交換しました。お金が介在しないことで、人と人の関係が直接つながります。</p>
<h2>見えてきた課題</h2>
<p>課題もあります。「等価かどうか」の合意が難しい場合があります。また、時間をまたぐ交換（先に制作して後から受け取る）では、信頼関係が前提になります。それでも、この課題を乗り越えたプロジェクトは長続きしています。</p>
<h2>お金では買えないもの</h2>
<p>等価交換で得られる最大の価値は、お金では買えないものです。信頼、関係性、経験、コミュニティ——これらはお金でも時間でも積み上がっていくものですが、等価交換のプロセスは特にその密度が高い。BOATshipはこの仕組みを続けていきます。</p>`
  }
];
