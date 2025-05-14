# Project Niferche - データセット改善提案

現在のProject Nifercheのデータモデルと実装済みのモックデータを分析し、より効率的で拡張性の高いデータ構造と改善策を提案します。

## 1. コンテンツモデルの拡張

現在のContentモデルは基本的な構造を持っていますが、より豊かなメタデータとリレーションシップをサポートするように拡張できます。

### 改善点

```typescript
// 強化されたContentモデル
interface EnhancedContent {
  // 既存フィールド（id, title, descriptionなど）

  // 新規/改善フィールド
  contentPath: string;                // コンテンツへの一意のパス (URLフレンドリー)
  language: string;                   // コンテンツの言語 (国際化対応)
  readingTime: number;                // 推定読了時間（分）
  difficulty: 'beginner' | 'intermediate' | 'advanced'; // コンテンツの難易度
  relatedContentIds: string[];        // 関連コンテンツID (強化されたリレーション)
  prerequisites: string[];            // 前提となるコンテンツID
  sequels: string[];                  // 続編コンテンツID
  versions: ContentVersion[];         // コンテンツのバージョン履歴
  popularity: number;                 // 閲覧数や人気度
  contributorIds: string[];           // 複数の貢献者
  rights: 'standard' | 'restricted' | 'open'; // 利用権限
  searchVector?: string;              // 全文検索最適化用ベクトル
  structuredData?: Record<string, any>; // JSONスキーマ対応の構造化データ
}

// バージョン管理
interface ContentVersion {
  version: string;
  updatedAt: string;
  changes: string;
  editorId: string;
}
```

### 利点

- **コンテンツ間の関係性の強化**: 前提条件、関連コンテンツ、続編など、コンテンツ間の関係性をより明確に定義
- **多言語サポート**: 将来的な国際化拡張の基盤
- **バージョン管理**: コンテンツの更新履歴を追跡し、変更の透明性を確保
- **検索最適化**: 検索エンジンや内部検索機能の効率化をサポート
- **メタデータの充実**: 読了時間や難易度などのメタデータによるユーザーエクスペリエンスの向上

## 2. ユーザープログレッションシステム

ユーザーの進行状況とエンゲージメントをよりきめ細かく追跡するシステム。

### 改善点

```typescript
// ユーザープログレッションモデル
interface UserProgression {
  userId: string;
  contentProgression: ContentProgress[];
  worldExploration: WorldExploration[];
  achievements: UserAchievement[];
  readingStats: ReadingStats;
  contributionStats: ContributionStats;
  lastActivity: string; // ISO日付
}

// コンテンツ進行状況
interface ContentProgress {
  contentId: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'revisited';
  progressPercentage: number; // 0-100
  lastPosition?: string; // 最後の閲覧位置（ブックマーク）
  startedAt?: string;
  completedAt?: string;
  notes?: string[]; // ユーザーのメモ
}

// 世界探索状況
interface WorldExploration {
  worldType: WorldType;
  discoveredLocations: string[];
  explorationPercentage: number;
  unlockedSecrets: string[];
}

// ユーザー実績
interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
  displayOnProfile: boolean;
}

// 読書統計
interface ReadingStats {
  totalContentViewed: number;
  totalReadingTimeMinutes: number;
  readingStreakDays: number;
  favoriteWorldType: WorldType;
  favoriteContentTypes: ContentType[];
}

// 貢献統計
interface ContributionStats {
  totalContributions: number;
  contributionsByType: Record<string, number>;
  contributionsByWorld: Record<WorldType, number>;
  influenceScore: number; // 他ユーザーへの影響度
}
```

### 利点

- **詳細な進行管理**: コンテンツごとの進行状況を詳細に追跡
- **カスタマイズされた推奨**: ユーザーの好みや行動パターンに基づいた推奨が可能
- **ゲーミフィケーション**: 実績やストリークなどのゲーミフィケーション要素の強化
- **パーソナライズされた体験**: ユーザーの行動履歴に基づいたUI/UX調整
- **コミュニティ貢献の可視化**: ユーザーの貢献度を可視化し、コミュニティ参加を促進

## 3. 拡張タグ・カテゴリシステム

より柔軟で階層的なタグとカテゴリシステム。

### 改善点

