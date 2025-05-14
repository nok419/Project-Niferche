// 拡張モックデータ定義
import { Content, WorldType } from './mock_data';

// チャプタータイプ定義
export interface Chapter {
  id: string;
  title: string;
  order: number;
  contentId: string;
  summary: string;
  published: boolean;
  publishedAt: string;
}

// セクションタイプ定義
export interface Section {
  id: string;
  chapterId: string;
  title?: string;
  content: string;
  order: number;
  worldType: WorldType;
}

// コンテンツ詳細定義
export interface ContentDetail {
  contentId: string;
  fullText?: string;
  chapters: Chapter[];
  sections: Section[];
  relatedContentIds: string[];
  glossaryTerms: string[];
  viewCount: number;
}

// キャラクター定義
export interface Character {
  id: string;
  name: string;
  title?: string;
  world: WorldType;
  description: string;
  imageUrl?: string;
  relationships: Array<{
    characterId: string;
    relationship: string;
  }>;
  appearsIn: string[]; // contentIds
  traits: string[];
}

// 場所定義
export interface Location {
  id: string;
  name: string;
  world: WorldType;
  description: string;
  imageUrl?: string;
  appearsIn: string[]; // contentIds
  coordinates?: {
    x: number;
    y: number;
  };
}

// 用語集アイテム定義
export interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
  relatedTerms: string[];
  world: WorldType;
  category: 'concept' | 'event' | 'item' | 'organization' | 'other' | 'location';
}

// メインストーリーの章立て構造
export const MOCK_MAIN_STORY_CHAPTERS: Chapter[] = [
  {
    id: 'chapter-1',
    title: '序章: 始まりの鐘',
    order: 1,
    contentId: 'main-story-1',
    summary: 'Project Nifercheの世界に足を踏み入れる第一歩。三つの世界の関係性と重要な概念について説明します。',
    published: true,
    publishedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'chapter-2',
    title: '第一章: Hodemeiの夜明け',
    order: 2,
    contentId: 'main-story-2',
    summary: 'Hodemeiの世界で起きた科学革命と、その影響について描きます。',
    published: true,
    publishedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'chapter-3',
    title: '第二章: Quxeの森の囁き',
    order: 3,
    contentId: 'main-story-3',
    summary: 'Quxeの世界で起きている異変と自然の力の覚醒について描きます。',
    published: false,
    publishedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: 'chapter-4',
    title: '第三章: Alsarejiaの扉',
    order: 4,
    contentId: 'main-story-4',
    summary: 'Alsarejiaの世界と次元の交差点における謎について描きます。',
    published: false,
    publishedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'chapter-5',
    title: '第四章: 交差する世界',
    order: 5,
    contentId: 'main-story-5',
    summary: '三つの世界が交わり始め、新たな脅威が現れる物語です。',
    published: false,
    publishedAt: '2024-04-01T00:00:00Z'
  }
];

