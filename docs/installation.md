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

注意: 最初のインストール時に表示される警告は、`package.json`の`resolutions`および`overrides`セクションによって解決されています。

### 3. 環境変数の設定

必要に応じて`.env`ファイルを作成し、環境変数を設定します：

```
# 開発環境用
VITE_STORAGE_BUCKET=niferche-content-dev
```

### 4. Amplify バックエンドのセットアップ

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

### 5. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは `http://localhost:3000` で実行されます。

## 本番環境用ビルド

最適化されたビルドを作成するには：

```bash
npm run build
```

ビルド結果をプレビューするには：

```bash
npm run preview
```

## TypeScript型チェック

型チェックのみを実行するには：

```bash
npm run typecheck
```

## リンティング

コードのリントを実行するには：

```bash
npm run lint
```

リント問題の自動修正を試みるには：

```bash
npm run lint:fix
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

## 追加リソース

- [Project Niferche ドキュメント](./niferche_docs)
- [AWS Amplify Gen 2 ドキュメント](https://docs.amplify.aws/)
- [モダナイゼーション詳細](./modernization_2025.md)