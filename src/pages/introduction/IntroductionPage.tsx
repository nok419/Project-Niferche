import React from 'react';
import { Link } from 'react-router-dom';
import './IntroductionPage.css';

// 導入セクションコンポーネント
const WelcomeSection: React.FC = () => (
  <section className="welcome-section">
    <h2>Project Nifercheへようこそ</h2>
    <p>
      Project Niferche（ニフェルシェ）は、創造的な文化活動を通じて精神の充実と個性の発揮を支援するプラットフォームです。
      多様な創作物や思考の交流を通じて、皆様の創造性を刺激し、新たな視点や価値観との出会いを提供します。
    </p>
    <p>
      このサイトでは、オリジナルの世界観を基にした物語や、様々な創作コンテンツをお楽しみいただけます。
      また、Laboratoryセクションでは、ユーザー自身が創作活動に参加できる機会も提供しています。
    </p>
  </section>
);

// 世界観紹介セクションコンポーネント
const WorldsSection: React.FC = () => (
  <section className="worlds-section">
    <h2>三つの世界</h2>
    <p>
      Project Nifercheは、「Hodemei」「Quxe」「Alsarejia」という三つの異なる世界を舞台としています。
      それぞれの世界は独自の歴史、文化、科学（または魔法）体系を持ち、様々な物語が紡がれています。
    </p>
    
    <div className="worlds-grid">
      <div className="world-card hodemei">
        <h3>Hodemei（ホデメイ）</h3>
        <p>科学技術が発達した理性の世界。人間の知性と科学的探求が社会の基盤となっています。</p>
        <Link to="/worlds/hodemei" className="world-link">詳細を見る</Link>
      </div>
      
      <div className="world-card quxe">
        <h3>Quxe（キュクス）</h3>
        <p>自然と魔法が融合した感性の世界。自然との調和と精神的な成長が重視されています。</p>
        <Link to="/worlds/quxe" className="world-link">詳細を見る</Link>
      </div>
      
      <div className="world-card alsarejia">
        <h3>Alsarejia（アルサレジア）</h3>
        <p>異世界との接続点となる神秘的な世界。複数の次元が交差する特殊な法則を持っています。</p>
        <Link to="/worlds/alsarejia" className="world-link">詳細を見る</Link>
      </div>
    </div>
  </section>
);

// コンテンツセクションコンポーネント
const ContentSection: React.FC = () => (
  <section className="content-section">
    <h2>提供コンテンツ</h2>
    
    <div className="content-grid">
      <div className="content-card">
        <div className="content-icon">📚</div>
        <h3>メインストーリー</h3>
        <p>Project Nifercheの核となる物語です。三つの世界の関係性や重要な出来事を描いています。</p>
      </div>
      
      <div className="content-card">
        <div className="content-icon">📖</div>
        <h3>サイドストーリー</h3>
        <p>各世界の様々な登場人物や出来事に焦点を当てた短編物語です。</p>
      </div>
      
      <div className="content-card">
        <div className="content-icon">🗺️</div>
        <h3>設定資料</h3>
        <p>世界の歴史、文化、科学体系などの詳細な設定資料です。世界観の理解を深めるのに役立ちます。</p>
      </div>
      
      <div className="content-card">
        <div className="content-icon">🖼️</div>
        <h3>ギャラリー</h3>
        <p>キャラクターや風景のイラスト、コンセプトアートなどの視覚的コンテンツです。</p>
      </div>
      
      <div className="content-card">
        <div className="content-icon">🧪</div>
        <h3>Laboratory</h3>
        <p>ユーザー参加型の創作活動プラットフォームです。二次創作や共同創作を楽しめます。</p>
      </div>
    </div>
  </section>
);

// 利用案内セクションコンポーネント
const GuideSection: React.FC = () => (
  <section className="guide-section">
    <h2>利用案内</h2>
    
    <div className="guide-container">
      <div className="guide-item">
        <h3>コンテンツの閲覧方法</h3>
        <p>
          トップメニューから「Project Niferche」を選択すると、メインストーリー、サイドストーリー、設定資料などの
          コンテンツにアクセスできます。閲覧したいカテゴリーを選択し、コンテンツリストから興味のある項目をクリックしてください。
        </p>
      </div>
      
      <div className="guide-item">
        <h3>Laboratory（ラボラトリー）の利用</h3>
        <p>
          Laboratoryでは、Parallel（二次創作）やLCB（共同創作）などの参加型コンテンツを楽しめます。
          ユーザー登録後、各セクションの案内に従って創作活動に参加してください。
        </p>
      </div>
      
      <div className="guide-item">
        <h3>ユーザー登録について</h3>
        <p>
          ユーザー登録すると、お気に入り機能の利用やコメントの投稿、Laboratory活動への参加などが可能になります。
          画面右上のユーザーアイコンから登録手続きを行ってください。
        </p>
      </div>
    </div>
    
    <div className="cta-buttons">
      <Link to="/gallery" className="cta-button primary">ギャラリーを見る</Link>
      <Link to="/project-niferche/main-story" className="cta-button secondary">メインストーリーを読む</Link>
    </div>
  </section>
);

// はじめにページコンポーネント
const IntroductionPage: React.FC = () => {
  return (
    <div className="introduction-page">
      <header className="page-header">
        <h1>はじめに</h1>
        <p className="page-description">
          Project Nifercheの世界観や利用方法についての案内です。
        </p>
      </header>
      
      <WelcomeSection />
      <WorldsSection />
      <ContentSection />
      <GuideSection />
    </div>
  );
};

export default IntroductionPage;