// メインストーリーのセクション
export const MOCK_MAIN_STORY_SECTIONS: Section[] = [
  // 序章のセクション
  {
    id: 'section-1-1',
    chapterId: 'chapter-1',
    title: 'プロローグ',
    content: `<p>いつからだろう、人々が「世界」という言葉に違和感を覚え始めたのは。</p>
<p>それは突然の出来事ではなかった。徐々に、ほとんど気づかないほどゆっくりと、現実の輪郭がぼやけ始めたのだ。</p>
<p>科学者たちは「次元の揺らぎ」と呼び、詩人たちは「夢の浸食」と歌った。しかし、真実はもっと複雑だった。</p>
<p>三つの世界—Hodemei、Quxe、Alsarejia—が、長い分離の時を経て、再び接近し始めていたのだ。</p>
<p>これは、その物語の始まりである。</p>`,
    order: 1,
    worldType: 'common'
  },
  {
    id: 'section-1-2',
    chapterId: 'chapter-1',
    title: '三つの世界',
    content: `<p>最初に認識されたのは、Hodemeiだった。</p>
<p>科学と理性の世界。論理と技術が支配する場所。人類の知性が最も純粋な形で具現化された世界。</p>
<p>次に浮かび上がったのは、Quxeだった。</p>
<p>自然と感性の世界。魔法と精霊が実在し、生命の神秘が日常に溶け込む場所。</p>
<p>そして最後に、最も捉えがたい世界として、Alsarejiaが現れた。</p>
<p>次元の境界そのものであり、法則が流動的に変化する、理解を超えた場所。</p>
<p>三つの世界は別々のものでありながら、どこかでつながっていた。その接点を見つけることが、私たちの旅の始まりとなる。</p>`,
    order: 2,
    worldType: 'common'
  },
  {
    id: 'section-1-3',
    chapterId: 'chapter-1',
    title: 'Nifercheとは',
    content: `<p>古い文書の中に、「Niferche」という言葉が登場する。</p>
<p>その意味は「次元を越える者」あるいは「世界を繋ぐ存在」と訳される。</p>
<p>伝説によれば、Nifercheは三つの世界を自由に行き来できる存在であり、世界の均衡を保つ役割を担っていたという。</p>
<p>しかし、何かの理由でNifercheは姿を消し、世界は分断され始めた。</p>
<p>今、世界の境界が薄れつつある中、Nifercheの存在が再び必要とされている。</p>
<p>この物語は、Nifercheを探す旅であり、同時に私たち自身がNifercheになる過程の記録でもある。</p>`,
    order: 3,
    worldType: 'common'
  },
  // 第一章のセクション
  {
    id: 'section-2-1',
    chapterId: 'chapter-2',
    title: '科学都市アウローラ',
    content: `<p>Hodemeiの中心都市、アウローラ。</p>
<p>輝くガラスと金属の摩天楼が空を突き、量子コンピューターが都市のすべてを制御している。</p>
<p>ここで、若き科学者ミラ・セイヴァンは、次元間通信の研究に没頭していた。</p>
<p>「私は確信している。他の世界からの信号を捉えたんだ」</p>
<p>同僚たちは懐疑的だったが、ミラの直感は正しかった。</p>`,
    order: 1,
    worldType: 'hodemei'
  },
  {
    id: 'section-2-2',
    chapterId: 'chapter-2',
    title: '異常現象',
    content: `<p>最初の異常は、アウローラの郊外にある量子研究所で発生した。</p>
<p>一瞬、すべての機器が停止し、次の瞬間、未知のデータが画面を埋め尽くした。</p>
<p>ミラはそれを「次元の波」と名付けた。</p>
<p>「これは他の世界からのメッセージだ。私たちは一人じゃない」</p>
<p>しかし、この発見は思わぬ注目を集めることになる。</p>
<p>科学評議会は、この現象を「危険な異常」と判断し、研究の中止を命じた。</p>`,
    order: 2,
    worldType: 'hodemei'
  },
  {
    id: 'section-2-3',
    chapterId: 'chapter-2',
    title: '秘密の研究',
    content: `<p>公式には研究を中止したミラだが、真実を追求する情熱は消えなかった。</p>
<p>彼女は自宅の地下室に小さな研究室を設け、こっそりと「次元の波」の研究を続けた。</p>
<p>そして、彼女は衝撃的な発見をする。</p>
<p>「これは単なる信号じゃない。意識だ。他の世界の誰かが、私たちに接触しようとしている」</p>
<p>彼女がその声に応えた時、Hodemeiの夜明けが始まった。</p>`,
    order: 3,
    worldType: 'hodemei'
  }
];

// サイドストーリー追加データ
export const MOCK_SIDE_STORIES_EXTENDED: Content[] = [
  {
    id: 'side-story-3',
    title: 'サイドストーリー: アウローラの影',
    description: 'Hodemeiの科学都市アウローラの裏側で進行する秘密の実験についての物語です。',
    type: 'text',
    author: 'Official Team',
    world: 'hodemei',
    attribute: 'side_story',
    imageUrl: '/images/side-story-3.jpg',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
    tags: ['都市', '陰謀', '実験'],
    isAvailable: true
  },
  {
    id: 'side-story-4',
    title: 'サイドストーリー: 精霊の歌',
    description: 'Quxeの森に住む若き詩人と精霊の交流を描いた心温まる物語です。',
    type: 'text',
    author: 'Official Team',
    world: 'quxe',
    attribute: 'side_story',
    imageUrl: '/images/side-story-4.jpg',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
    tags: ['精霊', '詩', '交流'],
    isAvailable: true
  },
  {
    id: 'side-story-5',
    title: 'サイドストーリー: 次元の旅人',
    description: 'Alsarejiaの狭間で迷い込んだ旅人の不思議な体験を描いた物語です。',
    type: 'text',
    author: 'Official Team',
    world: 'alsarejia',
    attribute: 'side_story',
    imageUrl: '/images/side-story-5.jpg',
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
    tags: ['旅', '異次元', '迷子'],
    isAvailable: true
  }
];

