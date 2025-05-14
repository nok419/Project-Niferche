# Project Niferche 開発ガイド

## 開発環境

- Node.js 18.19.0+
- npm 10.2.3+
- TypeScript 5.2.2
- React 18.2.0
- AWS Amplify Gen2 6.0.0

## プロジェクト構造

```
src/
├── assets/           # 静的アセット（画像、SVG、フォント）
├── core/             # コアシステム
│   ├── components/   # 基本コンポーネント 
│   ├── hooks/        # コアフック
│   ├── services/     # サービス層
│   ├── context/      # Contextプロバイダー
│   └── utils/        # ユーティリティ関数
├── features/         # 機能単位のモジュール
│   ├── auth/         # 認証関連
│   ├── story/        # ストーリー（メイン/サイド）
│   ├── materials/    # 設定資料
│   ├── gallery/      # ギャラリー
│   └── laboratory/   # 研究所（LCB/Parallel）
│       ├── lcb/      # Layered Creative Base
│       └── parallel/ # Parallel Projects
├── layout/           # レイアウト
│   ├── base/         # BaseLayout
│   ├── navigation/   # ナビゲーション関連
│   └── specific/     # 特化レイアウト
├── pages/            # ページコンポーネント
├── styles/           # グローバルスタイルとテーマ
├── types/            # グローバル型定義
├── config/           # 設定ファイル
├── App.tsx           # アプリのエントリポイント
└── main.tsx          # レンダリングエントリポイント
```

## 開発コマンド

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# TypeScriptの型チェック
npx tsc --noEmit

# プロジェクトのビルド
npm run build

# ビルド済みプロジェクトのプレビュー
npm run preview
```

## コーディング規約

1. **コンポーネント命名**
   - PascalCase を使用（例: ContentCard）
   - ファイル名はコンポーネント名と一致させる

2. **ファイル構成**
   - 関連するファイルは同じディレクトリに配置
   - インデックスファイルでエクスポート

3. **TypeScript**
   - 型は明示的に定義
   - any型の使用は避ける
   - インターフェースには'I'プレフィックスを使用（例: ICardProps）

4. **スタイリング**
   - CSS変数を使用したテーマシステム
   - コンポーネント固有のスタイルは同じディレクトリに配置

5. **テスト**
   - ユニットテストはコンポーネントと同じディレクトリに配置
   - テストファイル名は .test.tsx または .spec.tsx

## テーマシステム

4つの世界観に対応したテーマシステム:

- Hodemei (近未来): スタイリッシュで洗練された近未来的デザイン
- Quxe (ファンタジー): 幻想的で神秘的な自然との調和
- Alsarejia (宇宙的): 神秘的で静謐な宇宙的空間
- Laboratory (実験室): Alsarejiaをベースにした実験的要素

### CSS変数の例
```css
:root {
  /* Base Colors */
  --color-white: #FFFFFF;
  --color-black: #000000;
  
  /* Hodemei Theme */
  --hodemei-primary: #0070F3;
  --hodemei-secondary: #00C9A7;
  /* ... */
}
```

## コンポーネントの実装ガイドライン

1. **再利用性**
   - 単一責任の原則に従う
   - 汎用的なプロパティを設計
   - カスタマイズオプションを提供

2. **アクセシビリティ**
   - ARIAラベルを適切に使用
   - キーボードナビゲーションをサポート
   - コントラスト比を確保

3. **パフォーマンス**
   - 不要な再レンダリングを避ける
   - メモ化を適切に使用
   - 大きな依存関係を避ける

4. **エラーハンドリング**
   - 明示的なエラー状態
   - フォールバックUIの提供
   - エラーバウンダリの使用

## 世界観別の分類

### コンテンツカテゴリ
- MAIN_STORY: メインストーリー
- SIDE_STORY: サイドストーリー
- SETTING_MATERIAL: 設定資料
- CHARACTER: キャラクター情報
- ORGANIZATION: 組織情報
- THEORY: 理論/概念
- MERCHANDISE: 商品情報
- SITE_INFO: サイト情報

### 世界カテゴリ
- COMMON: 共通設定
- QUXE: クーシェ
- HODEMEI: ホウデメイ
- ALSAREJIA: アルサレジア