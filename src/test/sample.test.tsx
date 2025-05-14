// src/test/sample.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('サンプルテスト', () => {
  it('1 + 1 は 2 になる', () => {
    expect(1 + 1).toBe(2);
  });

  it('基本的なレンダリングが動作する', () => {
    render(<div data-testid="test-element">テスト</div>);
    expect(screen.getByTestId('test-element')).toHaveTextContent('テスト');
  });
});