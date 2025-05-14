// モックデータ定義

// 世界タイプ
export type WorldType = 'hodemei' | 'quxe' | 'alsarejia' | 'common';

// 属性タイプ
export type AttributeType = 'main_story' | 'side_story' | 'materials' | 'lcb' | 'parallel' | 'gallery';

// コンテンツタイプ
export type ContentType = 'text' | 'image' | 'video' | 'audio' | 'other';

// コンテンツインターフェース
export interface Content {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  author: string;
  world: WorldType;
  attribute: AttributeType;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isAvailable: boolean;
}

// お知らせインターフェース
export interface Announcement {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  category: 'update' | 'event' | 'important' | 'general';
  isHighlighted: boolean;
}

// モックコンテンツデータ
export const MOCK_CONTENTS: Content[] = [
  // メインストーリー
  {
    id: 'main-story-1',
    title: 'メインストーリー: 始まりの章',
    description: 'Project Nifercheの世界観を紹介する序章です。',
    type: 'text',
    author: 'Official Team',
    world: 'common',
    attribute: 'main_story',
    imageUrl: '/images/main-story-1.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    tags: ['序章', '紹介', '世界観'],
    isAvailable: true
  },
  {
    id: 'main-story-2',
    title: 'メインストーリー: Hodemeiの夜明け',
    description: 'Hodemeiの世界における中核的な出来事を描いた物語です。',
    type: 'text',
    author: 'Official Team',
    world: 'hodemei',
    attribute: 'main_story',
    imageUrl: '/images/main-story-2.jpg',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    tags: ['Hodemei', '中核物語', '科学'],
    isAvailable: true
  },
  
  // サイドストーリー
  {
    id: 'side-story-1',
    title: 'サイドストーリー: 失われた研究',
    description: 'Hodemeiの科学者が残した謎の研究記録を追う物語です。',
    type: 'text',
    author: 'Official Team',
    world: 'hodemei',
    attribute: 'side_story',
    imageUrl: '/images/side-story-1.jpg',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z',
    tags: ['研究', '謎', 'サイエンス'],
    isAvailable: true
  },
  {
    id: 'side-story-2',
    title: 'サイドストーリー: Quxeの森の伝説',
    description: 'Quxeの世界に伝わる古い伝説を紐解く旅の物語です。',
    type: 'text',
    author: 'Official Team',
    world: 'quxe',
    attribute: 'side_story',
    imageUrl: '/images/side-story-2.jpg',
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    tags: ['伝説', '冒険', '森'],
    isAvailable: true
  },
  
  // 設定資料
  {
    id: 'materials-1',
    title: 'Hodemeiの科学技術概要',
    description: 'Hodemeiの世界における科学技術の発展と特徴について解説します。',
    type: 'text',
    author: 'Official Team',
    world: 'hodemei',
    attribute: 'materials',
    imageUrl: '/images/materials-1.jpg',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
    tags: ['科学技術', '解説', 'テクノロジー'],
    isAvailable: true
  },
  {
    id: 'materials-2',
    title: 'Quxeの生態系と魔法',
    description: 'Quxeの世界における生態系と魔法の関係性について解説します。',
    type: 'text',
    author: 'Official Team',
    world: 'quxe',
    attribute: 'materials',
    imageUrl: '/images/materials-2.jpg',
    createdAt: '2024-03-10T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
    tags: ['生態系', '魔法', '自然'],
    isAvailable: true
  },
  {
    id: 'materials-3',
    title: 'Alsarejiaの宇宙論',
    description: 'Alsarejiaの世界における宇宙の構造と法則について解説します。',
    type: 'text',
    author: 'Official Team',
    world: 'alsarejia',
    attribute: 'materials',
    imageUrl: '/images/materials-3.jpg',
    createdAt: '2024-03-20T00:00:00Z',
    updatedAt: '2024-03-25T00:00:00Z',
    tags: ['宇宙', '理論', '法則'],
    isAvailable: true
  },
  
  // ギャラリー
  {
    id: 'gallery-1',
    title: 'Hodemei都市風景',
    description: 'Hodemeiの未来都市の風景イラストです。',
    type: 'image',
    author: 'Art Team',
    world: 'hodemei',
    attribute: 'gallery',
    imageUrl: '/images/gallery-1.jpg',
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
    tags: ['イラスト', '都市', '風景'],
    isAvailable: true
  },
  {
    id: 'gallery-2',
    title: 'Quxeの森の精霊',
    description: 'Quxeの森に住む精霊たちのイラストです。',
    type: 'image',
    author: 'Art Team',
    world: 'quxe',
    attribute: 'gallery',
    imageUrl: '/images/gallery-2.jpg',
    createdAt: '2024-04-05T00:00:00Z',
    updatedAt: '2024-04-05T00:00:00Z',
    tags: ['イラスト', '精霊', '森'],
    isAvailable: true
  },
  
  // Parallel
  {
    id: 'parallel-1',
    title: '二次創作: Hodemeiの影',
    description: 'ユーザーが創作したHodemeiを舞台にした短編小説です。',
    type: 'text',
    author: 'User123',
    world: 'hodemei',
    attribute: 'parallel',
    imageUrl: '/images/parallel-1.jpg',
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
    tags: ['二次創作', '小説', 'ファンフィクション'],
    isAvailable: true
  },
  
  // LCB
  {
    id: 'lcb-1',
    title: 'LCB: 共同創作プロジェクト「星の欠片」',
    description: '複数ユーザーが参加して創り上げる共同創作プロジェクトです。',
    type: 'text',
    author: 'LCB Community',
    world: 'alsarejia',
    attribute: 'lcb',
    imageUrl: '/images/lcb-1.jpg',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-06-10T00:00:00Z',
    tags: ['共同創作', 'コミュニティ', '進行中'],
    isAvailable: true
  }
];

