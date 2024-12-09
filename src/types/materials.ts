// src/types/materials.ts
export type MaterialVariant = 'manuscript' | 'book' | 'document';
export type MaterialCategory = 
  // 共通カテゴリ
  | 'THEORY' 
  | 'LANGUAGE' 
  | 'WORLD'
  | 'HISTORY' 
  // 施設カテゴリ
  | 'FACILITY' 
  | 'IDEA' 
  | 'TECH' 
  // 世界カテゴリ
  | 'MAGIC' 
  | 'ARTIFACT' 
  | 'TECHNOLOGY'
  // 共通要素
  | 'CHARACTER' 
  | 'ORGANIZATION' 
  | 'LOCATION';

export interface MaterialDocument {
  id: string;
  title: string;
  description: string;
  category: MaterialCategory;
  reference?: string;
  linkTo?: string;
  isAvailable: boolean;
  variant?: MaterialVariant;
  imagePath?: string;
}

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