```typescript
// タグシステム
interface TagSystem {
  tags: Tag[];
  categories: Category[];
  tagRelationships: TagRelationship[];
}

// タグ
interface Tag {
  id: string;
  name: string;
  slug: string; // URL用正規化名
  description?: string;
  usage: number; // 使用回数
  createdAt: string;
  categoryIds: string[]; // 複数カテゴリに所属可能
  attributes?: Record<string, any>; // カスタム属性
}

// カテゴリ
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string; // 階層構造
  color?: string; // 視覚的な識別
  icon?: string; // カテゴリアイコン
  order: number; // 表示順序
}

// タグ間の関係性
interface TagRelationship {
  sourceTagId: string;
  targetTagId: string;
  relationshipType: 'parent' | 'synonym' | 'related' | 'opposite';
  strength: number; // 関係の強さ (0-1)
}
```

### 利点

- **階層的カテゴリ**: より整理された分類システム
- **関連タグの自動提案**: タグ関係に基づく関連コンテンツの推奨
- **セマンティックタギング**: タグ間の意味的関係性の定義
- **検索最適化**: より精度の高い検索結果
- **視覚的ナビゲーション**: カラーコードやアイコンを使用した視覚的ナビゲーション

## 4. インタラクティブ世界データモデル

世界内の場所、キャラクター、アイテムなどを関連付ける統合データモデル。

### 改善点

```typescript
// 世界データモデル
interface WorldData {
  worldType: WorldType;
  locations: Location[];
  characters: Character[];
  items: Item[];
  events: Event[];
  concepts: Concept[];
  timeline: TimelineEntry[];
}

// 場所
interface Location {
  id: string;
  name: string;
  description: string;
  coordinates?: { x: number; y: number }; // マップ上の座標
  parentLocationId?: string; // 階層構造 (例: 国 > 都市 > 建物)
  image?: string;
  associatedContentIds: string[]; // この場所に関連するコンテンツ
  characters: string[]; // この場所に関連するキャラクター
  items: string[]; // この場所に関連するアイテム
  events: string[]; // この場所で起きたイベント
  accessRequirements?: string[]; // アクセス条件（特定コンテンツの閲覧など）
}

// キャラクター
interface Character {
  id: string;
  name: string;
  description: string;
  image?: string;
  traits: string[]; // 特性
  relationships: CharacterRelationship[]; // 他キャラクターとの関係
  appearances: string[]; // 登場するコンテンツID
  locationIds: string[]; // 関連する場所
  primaryWorldType: WorldType; // 主な世界
  biography: string; // 詳細な経歴
  quotes: string[]; // 名言
}

// アイテム
interface Item {
  id: string;
  name: string;
  description: string;
  image?: string;
  type: string; // アイテムタイプ
  properties: Record<string, any>; // 特性
  locationIds: string[]; // 関連する場所
  associatedCharacters: string[]; // 関連するキャラクター
  appearances: string[]; // 登場するコンテンツ
}

// イベント
interface Event {
  id: string;
  name: string;
  description: string;
  date: string; // 世界内の日付
  locationIds: string[]; // 発生場所
  participantCharacterIds: string[]; // 参加キャラクター
  relatedEventIds: string[]; // 関連イベント
  consequences: string[]; // 結果
  contentIds: string[]; // このイベントが描かれるコンテンツ
}

// タイムライン
interface TimelineEntry {
  date: string; // 世界内の日付
  title: string;
  description: string;
  eventIds: string[]; // 関連イベント
  importance: number; // 重要度 (1-5)
}
```

### 利点

- **世界の一貫性**: 場所、キャラクター、イベントなどの一貫した関連付け
- **インタラクティブマップとの連携**: 場所データを利用したインタラクティブマップの実現
- **クロスリファレンス**: コンテンツ、キャラクター、イベント間の相互参照
- **ストーリーナビゲーション**: タイムラインを通じた時系列閲覧
- **世界観の深み**: 詳細な関連データによって世界観の深みを表現

## 5. コラボレーションとバージョン管理の統合

LCB機能のためのコラボレーションデータモデル。

### 改善点

