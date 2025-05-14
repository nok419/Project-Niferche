// src/pages/demo/WorldNavigationDemo.tsx
import React, { useState } from 'react';
import { WorldNavigation } from '../../components/navigation/WorldNavigation';
import { WorldType } from '../../types/common';
import './WorldNavigationDemo.css';

/**
 * 世界別ナビゲーションのデモページ
 */
const WorldNavigationDemo: React.FC = () => {
  const [selectedWorld, setSelectedWorld] = useState<WorldType>('hodemei');
  
  const handleWorldChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWorld(event.target.value as WorldType);
  };

  return (
    <div className="world-navigation-demo">
      <header className="demo-header">
        <h1>世界別ナビゲーションデモ</h1>
        <p>Project Nifercheの世界に応じたナビゲーションコンポーネントのデモです。</p>
      </header>

      <div className="demo-controls">
        <label htmlFor="world-select">世界を選択:</label>
        <select 
          id="world-select" 
          value={selectedWorld} 
          onChange={handleWorldChange}
          className="world-select"
        >
          <option value="hodemei">Hodemei (科学と理性の世界)</option>
          <option value="quxe">Quxe (自然と感性の世界)</option>
          <option value="alsarejia">Alsarejia (次元の境界)</option>
          <option value="laboratory">Laboratory (実験的創作の場)</option>
          <option value="common">Common (共通)</option>
        </select>
      </div>

      <section className="demo-section">
        <h2>アイコンモード</h2>
        <p>コンパクトなアイコン表示。ヘッダーやサイドバーに適しています。</p>
        <div className="demo-container">
          <WorldNavigation worldType={selectedWorld} mode="icon" />
        </div>
      </section>

      <section className="demo-section">
        <h2>カードモード</h2>
        <p>視覚的でインタラクティブなカード表示。メインページに適しています。</p>
        <div className="demo-container">
          <WorldNavigation worldType={selectedWorld} mode="card" />
        </div>
      </section>

      <section className="demo-section">
        <h2>タブモード</h2>
        <p>効率的なタブ表示。コンテンツページのナビゲーションに適しています。</p>
        <div className="demo-container">
          <WorldNavigation worldType={selectedWorld} mode="tab" />
        </div>
      </section>

      <footer className="demo-footer">
        <p>このコンポーネントは、プロジェクトの各世界(Hodemei、Quxe、Alsarejia)に適したナビゲーションを提供します。</p>
        <p>各世界の特性に合わせたスタイルとコンテンツを表示し、ユーザーエクスペリエンスを向上させます。</p>
      </footer>
    </div>
  );
};

export default WorldNavigationDemo;