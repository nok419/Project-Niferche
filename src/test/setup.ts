// src/test/setup.ts
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// RTL のカスタムマッチャーを vitest で使用できるようにする
expect.extend(matchers);

// 各テスト後にクリーンアップを実行
afterEach(() => {
  cleanup();
});

// グローバルモックの設定
vi.mock('aws-amplify', () => {
  return {
    Amplify: {
      configure: vi.fn(),
    },
  };
});

// 必要に応じてモックを追加