```typescript
// コラボレーションプロジェクト
interface CollaborationProject {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: string;
  creatorId: string;
  collaboratorIds: string[];
  contentId?: string; // 最終コンテンツID (完了時)
  layers: ContentLayer[];
  branches: ContentBranch[];
  discussions: LayerDiscussion[];
  votes: LayerVote[];
  settings: ProjectSettings;
  timeline: ProjectTimelineEntry[];
}

// コンテンツレイヤー
interface ContentLayer {
  id: string;
  order: number;
  type: 'text' | 'image' | 'concept' | 'structure';
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'proposed' | 'accepted' | 'rejected';
  parentLayerId?: string;
  voteScore: number; // 投票集計
  branchIds: string[]; // 代替案のブランチID
  commentIds: string[]; // コメントID
  version: number;
  changelog?: string;
}

// コンテンツブランチ (代替提案)
interface ContentBranch {
  id: string;
  originalLayerId: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'proposed' | 'accepted' | 'rejected';
  voteScore: number;
  commentIds: string[];
}

// レイヤーディスカッション
interface LayerDiscussion {
  id: string;
  layerId: string;
  comments: LayerComment[];
  status: 'active' | 'resolved' | 'archived';
}

// レイヤーコメント
interface LayerComment {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  replyTo?: string; // 返信先コメントID
  status: 'active' | 'edited' | 'deleted';
  reactions: Record<string, string[]>; // リアクションタイプ: ユーザーID配列
}

// レイヤー投票
interface LayerVote {
  id: string;
  layerId: string;
  userId: string;
  voteType: 'up' | 'down' | 'neutral';
  timestamp: string;
  comment?: string;
}

// プロジェクト設定
interface ProjectSettings {
  votingSystem: 'majority' | 'consensus' | 'weighted';
  privacyLevel: 'public' | 'collaborators_only' | 'invite_only';
  autoResolveThreshold: number; // 自動解決するための賛成票の閾値
  reviewPeriodDays: number; // レビュー期間
  allowBranching: boolean;
  allowedWorldTypes: WorldType[];
}
```

### 利点

- **構造化コラボレーション**: レイヤー、ブランチによる明確な構造
- **透明性の向上**: 変更履歴と貢献の可視化
- **投票と合意形成**: 明確な意思決定プロセス
- **柔軟な設定**: プロジェクトごとにカスタマイズ可能なルール
- **ディスカッションの統合**: コメントや議論の整理

## 6. 検索と推奨システムの強化

検索と推奨のためのデータ構造。

### 改善点

```typescript
// 検索インデックス
interface SearchIndex {
  contentIndices: Record<string, SearchIndexEntry>;
  tagIndices: Record<string, string[]>;
  characterIndices: Record<string, string[]>;
  locationIndices: Record<string, string[]>;
  fullTextIndex: any; // 全文検索エンジン固有の構造
}

// 検索インデックスエントリ
interface SearchIndexEntry {
  contentId: string;
  title: string;
  description: string;
  keywords: string[];
  contentType: string;
  worldType: WorldType;
  popularity: number;
  relevanceScores: Record<string, number>; // キーワード: 関連度スコア
  lastUpdated: string;
}

// レコメンデーションエンジン
interface RecommendationEngine {
  similarityMatrix: Record<string, Record<string, number>>; // コンテンツID x コンテンツID: 類似度スコア
  userPreferenceMatrix: Record<string, Record<string, number>>; // ユーザーID x コンテンツID: 好み度スコア
  contentFeatureVectors: Record<string, number[]>; // コンテンツID: 特徴ベクトル
  userFeatureVectors: Record<string, number[]>; // ユーザーID: 特徴ベクトル
  popularityRankings: Record<string, number>; // コンテンツID: 人気度
  noveltyFactors: Record<string, number>; // コンテンツID: 新規性
}
```

### 利点

- **高速検索**: 最適化されたインデックスによる高速検索
- **関連コンテンツ提案**: 類似度に基づく関連コンテンツの提案
- **パーソナライズされた推奨**: ユーザーの好みに基づくコンテンツ推奨
- **発見可能性の向上**: 新しいコンテンツとの出会いを促進
- **検索結果の関連性向上**: より正確で関連性の高い検索結果

## 7. 実装戦略とデータ移行

既存のモックデータから拡張データモデルへの移行戦略。

### 段階的実装計画

1. **基本モデル拡張**: 既存のContentモデルに新フィールドを追加
2. **リレーショナルデータの構築**: コンテンツ間の関係性データの構築
3. **メタデータの充実**: 読了時間や難易度などのメタデータの追加
4. **世界データの統合**: 場所、キャラクター、アイテムなどの関連データの構築
5. **検索・推奨システムの実装**: 拡張されたデータに基づく検索と推奨機能の構築

### 移行戦略

- **モデル互換性の維持**: 古いモデル構造も引き続きサポート
- **段階的データ拡充**: 最も価値の高いメタデータから順次追加
- **自動データ生成**: AI支援による初期メタデータの自動生成
- **コミュニティ貢献**: 一部のメタデータ作成をコミュニティに開放

## 結論

提案したデータモデルの改善は、Project Nifercheの機能性と拡張性を大幅に向上させる可能性があります。既存のモデルを基盤としながら、より豊かなメタデータと関係性の定義、ユーザー体験の向上、コラボレーション機能の強化を実現します。

段階的に実装することで、開発リソースを効率的に活用しながら、ユーザーに新機能と改善された体験を継続的に提供することができます。