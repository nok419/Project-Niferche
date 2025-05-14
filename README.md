# Project Niferche

このプロジェクトはAmplify Gen 2を使用したウェブアプリケーションです。

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# TypeScriptの型チェック
npx tsc --noEmit
```

## Amplifyバックエンドのデプロイ

```bash
npx @aws-amplify/cli deploy
```