// サイドストーリーのセクション
export const MOCK_SIDE_STORY_SECTIONS: Record<string, string> = {
  'side-story-1': `<p>研究所の廃墟は、まるで時間が止まったかのように静かだった。</p>
<p>科学者ケイトは、失踪した同僚ジョナサンの足跡を追って、この禁断の場所にやってきた。</p>
<p>「ジョナサン、いったい何を見つけたの？」</p>
<p>彼女が古びた研究室のドアを開けると、そこには想像を超えるものが待っていた。壁一面に貼られた数式と図表。そして中央には、奇妙な装置が置かれていた。</p>
<p>それは「次元共鳴器」と書かれており、どうやらジョナサンが密かに開発していたもののようだ。</p>
<p>ケイトが装置に触れた瞬間、研究室全体が青白い光に包まれた...</p>`,
  
  'side-story-2': `<p>古老ミランは、森の奥深くで若者たちに語り始めた。</p>
<p>「かつてこの森には『夜明けの木』と呼ばれる神聖な樹があった。その枝は星空を映し、その根は大地の記憶に触れていたという」</p>
<p>若き冒険者レインは、この伝説に魅了された。</p>
<p>「その木は今もあるのですか？」</p>
<p>古老は悲しげに頷いた。「あるとも。だが、見つけられるのは純粋な心を持つ者だけじゃ」</p>
<p>こうしてレインの旅が始まった。Quxeの森の深部へ、伝説の木を探す旅が。</p>
<p>しかし彼女は知らなかった。その旅が彼女を別の世界へと導くことになるとは...</p>`,
  
  'side-story-3': `<p>アウローラ科学研究所、地下30階。公式記録には存在しないこの場所で、ドクター・ノヴァは禁断の実験を続けていた。</p>
<p>「被験体A-7は安定しています。次元共鳴率98%」</p>
<p>助手の報告に、ノヴァは満足げに微笑んだ。</p>
<p>「素晴らしい。これで理論は証明された。我々は意識を他の次元に送ることができる」</p>
<p>しかし実験室の隅で、若き研究員アダムは不安を感じていた。</p>
<p>「ドクター、被験体の脳波に異常があります。まるで...別の意識と同期しているかのようです」</p>
<p>それは予期せぬ結果だった。彼らは何かを呼び覚ましてしまったのだ...</p>`,
  
  'side-story-4': `<p>Quxeの森の中で、詩人エリアは一人佇んでいた。</p>
<p>彼女の心には常に言葉があふれ、自然の声を聴くことができた。それは彼女の特別な才能だった。</p>
<p>「また来たのね、言葉を紡ぐ人」</p>
<p>風のような声が彼女の耳に届く。それは森の精霊リリアだった。</p>
<p>「あなたの歌を聴きに来たの」エリアは答えた。</p>
<p>リリアは微笑み、歌い始めた。それは人間の言葉ではなく、純粋な感情の流れだった。</p>
<p>エリアはその歌を詩に変換した。こうして二人の交流は続き、やがて二つの世界を繋ぐ架け橋となっていく...</p>`,
  
  'side-story-5': `<p>気がつくと、マーカスは見知らぬ場所にいた。</p>
<p>空は紫がかった色で、複数の月が浮かんでいる。地面は半透明で、足元に無数の星が見える。</p>
<p>「ここはどこだ...？」</p>
<p>「Alsarejiaの狭間へようこそ、旅人よ」</p>
<p>振り返ると、人間の形をしているが肌が星空のように輝く存在がいた。</p>
<p>「私はステラ。あなたは偶然、次元の裂け目を通ってここに来てしまったのよ」</p>
<p>マーカスは困惑した。「元の世界に戻れるのか？」</p>
<p>ステラは微笑んだ。「もちろん。でも、その前にこの世界の真実を知ってほしい。あなたの世界は、三つの大きな世界の一つにすぎないのよ...」</p>`
};