// モックお知らせデータ
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'announcement-1',
    title: 'サイトリニューアルのお知らせ',
    content: 'Project Nifercheウェブサイトをリニューアルしました。新しい機能やデザインをお楽しみください。',
    publishedAt: '2024-04-01T00:00:00Z',
    category: 'update',
    isHighlighted: true
  },
  {
    id: 'announcement-2',
    title: '新サイドストーリー公開',
    content: '新しいサイドストーリー「Quxeの森の伝説」を公開しました。',
    publishedAt: '2024-02-10T00:00:00Z',
    category: 'update',
    isHighlighted: false
  },
  {
    id: 'announcement-3',
    title: 'メンテナンスのお知らせ',
    content: '2024年5月15日13:00〜15:00の間、システムメンテナンスのためサイトにアクセスできない場合があります。',
    publishedAt: '2024-05-10T00:00:00Z',
    category: 'important',
    isHighlighted: true
  },
  {
    id: 'announcement-4',
    title: 'LCB機能リリース',
    content: '共同創作プラットフォーム「LCB」の機能をリリースしました。皆さんの創作活動をお待ちしています。',
    publishedAt: '2024-06-01T00:00:00Z',
    category: 'update',
    isHighlighted: true
  },
  {
    id: 'announcement-5',
    title: 'ギャラリーコンテスト開催',
    content: 'Project Nifercheの世界観をテーマにしたイラストコンテストを開催します。詳細はイベントページをご確認ください。',
    publishedAt: '2024-04-15T00:00:00Z',
    category: 'event',
    isHighlighted: false
  }
];

// ナビゲーション項目
export const NAVIGATION_ITEMS = {
  main: [
    { id: 'home', label: 'ホーム', path: '/' },
    { id: 'announcements', label: 'お知らせ', path: '/announcements' },
    { id: 'intro', label: 'はじめに', path: '/intro' },
    { id: 'gallery', label: 'ギャラリー', path: '/gallery' }
  ],
  projectNiferche: [
    { id: 'main-story', label: 'メインストーリー', path: '/main-story' },
    { id: 'side-story', label: 'サイドストーリー', path: '/side-story' },
    { id: 'materials', label: '設定資料', path: '/materials' }
  ],
  laboratory: [
    { id: 'lab-home', label: 'ラボラトリーホーム', path: '/laboratory' },
    { id: 'parallel', label: 'Parallel', path: '/laboratory/parallel' },
    { id: 'lcb', label: 'LCB', path: '/laboratory/lcb' }
  ],
  worlds: [
    { id: 'common', label: '共通設定', path: '/worlds/common' },
    { id: 'hodemei', label: 'Hodemei', path: '/worlds/hodemei' },
    { id: 'quxe', label: 'Quxe', path: '/worlds/quxe' },
    { id: 'alsarejia', label: 'Alsarejia', path: '/worlds/alsarejia' }
  ]
};

// ユーザーモックデータ
export const MOCK_USERS = [
  {
    id: 'user-1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    nickname: '管理者',
    badges: ['badge-1', 'badge-2', 'badge-3'],
    favorites: [
      { contentId: 'main-story-1', addedAt: '2024-01-15T00:00:00Z' },
      { contentId: 'side-story-2', addedAt: '2024-02-20T00:00:00Z' }
    ]
  },
  {
    id: 'user-2',
    username: 'user123',
    email: 'user123@example.com',
    role: 'user',
    nickname: 'クリエイター',
    badges: ['badge-1'],
    favorites: [
      { contentId: 'gallery-1', addedAt: '2024-04-02T00:00:00Z' }
    ]
  }
];

// バッジモックデータ
export const MOCK_BADGES = [
  {
    id: 'badge-1',
    name: '世界の探索者',
    description: 'すべての世界の記事を1つ以上読んだユーザーに贈られるバッジ',
    requirementType: 'READ_CONTENT',
    requirement: 'all_worlds',
    priority: 1,
    isSecret: false
  },
  {
    id: 'badge-2',
    name: '熱心な読者',
    description: 'メインストーリーをすべて読破したユーザーに贈られるバッジ',
    requirementType: 'READ_CONTENT',
    requirement: 'all_main_story',
    priority: 2,
    isSecret: false
  },
  {
    id: 'badge-3',
    name: '創作の友',
    description: 'Parallelに作品を投稿したユーザーに贈られるバッジ',
    requirementType: 'CLICK_ACTION',
    requirement: 'publish_parallel',
    priority: 3,
    isSecret: false
  }
];