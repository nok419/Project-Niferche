// src/pages/laboratory/LaboratoryHomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { WorldNavigation } from '../../components/navigation/WorldNavigation';
import { UniversalCard } from '../../core/components/UniversalCard';
import './LaboratoryHomePage.css';

interface SectionProps {
  title: string;
  description: string;
  path: string;
  imageSrc: string;
  tags: string[];
}

/**
 * ラボラトリーのホームページコンポーネント
 * Laboratoryセクションの概要と各コンテンツへのリンクを表示
 */
const LaboratoryHomePage: React.FC = () => {
  // ラボラトリーの各セクション情報
  const laboratorySections: SectionProps[] = [
    {
      title: 'Parallel',
      description: 'Project Nifercheの世界の異なる可能性を探るパラレルストーリーと世界設定',
      path: '/laboratory/parallel',
      imageSrc: '/images/fallback.jpg',
      tags: ['パラレル', 'IF', '代替世界']
    },
    {
      title: 'LCB (Literary Creative Base)',
      description: '創作活動を支援するリソースセンター。世界観構築やストーリー設計のガイド',
      path: '/laboratory/lcb',
      imageSrc: '/images/fallback.jpg',
      tags: ['創作', 'リソース', 'ガイド']
    },
    {
      title: '実験: 2Dアドベンチャー',
      description: 'Project Nifercheの世界を舞台とした実験的な2Dアドベンチャーゲーム',
      path: '/laboratory/experiments/game',
      imageSrc: '/images/fallback.jpg',
      tags: ['ゲーム', '実験', 'アドベンチャー']
    },
    {
      title: '実験: インタラクティブ',
      description: 'インタラクティブなコンテンツとツールを試験的に提供',
      path: '/laboratory/experiments/interactive',
      imageSrc: '/images/fallback.jpg',
      tags: ['インタラクティブ', 'ツール', '実験']
    }
  ];

  return (
    <div className="laboratory-home">
      <header className="laboratory-home__header">
        <h1 className="laboratory-home__title">Laboratory</h1>
        <p className="laboratory-home__description">
          Laboratoryは実験的な創作と探求の場です。
          Project Nifercheの世界をさまざまな角度から深め、拡張するコンテンツを提供しています。
        </p>
      </header>

      <WorldNavigation worldType="laboratory" mode="tab" />

      <section className="laboratory-home__welcome">
        <div className="laboratory-home__welcome-text">
          <h2>実験的創作の場へようこそ</h2>
          <p>
            Laboratoryでは、公式の世界観に縛られない自由な発想による創作活動を推進しています。
            パラレルワールドの探索、創作支援ツール、実験的なインタラクティブコンテンツなど、
            Project Nifercheの世界をより深く楽しむための様々なコンテンツを提供しています。
          </p>
          <p>
            <strong>注意:</strong> このセクションのコンテンツは実験的な性質を持ち、
            今後のアップデートで変更される可能性があります。
          </p>
        </div>
        <div className="laboratory-home__welcome-image">
          <img src="/images/sc.jpg" alt="Laboratory" />
        </div>
      </section>

      <section className="laboratory-home__sections">
        <h2 className="laboratory-home__section-title">Laboratoryのセクション</h2>
        <div className="laboratory-home__cards">
          {laboratorySections.map((section, index) => (
            <Link to={section.path} key={index} className="laboratory-home__card-link">
              <UniversalCard
                title={section.title}
                description={section.description}
                imageUrl={section.imageSrc}
                tags={section.tags}
                variant="laboratory"
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="laboratory-home__updates">
        <h2 className="laboratory-home__section-title">最近の更新</h2>
        <div className="laboratory-home__updates-list">
          <div className="laboratory-home__update-item">
            <span className="laboratory-home__update-date">2025/5/3</span>
            <span className="laboratory-home__update-category">New</span>
            <span className="laboratory-home__update-title">2Dアドベンチャーゲームプロトタイプ公開</span>
          </div>
          <div className="laboratory-home__update-item">
            <span className="laboratory-home__update-date">2025/5/1</span>
            <span className="laboratory-home__update-category">Update</span>
            <span className="laboratory-home__update-title">Parallel セクションに新しいストーリーを追加</span>
          </div>
          <div className="laboratory-home__update-item">
            <span className="laboratory-home__update-date">2025/4/20</span>
            <span className="laboratory-home__update-category">New</span>
            <span className="laboratory-home__update-title">LCB に世界観構築ガイドを追加</span>
          </div>
        </div>
      </section>

      <section className="laboratory-home__participation">
        <h2 className="laboratory-home__section-title">あなたの参加を待っています</h2>
        <p>
          Laboratoryは創作者コミュニティの協力によって成長します。
          あなたのアイデア、ストーリー、イラスト、プログラミングスキルなど、
          どのような形でも参加を歓迎します。
        </p>
        <div className="laboratory-home__buttons">
          <button className="laboratory-home__button">参加方法を確認</button>
          <button className="laboratory-home__button laboratory-home__button--secondary">
            フィードバックを送る
          </button>
        </div>
      </section>
    </div>
  );
};

export default LaboratoryHomePage;