// 設定資料追加データ
export const MOCK_MATERIALS_EXTENDED: Record<string, string> = {
  'materials-1': `<h2>Hodemeiの科学技術概論</h2>

<h3>1. 基本情報</h3>
<p>Hodemeiは科学と理性の世界です。論理的思考と技術革新が社会の基盤となっており、量子力学や次元物理学が高度に発達しています。</p>

<h3>2. 主要技術</h3>
<ul>
  <li><strong>量子ネットワーク</strong>: 瞬時に惑星全体を結ぶ量子もつれを利用した通信システム</li>
  <li><strong>次元共鳴技術</strong>: 他の次元との共鳴を検出・分析する技術</li>
  <li><strong>分子再構成</strong>: 物質の分子構造を書き換え、新しい形態や特性を与える技術</li>
  <li><strong>脳波同期装置</strong>: 複数の人間の思考を統合・共有できる技術</li>
</ul>

<h3>3. 社会構造</h3>
<p>科学評議会を中心とした実力主義社会。各専門分野のエキスパートが集まり、論理と実証に基づいて政策決定が行われます。</p>

<h3>4. 主要都市</h3>
<p><strong>アウローラ</strong>: 最大の科学都市。巨大な研究施設群と、最新技術を取り入れた建築物が特徴。</p>
<p><strong>ネオシンク</strong>: 脳科学の中心地。集合意識の研究が盛んに行われている。</p>
<p><strong>クオンタム</strong>: 量子技術の実験都市。都市そのものが一つの大きな量子コンピュータとして機能している。</p>

<h3>5. 現在の課題</h3>
<p>技術の急速な発展による倫理問題や、次元の安定性に関する懸念が高まっています。特に「次元の波」と呼ばれる現象は、Hodemeiの科学界で大きな論争を引き起こしています。</p>`,

  'materials-2': `<h2>Quxeの生態系と魔法</h2>

<h3>1. 基本情報</h3>
<p>Quxeは自然と感性の世界です。豊かな自然環境と生命エネルギーが充満しており、魔法と呼ばれる自然エネルギーの操作技術が発達しています。</p>

<h3>2. 生態系</h3>
<ul>
  <li><strong>精霊生物</strong>: 自然エネルギーが具現化した知的生命体。森や川、山など様々な場所に存在する。</li>
  <li><strong>魔法植物</strong>: 特殊な効能を持つ植物。治癒効果や感情増幅など様々な特性がある。</li>
  <li><strong>共生循環</strong>: すべての生命が互いに影響し合い、エネルギーを循環させる複雑なシステム。</li>
</ul>

<h3>3. 魔法体系</h3>
<p><strong>元素魔法</strong>: 火、水、風、土などの自然元素を操る魔法。</p>
<p><strong>生命魔法</strong>: 生命力を活性化させたり、生体を修復したりする魔法。</p>
<p><strong>感覚魔法</strong>: 感情や記憶に働きかける、心と感覚に関連する魔法。</p>
<p><strong>調和魔法</strong>: 異なる元素や生命を結びつけ、新たな効果を生み出す高度な魔法。</p>

<h3>4. 社会構造</h3>
<p>自然と共生する小規模なコミュニティが点在し、調和者（ハーモナイザー）と呼ばれる指導者が共同体を導きます。競争よりも協力を重んじる文化が発達しています。</p>

<h3>5. 主要地域</h3>
<p><strong>始まりの森</strong>: 最も古く、もっとも魔力が強い森。多くの精霊が住んでいる。</p>
<p><strong>共鳴の湖</strong>: 水面が音楽のように波打つ神秘的な湖。感覚魔法の修練場として使われる。</p>
<p><strong>夢見の谷</strong>: 現実と夢の境界が薄い場所。予知能力者が集まる聖地となっている。</p>`,

  'materials-3': `<h2>Alsarejiaの宇宙論</h2>

<h3>1. 基本情報</h3>
<p>Alsarejiaは次元の境界そのものを体現する世界です。物理法則が流動的で、時間と空間の概念が曖昧になっている場所です。</p>

<h3>2. 次元構造</h3>
<ul>
  <li><strong>次元の狭間</strong>: 世界と世界の間に広がる空間。物理法則が不安定で、常に変化している。</li>
  <li><strong>境界の結節点</strong>: 複数の次元が交わる場所。ここでは異なる世界の特性が混ざり合う。</li>
  <li><strong>時間の渦</strong>: 過去、現在、未来が同時に存在する領域。</li>
</ul>

<h3>3. 存在形態</h3>
<p><strong>境界存在</strong>: Alsarejiaに固有の生命体。物理的な形態を持たず、エネルギーと意識の集合体として存在する。</p>
<p><strong>転位者</strong>: 他の世界から来て、Alsarejiaの法則に適応した存在。多くは元の姿を失い、抽象的な形態となる。</p>
<p><strong>概念生命</strong>: 思考や感情などの概念が具現化した生命体。言語や芸術として認識されることもある。</p>

<h3>4. 法則と神秘</h3>
<p><strong>次元の法則</strong>: 常に変化するが、一定のパターンを持つ。この法則を理解することが、Alsarejiaでの「知恵」とされる。</p>
<p><strong>記憶の海</strong>: すべての世界の記憶が集まる場所。時には過去の出来事が再現されることがある。</p>
<p><strong>可能性の結晶</strong>: 起こりうる未来の断片。これを読み解くことで、世界の行方を予測できるとされる。</p>

<h3>5. Nifercheとの関係</h3>
<p>伝説によれば、Nifercheと呼ばれる存在はAlsarejiaを起点として、三つの世界を自由に行き来することができたという。今日のAlsarejiaには、Nifercheの痕跡が数多く残されている。</p>`
};

