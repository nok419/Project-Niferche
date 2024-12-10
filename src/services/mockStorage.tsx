// src/services/mockStorage.ts
import type { LabDocument } from '../types/laboratory';
export interface ContentData {
  body: string;
  metadata?: Record<string, any>;
}

const MOCK_IDEA_DOCS: Record<string, LabDocument[]> = {
  'basic': [
    {
      id: 'idea-basis',
      title: 'アイデア体の基礎',
      description: 'アイデア体とその性質についての基本的な解説',
      category: 'IDEA',
      reference: 'IDA-001',
      isAvailable: true,
      variant: 'document'
    },
    {
      id: 'idea-structure',
      title: 'アイデア構造論',
      description: 'アイデア体の内部構造と相互作用',
      category: 'IDEA',
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
      category: 'IDEA',
      reference: 'IDA-003',
      isAvailable: true,
      variant: 'document'
    },
    {
      id: 'idea-lifecycle',
      title: 'ライフサイクル',
      description: 'アイデア体の生成から消滅までの過程',
      category: 'IDEA',
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
      category: 'IDEA',
      reference: 'IDA-005',
      isAvailable: true,
      variant: 'document'
    }
  ]
};

const MOCK_FACILITY_DOCS: Record<string, LabDocument[]> = {
  'overview': [
    {
      id: 'facility-map',
      title: '施設マップ',
      description: 'アルサレジア研究所の全体マップです',
      category: 'FACILITY',
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
      category: 'FACILITY',
      reference: 'FAC-003',
      isAvailable: true,
      variant: 'document'
    },
    {
      id: 'facility-resources',
      title: '設備・リソース',
      description: '利用可能な研究設備とリソースの一覧',
      category: 'FACILITY',
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
      category: 'RULES',
      reference: 'FAC-002',
      isAvailable: true,
      variant: 'document'
    }
  ]
};

const MOCK_CONTENT: Record<string, ContentData> = {
  'stories/main/chapter1.txt': {
    body: '第1章のサンプルテキスト...',
    metadata: {
      title: '第1章',
      author: 'サレジア'
    }
  },
  'stories/main/chapter2.txt': {
    body: '第2章のサンプルテキスト...',
    metadata: {
      title: '第2章',
      author: 'サレジア'
    }
  },
  'laboratory/ideas/basic-concept.md': {
    body: 'アイデア体の基本概念に関する説明...',
    metadata: {
      title: 'アイデア体の基本概念',
      category: 'IDEA',
      reference: 'IDA-001'
    }
  },
  'laboratory/facility/rules.md': {
    body: '研究所の利用規約と注意事項...',
    metadata: {
      title: '研究所利用規約',
      category: 'RULES',
      reference: 'FAC-002'
    }
  }
};

export class MockStorageService {
  static async getText(path: string): Promise<string> {
    const content = MOCK_CONTENT[path];
    if (!content) {
      throw new Error('Content not found');
    }
    return content.body;
  }
  static async getFacilityDocuments(section: string): Promise<LabDocument[]> {
    const docs = MOCK_FACILITY_DOCS[section];
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
  static async getIdeaDocuments(category: string): Promise<LabDocument[]> {
    const docs = MOCK_IDEA_DOCS[category];
    if (!docs) {
      return [];
    }
    return docs;
  }
}
