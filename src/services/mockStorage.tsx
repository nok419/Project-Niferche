// src/services/mockStorage.ts
export interface ContentData {
  body: string;
  metadata?: Record<string, any>;
}

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
}