// キャラクターデータ
export const MOCK_CHARACTERS: Character[] = [
  {
    id: 'character-1',
    name: 'ミラ・セイヴァン',
    title: '次元物理学の先駆者',
    world: 'hodemei',
    description: 'アウローラ科学研究所の若き天才物理学者。次元間通信の研究を進め、他の世界との接触に成功した最初の科学者。好奇心旺盛で、規則に縛られることを嫌う。',
    imageUrl: '/images/character-mira.jpg',
    relationships: [
      { characterId: 'character-3', relationship: '研究パートナー' },
      { characterId: 'character-4', relationship: '対立関係' }
    ],
    appearsIn: ['main-story-2', 'side-story-3'],
    traits: ['知的', '反抗的', '直感的', '情熱的']
  },
  {
    id: 'character-2',
    name: 'エリア・ノート',
    title: '自然の詩人',
    world: 'quxe',
    description: 'Quxeの森で生まれ育った詩人。自然と精霊の声を聴き、それを詩に変換する特別な才能を持つ。穏やかで共感力が高いが、時に孤独を好む。',
    imageUrl: '/images/character-eria.jpg',
    relationships: [
      { characterId: 'character-5', relationship: '師弟関係' }
    ],
    appearsIn: ['side-story-4'],
    traits: ['共感力', '直観力', '創造性', '内省的']
  },
  {
    id: 'character-3',
    name: 'アダム・クロノス',
    title: '時間理論研究者',
    world: 'hodemei',
    description: 'アウローラ科学研究所の研究員。ミラの理論に共鳴し、秘密裏に彼女の研究を支援している。論理的思考の持ち主だが、次第に科学の限界に疑問を持ち始めている。',
    imageUrl: '/images/character-adam.jpg',
    relationships: [
      { characterId: 'character-1', relationship: '研究パートナー' }
    ],
    appearsIn: ['side-story-3'],
    traits: ['論理的', '忠実', '好奇心旺盛', '慎重']
  },
  {
    id: 'character-4',
    name: 'ドクター・ノヴァ',
    title: '科学評議会議長',
    world: 'hodemei',
    description: 'アウローラ科学評議会の最高権威。秩序と科学的方法論を重んじ、制御不能な実験を厳しく取り締まる。表向きは次元研究に反対しているが、裏では独自の実験を進めている。',
    imageUrl: '/images/character-nova.jpg',
    relationships: [
      { characterId: 'character-1', relationship: '対立関係' }
    ],
    appearsIn: ['main-story-2', 'side-story-3'],
    traits: ['権威主義的', '狡猾', '野心的', '知的']
  },
  {
    id: 'character-5',
    name: 'リリア',
    title: '森の精霊',
    world: 'quxe',
    description: 'Quxeの始まりの森に住む古い精霊。自然の知恵を持ち、多くの詩人や賢者を導いてきた。形を自由に変えることができるが、通常は緑の光の集合体として現れる。',
    imageUrl: '/images/character-lilia.jpg',
    relationships: [
      { characterId: 'character-2', relationship: '師弟関係' }
    ],
    appearsIn: ['side-story-4'],
    traits: ['知恵', '神秘的', '自由奔放', '保護的']
  },
  {
    id: 'character-6',
    name: 'ステラ',
    title: '境界の案内人',
    world: 'alsarejia',
    description: 'Alsarejiaの次元の狭間に住む謎の存在。人間の姿を取ることもあるが、本来の姿は星空のように輝く抽象的な形態。様々な世界から迷い込んだ旅人を導く役割を担っている。',
    imageUrl: '/images/character-stella.jpg',
    relationships: [],
    appearsIn: ['side-story-5'],
    traits: ['神秘的', '全知的', '超越的', '親切']
  }
];

