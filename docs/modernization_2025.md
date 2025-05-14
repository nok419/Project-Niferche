# Project Niferche モダナイゼーション (2025)

このドキュメントでは、Project Nifercheのモダナイゼーションの一環として実施した技術的な更新について説明します。これらの更新は2025年の技術標準に合わせて実施されています。

## 目次

1. [パッケージとライブラリの更新](#パッケージとライブラリの更新)
2. [依存関係の最適化](#依存関係の最適化)
3. [TypeScriptの強化](#typescriptの強化)
4. [ビルドシステムの最適化](#ビルドシステムの最適化)
5. [AWS Amplify Gen 2の強化](#aws-amplify-gen-2の強化)
6. [セキュリティの強化](#セキュリティの強化)
7. [パフォーマンスの最適化](#パフォーマンスの最適化)
8. [改善されたメンテナンス性](#改善されたメンテナンス性)

## パッケージとライブラリの更新

### コアライブラリの更新

- **React**: 18.2.0 → 19.0.0
  - Concurrent Modeの完全サポート
  - 新しいReact Server Componentsとの互換性
  - パフォーマンスの向上

- **TypeScript**: 5.2.2 → 5.8.3
  - 高度な型チェックの機能強化
  - 最新のECMAScript機能のサポート
  - デコレータとメタデータリフレクションのネイティブサポート

- **Vite**: 最新のVite 6.3.5を維持
  - esbuildとRollupベースの高速ビルド
  - 効率的なHMR（Hot Module Replacement）

### AWS Amplify関連の更新

- **aws-amplify**: 6.0.0 → 6.0.16
- **@aws-amplify/ui-react**: 6.0.0 → 6.1.5
- **@aws-amplify/backend**: 1.16.1 → 1.18.2
- **@aws-amplify/backend-cli**: 0.9.7 → 0.11.0
- **@aws-amplify/cli**: 12.13.1 → 13.0.0

## 依存関係の最適化

### 廃止パッケージの解決

以下の廃止パッケージを新しい推奨パッケージに置き換えました：

- **inflight@1.0.6** → **inflight@2.0.1**
  - メモリリークの問題を解決
  - lru-cacheに基づく改善された実装

- **@babel/plugin-proposal-class-properties@7.18.6** → **@babel/plugin-transform-class-properties@7.23.3**
  - ECMAScriptに標準化された機能に合わせた更新

- **rimraf@3.0.2** → **rimraf@5.0.5**
  - コールバックからPromiseベースのAPIへの移行
  - パフォーマンスと安全性の向上

- **glob@7.2.3** → **glob@10.3.10**
  - 完全な書き直しによるPromiseベースAPI
  - TypeScriptのネイティブサポート
  - パフォーマンスの向上

### resolutionsとoverridesの追加

パッケージ解決の競合を避けるため、`package.json`に以下の設定を追加：

```json
"resolutions": {
  "glob": "^10.3.10",
  "rimraf": "^5.0.5",
  "@babel/plugin-transform-class-properties": "^7.23.3",
  "inflight": "^2.0.1"
},
"overrides": {
  "glob": "^10.3.10",
  "rimraf": "^5.0.5"
}
```

これにより、深い依存関係内でも最新バージョンのパッケージが使用されます。

## TypeScriptの強化

### 設定の最適化

`tsconfig.json`の更新ポイント：

- **moduleResolution**: "node" → "bundler"
  - Viteのようなバンドラーとの互換性向上

- **追加のTypeScript 5.8オプション**:
  - **verbatimModuleSyntax**: trueでimport/export文の最適化
  - **allowJs**: trueで.jsファイルの段階的な型付け
  - **forceConsistentCasingInFileNames**: ファイル名の大小文字の一貫性を強制

- **リンティング強化**:
  - **noImplicitOverride**: 継承メソッドのオーバーライド時に明示的な宣言を要求
  - **noImplicitReturns**: すべての関数パスに明示的なreturn文を要求
  - **noUncheckedIndexedAccess**: 配列やオブジェクトの索引アクセスで「undefined」チェックを強制

## ビルドシステムの最適化

### Vite設定の強化

`vite.config.ts`の主な改善：

- **Reactプラグインの設定強化**:
  - fastRefreshを有効化
  - Babelの追加設定サポート

- **パスエイリアス**:
  ```js
  alias: {
    '@': '/src',
    '@components': '/src/components',
    '@pages': '/src/pages',
    '@hooks': '/src/hooks',
    '@api': '/src/api',
    '@utils': '/src/utils',
    '@types': '/src/types',
    '@styles': '/src/styles',
    '@assets': '/src/assets'
  }
  ```

- **ビルド最適化**:
  - `target: 'es2022'`で最新のブラウザ機能を活用
  - `minify: 'terser'`で高度なコード圧縮
  - ベンダーチャンキングによるキャッシュ最適化:
    ```js
    manualChunks: {
      'react-vendor': ['react', 'react-dom', 'react-router-dom'],
      'aws-vendor': ['aws-amplify']
    }
    ```

## AWS Amplify Gen 2の強化

### 環境固有の設定

`amplify/backend.ts`で環境ごとに最適化された設定：

```typescript
const storageBucketName = defineParam('storageBucketName', {
  prod: 'niferche-content-prod',
  dev: 'niferche-content-dev',
  default: 'niferche-content'
});

const mfaEnabled = defineParam('mfaEnabled', {
  prod: true,
  dev: false,
  default: true
});
```

### オブザーバビリティと監視

本番環境でのデバッグと監視強化：

```typescript
const enableCloudWatchMetrics = defineParam('enableCloudWatchMetrics', {
  prod: true,
  dev: false,
  default: false
});

const enableXRayTracing = defineParam('enableXRayTracing', {
  prod: true,
  dev: false,
  default: false
});
```

### パフォーマンス最適化

キャッシュ戦略の環境別設定：

```typescript
const dataCacheTtl = defineParam('dataCacheTtl', {
  prod: 300, // 5分
  dev: 60,   // 1分
  default: 0 // キャッシュなし
});
```

### Lambda統合

認証フローカスタマイズのための関数統合：

```typescript
const postConfirmationTrigger = defineFunction({
  name: 'postConfirmationHandler',
  entrypoint: 'functions/auth/postConfirmation.ts',
  environment: {
    USERPOOL_ID: '#{auth:userPoolId}',
    DEFAULT_GROUP: 'USER'
  },
  runtime: {
    memory: 128,
    timeout: 10
  }
});
```

## セキュリティの強化

### 認証セキュリティ

- **パスワードポリシーの強化**:
  ```typescript
  passwordPolicy: {
    minLength: 12, // 8から12に変更
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    temporaryPasswordValidityDays: 3
  }
  ```

- **高度なセキュリティ機能**:
  ```typescript
  advancedSecurity: {
    enabled: true,
    compromisedCredentialsDetection: true,
    riskBasedAdaptiveAuth: true
  }
  ```

- **多要素認証の強化**:
  ```typescript
  multifactor: {
    mode: 'OPTIONAL',
    sms: { /* ... */ },
    totp: true // Time-based One-Time Password サポート追加
  }
  ```

### ESLint設定の追加

セキュアコーディングプラクティスを促進するためのESLint設定の追加：

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

## パフォーマンスの最適化

### React 19の活用

React 19の最新機能を活用するためのアプリケーション更新：

```jsx
// BrowserRouterによるクライアントサイドルーティングの最適化
<BrowserRouter>
  <HelmetProvider>
    <App />
  </HelmetProvider>
</BrowserRouter>
```

### Web Vitalsモニタリング

パフォーマンス指標の収集と分析のためのフレームワーク：

```js
const reportWebVitals = (metric: any) => {
  if (import.meta.env.DEV) {
    console.log(metric);
  } else {
    // 本番環境での分析
  }
};

// 必要に応じて有効化
// import { onCLS, onFID, onLCP } from 'web-vitals';
// onCLS(reportWebVitals);
// onFID(reportWebVitals);
// onLCP(reportWebVitals);
```

## 改善されたメンテナンス性

### ビルドスクリプトの拡張

`package.json`に追加されたスクリプト：

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "typecheck": "tsc --noEmit",
  "lint": "eslint src --ext .ts,.tsx",
  "lint:fix": "eslint src --ext .ts,.tsx --fix",
  "preview": "vite preview"
}
```

### Node.js要件の更新

最新のNode.js LTSバージョンへの要件更新：

```json
"engines": {
  "node": ">=20.12.0"
}
```

---

これらの更新により、Project Nifercheはセキュリティ、パフォーマンス、保守性が大幅に向上し、2025年以降のWeb開発標準に適合するようになりました。依存関係の警告が解消され、最新のフレームワークとツールの利点を最大限に活用できるようになっています。