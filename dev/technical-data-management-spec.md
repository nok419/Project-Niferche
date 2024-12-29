# Project Niferche データ管理システム技術仕様書
``` meta
作成日:2024.11.20
作成者:サレジア（私/サイト管理者）
文書レベル:0（文書レベル0は私が使用する全ての文書管理システムにおいて実装されていません。本レベルは「あらゆる文書より分析優先度が高く、整合性チェックにおいて最も信頼性が高い情報を示す文書」であることを意味する例外的なレベルです。
文書タイプ:extra（文書タイプextraは私が使用する全ての文書管理システムにおいて実装されていません。本タイプは「本文書はextra以外のタイプを持つ他のあらゆる文書を参照せず、独立して分析される」「本文書は文書管理システムが規定するあらゆる規則の影響を受けない」ことを示す例外的なタイプです。
```

## 1. システム概要

### 1.1 アーキテクチャ構成
```
[フロントエンド (React)] 
         ↓ 
[AWS Amplify Gen2]
         ↓
[DynamoDB] ← → [Amazon S3] ← → [Amazon Cognito]
```

### 1.2 主要コンポーネント
1. データストア (DynamoDB)
   - コンテンツメタデータ
   - ユーザー情報
   - 関係性データ
   - コメントデータ

2. ファイルストレージ (S3)
   - コンテンツファイル
   - 添付ファイル
   - 画像/音声/動画

3. 認証/認可 (Cognito)
   - ユーザー認証
   - アクセス制御
   - グループ管理

## 2. データモデル詳細仕様

### 2.1 Content Model
```typescript
interface Content {
  // 基本情報 (必須)
  id: string;                    // UUID
  title: string;                 // タイトル（1-100文字）
  description: string;          // 説明（1-1000文字）

  // コンテンツタイプ (必須)
  contentTypes: {
    primary: string[];          // メインの表現形式
    supplementary?: string[];   // 補助的な表現形式
  };

  // 分類情報 (必須)
  category: {
    primary: ContentCategory;    // メインカテゴリ
    secondary?: string[];       // サブカテゴリ
    worldType?: WorldCategory;  // 所属世界
    attribution: Attribution;    // 帰属（official/shared）
  };

  // アクセス制御 (必須)
  access: {
    visibility: Visibility;     // 公開範囲
    ownerId: string;           // 作成者ID
    collaborators?: string[];  // 共同編集者ID配列
  };

  // メタデータ (必須)
  metadata: {
    createdAt: string;         // 作成日時 (ISO 8601)
    updatedAt: string;         // 更新日時 (ISO 8601)
    version: string;           // バージョン識別子
    tags: string[];           // 検索用タグ（0-20個）
    status: ContentStatus;    // コンテンツの状態
  };

  // 参照情報 (オプショナル)
  references?: {
    sourceRefs?: {             // 参照元設定
      contentId: string;
      relationType: ReferenceType;
    }[];
    characterRefs?: string[];  // 関連キャラクター
    itemRefs?: string[];      // 関連アイテム/概念
    relatedContent?: {        // その他の関連
      contentId: string;
      relationType: ReferenceType;
    }[];
  };

  // ストレージ情報 (必須)
  storage: {
    mainKey: string;          // メインコンテンツのS3キー
    thumbnailKey?: string;    // サムネイルのS3キー
    attachments?: string[];   // 添付ファイルのS3キー配列
  };
}

// 列挙型定義
enum ContentCategory {
  MAIN_STORY = "MAIN_STORY",
  SIDE_STORY = "SIDE_STORY",
  SETTING_MATERIAL = "SETTING_MATERIAL",
  CHARACTER = "CHARACTER",
  ORGANIZATION = "ORGANIZATION",
  THEORY = "THEORY",
  MERCHANDISE = "MERCHANDISE",
  SITE_INFO = "SITE_INFO"
}

enum WorldCategory {
  COMMON = "COMMON",
  QUXE = "QUXE",
  HODEMEI = "HODEMEI",
  ALSAREJIA = "ALSAREJIA"
}

enum Attribution {
  OFFICIAL = "OFFICIAL",
  SHARED = "SHARED"
}

enum Visibility {
  PUBLIC = "PUBLIC",
  AUTHENTICATED = "AUTHENTICATED",
  PRIVATE = "PRIVATE"
}

enum ContentStatus {
  DRAFT = "DRAFT",
  REVIEW = "REVIEW",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED"
}

enum ReferenceType {
  BASED_ON = "BASED_ON",
  INSPIRED_BY = "INSPIRED_BY",
  EXTENDS = "EXTENDS",
  RELATED = "RELATED"
}
```

### 2.2 DynamoDBインデックス設計
```
Content Table:
- Primary Key: id (String)
- GSI1: gsi1pk (category#worldType) / gsi1sk (createdAt)
- GSI2: gsi2pk (ownerId) / gsi2sk (updatedAt)
- GSI3: gsi3pk (status) / gsi3sk (attribution)

Access Patterns:
1. カテゴリ×世界別の取得 (GSI1)
2. ユーザー別の取得 (GSI2)
3. ステータス×帰属の取得 (GSI3)
```

## 3. ストレージ構造詳細仕様