// 場所データ
export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'location-1',
    name: 'アウローラ',
    world: 'hodemei',
    description: 'Hodemeiの最大都市。巨大な研究施設群と最新技術を取り入れた高層建築が特徴。量子技術により都市全体が一つの巨大なネットワークとして機能している。',
    imageUrl: '/images/location-aurora.jpg',
    appearsIn: ['main-story-2', 'side-story-3'],
    coordinates: { x: 120, y: 75 }
  },
  {
    id: 'location-2',
    name: '始まりの森',
    world: 'quxe',
    description: 'Quxeで最も古く、最も魔力が強い森。数多くの精霊が住み、自然の知恵が蓄積されている。森の中心には「夜明けの木」と呼ばれる神聖な巨木がある。',
    imageUrl: '/images/location-forest.jpg',
    appearsIn: ['side-story-2', 'side-story-4'],
    coordinates: { x: 65, y: 110 }
  },
  {
    id: 'location-3',
    name: '次元の狭間',
    world: 'alsarejia',
    description: 'Alsarejiaの中心的存在。複数の次元が交差する特異点で、時間と空間の法則が曖昧になっている。ここからは様々な世界の断片を観測することができる。',
    imageUrl: '/images/location-dimension.jpg',
    appearsIn: ['side-story-5'],
    coordinates: { x: 180, y: 180 }
  },
  {
    id: 'location-4',
    name: 'アウローラ科学研究所',
    world: 'hodemei',
    description: 'アウローラの中心に位置する巨大研究施設。表向きは様々な先端科学研究が行われているが、地下階には機密研究室が存在する。ミラ・セイヴァンの実験が行われた場所。',
    imageUrl: '/images/location-lab.jpg',
    appearsIn: ['main-story-2', 'side-story-3'],
    coordinates: { x: 125, y: 80 }
  },
  {
    id: 'location-5',
    name: '共鳴の湖',
    world: 'quxe',
    description: 'Quxeの北部に位置する神秘的な湖。水面が音楽のように波打ち、訪れる者の感情に共鳴する特性を持つ。感覚魔法の修練場として、多くの詩人や魔法使いが訪れる。',
    imageUrl: '/images/location-lake.jpg',
    appearsIn: ['side-story-4'],
    coordinates: { x: 50, y: 95 }
  },
  {
    id: 'location-6',
    name: '記憶の海',
    world: 'alsarejia',
    description: 'Alsarejiaの南部に広がる不思議な空間。液体のような質感を持つが、実際は記憶のエネルギーが凝縮したもの。ここに入ると、過去の記憶や他者の記憶を体験することができる。',
    imageUrl: '/images/location-memory.jpg',
    appearsIn: [],
    coordinates: { x: 165, y: 200 }
  }
];

