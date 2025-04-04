// src/types/materials.ts
import { BaseContent, ContentVariant, WorldCategory } from './common';

// マテリアルの種類
export type MaterialVariant = 'manuscript' | 'book' | 'document';

// マテリアルのカテゴリ
export enum MaterialCategory {
  // 共通カテゴリ
  THEORY = 'THEORY',
  LANGUAGE = 'LANGUAGE',
  WORLD = 'WORLD',
  HISTORY = 'HISTORY',
  
  // 施設カテゴリ
  FACILITY = 'FACILITY',
  IDEA = 'IDEA',
  TECH = 'TECH',
  
  // 世界カテゴリ
  MAGIC = 'MAGIC',
  ARTIFACT = 'ARTIFACT',
  TECHNOLOGY = 'TECHNOLOGY',
  
  // 共通要素
  CHARACTER = 'CHARACTER',
  ORGANIZATION = 'ORGANIZATION',
  LOCATION = 'LOCATION'
}

// マテリアルドキュメントインターフェース
export interface MaterialDocument extends BaseContent {
  category: MaterialCategory;
  worldType?: WorldCategory; // オプショナルに変更
  linkTo?: string;
  variant?: MaterialVariant | ContentVariant; // ContentVariantも使用可能に
}

// マテリアルフィルタリングオプション
export interface MaterialFilterOptions {
  category?: MaterialCategory;
  worldType?: WorldCategory;
  variant?: MaterialVariant | ContentVariant;
  isAvailable?: boolean;
}

// マテリアルフィルタリングヘルパー関数
export function filterMaterials(materials: MaterialDocument[], options?: MaterialFilterOptions): MaterialDocument[] {
  if (!options) return materials;
  
  return materials.filter(material => {
    // 利用可能かのチェック
    if (options.isAvailable !== undefined && material.isAvailable !== options.isAvailable) {
      return false;
    }
    
    // カテゴリチェック
    if (options.category && material.category !== options.category) {
      return false;
    }
    
    // 世界タイプチェック
    if (options.worldType && material.worldType !== options.worldType) {
      return false;
    }
    
    // 種類チェック
    if (options.variant && material.variant !== options.variant) {
      return false;
    }
    
    return true;
  });
}

// 表示用テーマ設定
export interface MaterialsThemeTokens {
  colors: {
    background: {
      primary: { value: string };
      secondary: { value: string };
      tertiary: { value: string };
    };
    font: {
      primary: { value: string };
      secondary: { value: string };
      tertiary: { value: string };
    };
    border: {
      primary: { value: string };
      secondary: { value: string };
    };
  };
}