### 3.1 S3ディレクトリ構造
```
niferche-content/
├── official/                          # 公式コンテンツ
│   ├── laboratory/                    # Laboratory関連
│   │   ├── main-story/               # メインストーリー
│   │   │   └── {contentId}/          # コンテンツごとのディレクトリ
│   │   │       ├── main/             # メインコンテンツ
│   │   │       ├── attachments/      # 添付ファイル
│   │   │       └── thumbnails/       # サムネイル
│   │   └── side-story/               # サイドストーリー
│   │       └── {contentId}/          
│   └── materials/                     # 設定資料
│       ├── common/                    # 共通設定
│       │   └── {contentId}/
│       └── worlds/                    # 世界別設定
│           ├── quxe/
│           ├── hodemei/
│           └── alsarejia/
│
├── shared/                            # ユーザー共有コンテンツ
│   ├── laboratory/                    # Laboratory関連
│   │   └── side-story/               # サイドストーリー
│   │       └── {contentId}/
│   └── materials/                     # 設定資料
│       ├── common/                    # 共通設定
│       │   └── {contentId}/
│       └── worlds/                    # 世界別設定
│           ├── quxe/
│           ├── hodemei/
│           └── alsarejia/
│
├── temp/                              # 一時ファイル
│   └── uploads/                       # アップロード中
│
└── system/                            # システムファイル
    ├── backups/                       # バックアップ
    └── logs/                          # ログファイル
```

### 3.2 ファイル命名規則
```
{timestamp}-{uuid}.{extension}
例: 1701234567-a1b2c3d4.jpg

バージョン管理:
{base}-v{version}.{extension}
例: 1701234567-a1b2c3d4-v2.jpg

サムネイル:
{base}-thumb.{extension}
例: 1701234567-a1b2c3d4-thumb.jpg
```

## 4. アクセス制御仕様

### 4.1 認証レベル
```typescript
interface AccessControl {
  PUBLIC: {
    read: true,
    write: false
  },
  AUTHENTICATED: {
    read: true,
    write: conditions.isOwner || conditions.isCollaborator
  },
  PRIVATE: {
    read: conditions.isOwner || conditions.isAdmin,
    write: conditions.isOwner || conditions.isAdmin
  }
}
```

### 4.2 S3バケットポリシー
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::niferche-content/official/*",
      "Condition": {
        "StringEquals": {
          "s3:ResourceType": "object"
        }
      }
    },
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "${cognito-identity-pool-role}"
      },
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::niferche-content/shared/${cognito:sub}/*"
    }
  ]
}
```

## 5. データ操作仕様

### 5.1 コンテンツ作成フロー
```typescript
async function createContent(data: ContentInput): Promise<Content> {
  // 1. バリデーション
  validateContentInput(data);

  // 2. ファイルアップロード
  const fileKeys = await uploadFiles(data.files);

  // 3. メタデータ作成
  const metadata = generateMetadata(data, fileKeys);

  // 4. DynamoDB保存
  const content = await saveContent(metadata);

  return content;
}
```

### 5.2 クエリパターン
```typescript
// カテゴリ別取得
const getByCategory = async (category: ContentCategory) => {
  return await DataStore.query(Content, c => 
    c.primaryCategory.eq(category)
  );
};

// 世界別取得
const getByWorld = async (world: WorldCategory) => {
  return await DataStore.query(Content, c => 
    c.worldType.eq(world)
  );
};

// キーワード検索
const searchContent = async (keyword: string) => {
  return await DataStore.query(Content, c => 
    c.or(c => [
      c.title.contains(keyword),
      c.description.contains(keyword),
      c.tags.contains(keyword)
    ])
  );
};
```

## 6. バックアップと復旧

### 6.1 バックアップ戦略
1. DynamoDB
   - ポイントインタイムリカバリ (PITR) 有効
   - 日次バックアップ
   - 保持期間: 30日

2. S3
   - バージョニング有効
   - ライフサイクルルール設定
   - クロスリージョンレプリケーション

### 6.2 復旧手順
1. データ復旧
   - DynamoDBのPITR使用
   - S3バージョニングから復元

2. 整合性チェック
   - メタデータとファイルの整合性確認
   - 参照関係の検証

## 7. 監視と運用

### 7.1 監視項目
1. メトリクス
   - DynamoDBの読み書きキャパシティ
   - S3のストレージ使用量
   - APIレイテンシー

2. アラート
   - エラー率閾値
   - レイテンシー閾値
   - ストレージ使用量閾値

### 7.2 運用タスク
1. 定期メンテナンス
   - 未使用リソースのクリーンアップ
   - インデックスの最適化
   - パフォーマンスチューニング

2. セキュリティ
   - アクセスログの監査
   - 権限の定期レビュー
   - セキュリティパッチの適用

## 8. 拡張性と制限事項

### 8.1 スケーリング制限
1. DynamoDB
   - 項目サイズ: 最大400KB
   - パーティションキーあたりの制限: 10GB

2. S3
   - ファイルサイズ: 最大5TB
   - バケットあたりのオブジェクト数: 無制限

### 8.2 将来の拡張性
1. データモデル
   - 新しいコンテンツタイプの追加
   - メタデータフィールドの拡張
   - 関係性の拡張

2. ストレージ
   - CDNの導入
   - マルチリージョン展開
   - キャッシュ層の追加