// 用語集データ
export const MOCK_GLOSSARY: GlossaryItem[] = [
  {
    id: 'glossary-1',
    term: 'Niferche',
    definition: '「次元を越える者」あるいは「世界を繋ぐ存在」という意味。伝説によれば、三つの世界を自由に行き来できる存在であり、世界の均衡を保つ役割を担っていたという。',
    relatedTerms: ['三つの世界', '次元の波'],
    world: 'common',
    category: 'concept'
  },
  {
    id: 'glossary-2',
    term: '三つの世界',
    definition: 'Hodemei（科学と理性の世界）、Quxe（自然と感性の世界）、Alsarejia（次元の境界）の総称。かつては一つだったが、何らかの理由で分断されたと考えられている。',
    relatedTerms: ['Niferche', 'Hodemei', 'Quxe', 'Alsarejia'],
    world: 'common',
    category: 'concept'
  },
  {
    id: 'glossary-3',
    term: '次元の波',
    definition: 'Hodemeiの科学者たちが検出した、他の次元からの信号や影響。一定の周期で強まり、時に物理法則に影響を与えることがある。',
    relatedTerms: ['次元共鳴器', '次元の狭間'],
    world: 'hodemei',
    category: 'concept'
  },
  {
    id: 'glossary-4',
    term: '次元共鳴器',
    definition: 'Hodemeiで開発された、他の次元との共鳴を検出・分析する装置。ミラ・セイヴァンによって初期モデルが開発された。',
    relatedTerms: ['次元の波', 'ミラ・セイヴァン'],
    world: 'hodemei',
    category: 'item'
  },
  {
    id: 'glossary-5',
    term: '始まりの木',
    definition: 'Quxeの森の中心に立つ巨大な神聖樹。すべての自然エネルギーの源とされ、その枝は星空を映し、根は大地の記憶に触れているという。',
    relatedTerms: ['Quxe', '始まりの森'],
    world: 'quxe',
    category: 'item'
  },
  {
    id: 'glossary-6',
    term: '科学評議会',
    definition: 'Hodemeiの政治・学術の中心機関。各専門分野のエキスパートで構成され、論理と実証に基づいて政策決定を行う。現在の議長はドクター・ノヴァ。',
    relatedTerms: ['ドクター・ノヴァ', 'Hodemei'],
    world: 'hodemei',
    category: 'organization'
  },
  {
    id: 'glossary-7',
    term: '調和者',
    definition: 'Quxeのコミュニティの指導者。自然との調和を導き、精霊との交流を仲介する役割を持つ。生まれながらの特別な感受性を持つ者がこの役割に選ばれる。',
    relatedTerms: ['Quxe', '感覚魔法'],
    world: 'quxe',
    category: 'concept'
  },
  {
    id: 'glossary-8',
    term: '境界の結節点',
    definition: 'Alsarejiaにおいて、複数の次元が交わる場所。ここでは異なる世界の特性が混ざり合い、独特の現象が発生する。次元間の移動が可能になる瞬間もあるとされる。',
    relatedTerms: ['Alsarejia', '次元の狭間'],
    world: 'alsarejia',
    category: 'concept'
  },
  {
    id: 'glossary-9',
    term: '記憶の海',
    definition: 'Alsarejiaの南部に広がる不思議な空間。液体のような質感を持つが、実際は記憶のエネルギーが凝縮したもの。ここに入ると、過去の記憶や他者の記憶を体験できる。',
    relatedTerms: ['Alsarejia', '時間の渦'],
    world: 'alsarejia',
    category: 'concept'
  },
  {
    id: 'glossary-10',
    term: '次元崩壊事変',
    definition: '約100年前に起きたとされる大規模な次元不安定現象。三つの世界の境界が一時的に崩れ、大きな混乱が生じた。この出来事以降、世界間の壁は徐々に薄れ始めた。',
    relatedTerms: ['三つの世界', 'Niferche'],
    world: 'common',
    category: 'event'
  }
];

