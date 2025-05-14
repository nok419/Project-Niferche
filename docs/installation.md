# Project Niferche インストールガイド

このガイドでは、Project Nifercheのセットアップと実行に必要な手順を説明します。

## 前提条件

- **Node.js**: バージョン 20.12.0 以上
- **npm**: バージョン 10.9.0 以上（Node.js に同梱）
- **AWS アカウント**: Amplify バックエンドをデプロイするため

## インストール手順

### 1. リポジトリのクローン

```bash
git clone <リポジトリURL>
cd Project-Niferche
```

### 2. 依存関係のインストール

```bash
npm install
```

注意: 最初のインストール時に表示される警告は、`package.json`の`overrides`セクションによって解決されています。

### 3. AWS Amplify CLI のインストール (グローバル)

```bash
npm install -g @aws-amplify/cli
```

### 4. 環境変数の設定

必要に応じて`.env`ファイルを作成し、環境変数を設定します：

```
# 開発環境用
VITE_STORAGE_BUCKET=niferche-content-dev
```

### 5. Amplify バックエンドのセットアップ

#### Amplifyへのログイン

```bash
npx amplify login
```

#### バックエンドの初期化

初回のみ実行：

```bash
npx amplify init
```

表示されるプロンプトに従ってプロジェクトを設定します。

#### 環境の作成

```bash
npx amplify env add
```

開発環境と本番環境を分けることをお勧めします：

- `dev`: 開発/テスト用
- `prod`: 本番用

#### バックエンドのデプロイ

```bash
npx amplify push
```

### 6. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは `http://localhost:3000` で実行されます。

## スクリプト一覧

プロジェクトには以下のnpmスクリプトが用意されています：

| スクリプト | 説明 |
|-----------|------|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 本番用ビルドを作成 |
| `npm run preview` | ビルド結果をプレビュー |
| `npm run typecheck` | TypeScriptの型チェックのみを実行 |
| `npm run lint` | ESLintでコードをリント |
| `npm run lint:fix` | ESLintでコードを自動修正 |
| `npm run test` | Vitestでテストを実行 |
| `npm run test:watch` | テストをウォッチモードで実行 |
| `npm run test:coverage` | テストカバレッジレポートを生成 |

## テスト環境の使用方法

### 単体テストの実行

```bash
npm run test
```

### テストファイルの作成

`src/**/*.test.{ts,tsx}`の命名規則でテストファイルを作成します。

例：
```typescript
// src/components/Button/Button.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### コンポーネントのテスト

React Testing Libraryとjest-domマッチャーを使用できます：

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

// クリックイベントのテスト
it('handles click events', () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## トラブルシューティング

### 依存関係の問題

依存関係に関する問題が発生した場合は、node_modulesを削除して再インストールしてみてください：

```bash
rm -rf node_modules
npm install
```

### Amplify関連の問題

1. Amplify CLIが最新バージョンであることを確認：

```bash
npm install -g @aws-amplify/cli
```

2. Amplify設定をリセット（注意: ローカル設定のみをリセットします）：

```bash
npx amplify configure project
```

### ビルドエラー

型エラーを修正するには：

```bash
npm run typecheck
```

エラーに基づいてコードを修正してください。

### テスト関連の問題

テスト環境の問題が発生した場合：

```bash
# Testing Libraryの追加インストール
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

## 追加リソース

- [Project Niferche ドキュメント](./niferche_docs)
- [AWS Amplify Gen 2 ドキュメント](https://docs.amplify.aws/)
- [モダナイゼーション詳細](./modernization_2025.md)
- [React 19 ドキュメント](https://react.dev/)
- [Vitest ドキュメント](https://vitest.dev/)
- [Testing Library ドキュメント](https://testing-library.com/docs/)