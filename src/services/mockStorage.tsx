// src/services/mockStorage.ts
import { LabDocument, LabCategory } from '../types/laboratory';

export interface ContentData {
  body: string;
  metadata?: Record<string, any>;
}

interface ImageContent {
  path: string;
  fallback: string;
}

// イメージのモックデータ
const MOCK_IMAGES: Record<string, ImageContent> = {
  'main-story': {
    path: '/images/main-story.jpg',
    fallback: '/images/fallback.jpg'
  },
  'worlds': {
    path: '/images/worlds.jpg',
    fallback: '/images/fallback.jpg'
  },
  'laboratory': {
    path: '/images/laboratory.jpg',
    fallback: '/images/fallback.jpg'
  },
  'facility-map': {
    path: '/images/laboratory/facility-map.jpg',
    fallback: '/images/fallback.jpg'
  }
};

// アイデアドキュメントのモックデータ
const MOCK_IDEA_DOCS: Record<string, LabDocument[]> = {
  'basic': [
    {
      id: 'idea-basis',
      title: 'アイデア体の基礎',
      description: 'アイデア体とその性質についての基本的な解説',
      category: LabCategory.IDEA,
      reference: 'IDA-001',
      isAvailable: true,
      variant: 'document'
    },
    {
      id: 'idea-structure',
      title: 'アイデア構造論',
      description: 'アイデア体の内部構造と相互作用',
      category: LabCategory.IDEA,
      reference: 'IDA-002',
      isAvailable: true,
      variant: 'document'
    }
  ],
  'advanced': [
    {
      id: 'idea-resonance',
      title: '共鳴現象',
      description: 'アイデア体間の共鳴と増幅に関する研究',
      category: LabCategory.IDEA,
      reference: 'IDA-003',
      isAvailable: true,
      variant: 'document'
    },
    {
      id: 'idea-lifecycle',
      title: 'ライフサイクル',
      description: 'アイデア体の生成から消滅までの過程',
      category: LabCategory.IDEA,
      reference: 'IDA-004',
      isAvailable: false,
      variant: 'document'
    }
  ],
  'research': [
    {
      id: 'idea-measurement',
      title: '観測方法論',
      description: 'アイデア体の観測と記録の手法',
      category: LabCategory.IDEA,
      reference: 'IDA-005',
      isAvailable: true,
      variant: 'document'
    }
  ]
};

// 施設ドキュメントのモックデータ
const MOCK_FACILITY_DOCS: Record<string, LabDocument[]> = {
  'overview': [
    {
      id: 'facility-map',
      title: '施設マップ',
      description: 'アルサレジア研究所の全体マップです',
      category: LabCategory.FACILITY,
      reference: 'FAC-001',
      isAvailable: true,
      variant: 'image',
      imagePath: '/images/laboratory/facility-map.jpg'
    }
  ],
  'areas': [
    {
      id: 'facility-security',
      title: 'セキュリティガイド',
      description: '研究所内での安全管理と機密情報の取り扱いについて',
      category: LabCategory.FACILITY,
      reference: 'FAC-003',
      isAvailable: true,
      variant: 'document'
    },
    {
      id: 'facility-resources',
      title: '設備・リソース',
      description: '利用可能な研究設備とリソースの一覧',
      category: LabCategory.FACILITY,
      reference: 'FAC-004',
      isAvailable: false,
      variant: 'document'
    }
  ],
  'rules': [
    {
      id: 'facility-rules',
      title: '利用規約',
      description: '研究所の利用に関する基本的な規則と注意事項',
      category: LabCategory.RULES,
      reference: 'FAC-002',
      isAvailable: true,
      variant: 'document'
    }
  ]
};

// テキストコンテンツのモックデータ
const MOCK_CONTENT: Record<string, ContentData> = {
  'stories/main/chapter1.txt': {
    body: '第1章のサンプルテキスト...\nここに本文が入ります。\n\n詳細な内容はこれから追加されます。',
    metadata: {
      title: '第1章',
      author: 'サレジア',
      version: '1.0.0'
    }
  },
  'stories/main/chapter2.txt': {
    body: '第2章のサンプルテキスト...\nここに本文が入ります。\n\n詳細な内容はこれから追加されます。',
    metadata: {
      title: '第2章',
      author: 'サレジア',
      version: '1.0.0'
    }
  },
  'laboratory/ideas/basic-concept.md': {
    body: 'アイデア体の基本概念に関する説明...\n\n1. アイデア体とは\n2. 基本的な性質\n3. 観測方法\n\n詳細な内容はこれから追加されます。',
    metadata: {
      title: 'アイデア体の基本概念',
      category: LabCategory.IDEA,
      reference: 'IDA-001'
    }
  },
  'laboratory/facility/rules.md': {
    body: '研究所の利用規約と注意事項...\n\n1. 一般的な注意事項\n2. セキュリティ規則\n3. 緊急時の対応\n\n詳細な内容はこれから追加されます。',
    metadata: {
      title: '研究所利用規約',
      category: LabCategory.RULES,
      reference: 'FAC-002'
    }
  }
};

// MockStorageServiceクラス
export class MockStorageService {
  static async getText(path: string): Promise<string> {
    const content = MOCK_CONTENT[path];
    if (!content) {
      throw new Error('Content not found');
    }
    return content.body;
  }

  static async getImage(path: string): Promise<string> {
    const image = MOCK_IMAGES[path];
    if (!image) {
      return '/images/fallback.jpg';
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(image.path);
      img.onerror = () => resolve(image.fallback);
      img.src = image.path;
    });
  }

  static async getFacilityDocuments(section: string): Promise<LabDocument[]> {
    const docs = MOCK_FACILITY_DOCS[section];
    if (!docs) {
      return [];
    }
    return docs;
  }

  static async getIdeaDocuments(category: string): Promise<LabDocument[]> {
    const docs = MOCK_IDEA_DOCS[category];
    if (!docs) {
      return [];
    }
    return docs;
  }

  static async getMetadata(path: string): Promise<Record<string, any>> {
    const content = MOCK_CONTENT[path];
    if (!content || !content.metadata) {
      throw new Error('Metadata not found');
    }
    return content.metadata;
  }

  static async getAllContent(): Promise<Record<string, ContentData>> {
    return MOCK_CONTENT;
  }

  static async getContentsByCategory(category: string): Promise<ContentData[]> {
    return Object.entries(MOCK_CONTENT)
      .filter(([_, content]) => content.metadata?.category === category)
      .map(([_, content]) => content);
  }

  static async isContentAvailable(path: string): Promise<boolean> {
    return path in MOCK_CONTENT;
  }

  static async isImageAvailable(path: string): Promise<boolean> {
    return path in MOCK_IMAGES;
  }

  static getFallbackImage(): string {
    return '/images/fallback.jpg';
  }

  static simulateNetworkError(): Promise<never> {
    return Promise.reject(new Error('Network error'));
  }
}