// コンテンツ詳細データ
export const MOCK_CONTENT_DETAILS: ContentDetail[] = [
  {
    contentId: 'main-story-1',
    chapters: MOCK_MAIN_STORY_CHAPTERS.filter(chapter => chapter.contentId === 'main-story-1'),
    sections: MOCK_MAIN_STORY_SECTIONS.filter(section => section.chapterId === 'chapter-1'),
    relatedContentIds: ['main-story-2', 'materials-1', 'materials-2', 'materials-3'],
    glossaryTerms: ['Niferche', '三つの世界', '次元崩壊事変'],
    viewCount: 1250
  },
  {
    contentId: 'main-story-2',
    chapters: MOCK_MAIN_STORY_CHAPTERS.filter(chapter => chapter.contentId === 'main-story-2'),
    sections: MOCK_MAIN_STORY_SECTIONS.filter(section => section.chapterId === 'chapter-2'),
    relatedContentIds: ['main-story-1', 'side-story-1', 'side-story-3', 'materials-1'],
    glossaryTerms: ['次元の波', '次元共鳴器', '科学評議会'],
    viewCount: 980
  },
  {
    contentId: 'side-story-1',
    fullText: MOCK_SIDE_STORY_SECTIONS['side-story-1'],
    chapters: [],
    sections: [],
    relatedContentIds: ['main-story-2', 'materials-1'],
    glossaryTerms: ['次元共鳴器', '次元の波'],
    viewCount: 756
  },
  {
    contentId: 'side-story-2',
    fullText: MOCK_SIDE_STORY_SECTIONS['side-story-2'],
    chapters: [],
    sections: [],
    relatedContentIds: ['materials-2'],
    glossaryTerms: ['始まりの木', '調和者'],
    viewCount: 823
  },
  {
    contentId: 'side-story-3',
    fullText: MOCK_SIDE_STORY_SECTIONS['side-story-3'],
    chapters: [],
    sections: [],
    relatedContentIds: ['main-story-2', 'materials-1'],
    glossaryTerms: ['次元共鳴器', '科学評議会'],
    viewCount: 645
  },
  {
    contentId: 'side-story-4',
    fullText: MOCK_SIDE_STORY_SECTIONS['side-story-4'],
    chapters: [],
    sections: [],
    relatedContentIds: ['materials-2'],
    glossaryTerms: ['調和者', '感覚魔法'],
    viewCount: 712
  },
  {
    contentId: 'side-story-5',
    fullText: MOCK_SIDE_STORY_SECTIONS['side-story-5'],
    chapters: [],
    sections: [],
    relatedContentIds: ['materials-3'],
    glossaryTerms: ['次元の狭間', '境界の結節点'],
    viewCount: 589
  },
  {
    contentId: 'materials-1',
    fullText: MOCK_MATERIALS_EXTENDED['materials-1'],
    chapters: [],
    sections: [],
    relatedContentIds: ['main-story-2', 'side-story-1', 'side-story-3'],
    glossaryTerms: ['科学評議会', '次元の波', '次元共鳴器'],
    viewCount: 934
  },
  {
    contentId: 'materials-2',
    fullText: MOCK_MATERIALS_EXTENDED['materials-2'],
    chapters: [],
    sections: [],
    relatedContentIds: ['side-story-2', 'side-story-4'],
    glossaryTerms: ['調和者', '始まりの木', '感覚魔法'],
    viewCount: 867
  },
  {
    contentId: 'materials-3',
    fullText: MOCK_MATERIALS_EXTENDED['materials-3'],
    chapters: [],
    sections: [],
    relatedContentIds: ['side-story-5'],
    glossaryTerms: ['次元の狭間', '境界の結節点', '記憶の海'],
    viewCount: 802
  }
];

// データをまとめて提供
export const EXTENDED_MOCK_DATA = {
  chapters: MOCK_MAIN_STORY_CHAPTERS,
  sections: MOCK_MAIN_STORY_SECTIONS,
  sideStories: MOCK_SIDE_STORIES_EXTENDED,
  sideStorySections: MOCK_SIDE_STORY_SECTIONS,
  materialsContent: MOCK_MATERIALS_EXTENDED,
  characters: MOCK_CHARACTERS,
  locations: MOCK_LOCATIONS,
  glossary: MOCK_GLOSSARY,
  contentDetails: MOCK_CONTENT_DETAILS
};

// mock_data.ts の MOCK_CONTENTS を再エクスポート
export { MOCK_CONTENTS } from './mock_data';