// src/types/laboratory.ts
import { BaseContent, ContentVariant } from './common';

// ラボラトリーのカテゴリ
export enum LabCategory {
  FACILITY = 'FACILITY',
  RESEARCH = 'RESEARCH',
  RULES = 'RULES',
  IDEA = 'IDEA',
  OBSERVATION = 'OBSERVATION'
}

// ラボラトリードキュメントインターフェース
export interface LabDocument extends BaseContent {
  category: LabCategory;
  variant: ContentVariant;
  hasDetail?: boolean;
}

// ラボラトリーフィルタリングオプション
export interface LabFilterOptions {
  category?: LabCategory;
  variant?: ContentVariant;
  isAvailable?: boolean;
  hasDetail?: boolean;
}

// ラボラトリーフィルタリングヘルパー関数
export function filterLabDocuments(documents: LabDocument[], options?: LabFilterOptions): LabDocument[] {
  if (!options) return documents;
  
  return documents.filter(doc => {
    // 利用可能かのチェック
    if (options.isAvailable !== undefined && doc.isAvailable !== options.isAvailable) {
      return false;
    }
    
    // カテゴリチェック
    if (options.category && doc.category !== options.category) {
      return false;
    }
    
    // 種類チェック
    if (options.variant && doc.variant !== options.variant) {
      return false;
    }
    
    // 詳細の有無チェック
    if (options.hasDetail !== undefined && doc.hasDetail !== options.hasDetail) {
      return false;
    }
    
    return true;
  });
}