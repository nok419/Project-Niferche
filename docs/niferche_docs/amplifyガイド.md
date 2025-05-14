# AWS Amplify Gen2 最新実装ガイド 2024

最新のAWS Amplify Gen2は、TypeScriptを中心とした「コードファースト」アプローチを採用しており、従来のCLI/コンソールベースの手法から大きく進化しました。このガイドでは、2024年以降の最新情報とベストプラクティスに焦点を当て、特にTypeScriptとの統合における型安全性の確保方法を詳しく解説します。

## 認証(Cognito)実装パターン

### defineAuthの最新構文

Amplify Gen2では、認証の設定は`defineAuth`関数を使用して行います。TypeScriptの型チェックを活用した簡潔な構文が特徴です。

```typescript
// amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  // 基本的なログイン方法の設定
  loginWith: {
    email: true,
    // phone: true, // 電話番号での認証も可能
    // username: true, // ユーザー名での認証も可能
    
    // ソーシャルプロバイダー連携
    externalProviders: {
      google: {
        clientId: "your-google-client-id",
        clientSecret: "your-google-client-secret",
      },
      // facebook, amazonなども同様に設定可能
    },
  },
  
  // ユーザー属性の設定
  userAttributes: {
    givenName: {
      required: true,
      mutable: true,
    },
    // カスタム属性
    custom: {
      tenantId: {
        type: "string",
      },
      userRole: {
        type: "string",
        mutable: true,
      },
    },
  },
  
  // 多要素認証(MFA)の設定
  multifactor: {
    mode: "OPTIONAL", // "OPTIONAL", "REQUIRED", "OFF"のいずれか
    sms: {
      enabled: true,
    },
    totp: {
      enabled: true,
    },
  },
  
  // ユーザーグループの定義
  groups: ["Admins", "Editors", "Viewers"],
});
```

### グループベースの権限管理

Amplify Gen2では、ユーザーグループに基づいた権限管理が強化されました。ユーザーグループは`auth`リソースで定義し、さまざまなリソースへのアクセス制御に使用できます。

```typescript
// amplify/auth/resource.ts
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: { 
    email: true 
  },
  // ユーザーグループの定義
  groups: ["Admins", "Editors", "Viewers"],
});
```

データモデルへのグループベースのアクセス制御:

```typescript
// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // 静的なグループベース権限を持つモデル
  Post: a.model({
    title: a.string().required(),
    content: a.string(),
    published: a.boolean().default(false),
  })
  .authorization(allow => [
    // Adminグループは全権限を持つ
    allow.groups(["Admins"]).to(["create", "read", "update", "delete"]),
    // Editorsは作成、読取、更新が可能だが削除は不可
    allow.groups(["Editors"]).to(["create", "read", "update"]),
    // Viewersは読取のみ
    allow.groups(["Viewers"]).to(["read"]),
    // 公開されている投稿のみ一般公開
    allow.public().to(["read"]).when(item => item.published),
  ]),
});

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
```

ストレージへのグループベースのアクセス制御:

```typescript
// amplify/storage/resource.ts
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "myAppStorage",
  access: (allow) => ({
    // ファイルディレクトリに対するグループ権限
    "files/*": [
      allow.groups(["Admins"]).to(["read", "write", "delete"]),
    ],
    // コンテンツディレクトリに対する権限
    "content/*": [
      allow.groups(["Editors"]).to(["read", "write"]),
      allow.groups(["Viewers"]).to(["read"]),
    ],
  }),
});
```

### TypeScript型定義の適切な使い方

Amplify Gen2では、型安全な認証操作を実現するためのTypeScript統合が強化されています。

```typescript
// src/hooks/useAuth.ts
import { signIn, confirmSignIn, signUp, fetchAuthSession } from "aws-amplify/auth";
import { useState } from "react";

// 型安全なサインイン関数
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 型安全なサインイン実装
  async function handleSignIn(username: string, password: string) {
    setLoading(true);
    setError(null);
    
    try {
      const { isSignedIn, nextStep } = await signIn({
        username,
        password,
      });

      if (!isSignedIn) {
        // MFAなどの追加ステップの処理
        if (nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_SMS_CODE") {
          return { success: false, step: "SMS_CODE_REQUIRED" };
        }
      }
      
      return { success: true };
    } catch (error) {
      // 型付きエラーハンドリング
      if (error.name === "NotAuthorizedException") {
        setError("ユーザー名またはパスワードが正しくありません");
      } else {
        setError(`ログイン中にエラーが発生しました: ${error.message}`);
      }
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }

  // ユーザーのグループ所属確認（型安全）
  async function isUserInGroup(groupName: string): Promise<boolean> {
    try {
      const session = await fetchAuthSession();
      const groups = session.tokens?.accessToken.payload["cognito:groups"] || [];
      return groups.includes(groupName);
    } catch (error) {
      console.error("グループチェック中にエラーが発生しました:", error);
      return false;
    }
  }
  
  return {
    handleSignIn,
    isUserInGroup,
    loading,
    error
  };
}
```

## ストレージ(S3)実装パターン

### defineStorageの設定方法

Amplify Gen2のストレージは、`defineStorage`関数を使用して設定します。

```typescript
// amplify/storage/resource.ts
import { defineStorage } from '@aws-amplify/backend';

// 基本的なストレージの定義
export const storage = defineStorage({
  name: 'myAppStorage' // バケットを識別するフレンドリー名
});
```

複数のストレージバケットを設定する場合:

```typescript
// amplify/storage/resource.ts
import { defineStorage } from '@aws-amplify/backend';

// メインストレージをデフォルトとして設定
export const mainStorage = defineStorage({
  name: 'mainStorage',
  isDefault: true
});

// アーカイブ用の別ストレージを設定
export const archiveStorage = defineStorage({
  name: 'archiveStorage'
});

// バックエンド定義に追加
// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { mainStorage, archiveStorage } from './storage/resource';

defineBackend({
  auth,
  mainStorage,
  archiveStorage
});
```

### アクセス制御の実装

Amplify Gen2のストレージは、デフォルトでは「拒否」ポリシーを採用しています。アクセス許可は明示的に設定する必要があります。

```typescript
// amplify/storage/resource.ts
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'myAppStorage',
  access: (allow) => ({
    // メディアファイルへのアクセス制御
    'media/*': [
      allow.guest.to(['read']),                       // 非認証ユーザーも読取可能
      allow.authenticated.to(['read', 'write']),      // 認証ユーザーは読取と書込可能
      allow.groups(['admin']).to(['read', 'write', 'delete']) // 管理者グループはフル権限
    ],
    // プライベートファイルへのアクセス制御
    'private/*': [
      allow.authenticated.to(['read', 'write', 'delete']) // 認証ユーザーのみアクセス可能
    ],
    // ユーザー固有ディレクトリへのアクセス制御
    'users/{entity_id}/*': [
      // オーナーはフル権限を持つ
      allow.entity('identity').to(['read', 'write', 'delete']),
      // 管理者はすべてのユーザーディレクトリにアクセス可能
      allow.groups(['admin']).to(['read', 'write', 'delete'])
    ]
  })
});
```

### ファイルアップロード/ダウンロードの型安全な実装

Amplify Gen2では、`aws-amplify/storage`パッケージを通じて型安全なファイル操作が可能です。

ファイルアップロードの型安全な実装:

```typescript
import { uploadData } from 'aws-amplify/storage';
import { type UploadDataOutput } from 'aws-amplify/storage';

async function uploadFile(file: File, path: string): Promise<UploadDataOutput> {
  try {
    // 型安全なアップロード操作
    const uploadResult = await uploadData({
      path: path,
      data: file,
      options: {
        contentType: file.type,
        metadata: {
          uploadedBy: 'user123',
          category: 'documents'
        },
        onProgress: ({ transferredBytes, totalBytes }) => {
          if (totalBytes) {
            const percentCompleted = Math.round((transferredBytes / totalBytes) * 100);
            console.log(`アップロード進捗: ${percentCompleted}%`);
          }
        }
      }
    }).result;
    
    return uploadResult;
  } catch (error) {
    console.error('ファイルアップロードエラー:', error);
    throw error;
  }
}
```

ファイルダウンロードの型安全な実装:

```typescript
import { downloadData, getUrl } from 'aws-amplify/storage';
import { type DownloadDataOutput, type GetUrlOutput } from 'aws-amplify/storage';

// ファイルを直接メモリにダウンロード
async function downloadFile(path: string): Promise<DownloadDataOutput> {
  try {
    // 型安全なダウンロード操作
    const downloadResult = await downloadData({
      path: path
    }).result;
    
    return downloadResult;
  } catch (error) {
    console.error('ファイルダウンロードエラー:', error);
    throw error;
  }
}

// ダウンロード用の署名付きURLを取得
async function getDownloadUrl(path: string): Promise<GetUrlOutput> {
  try {
    // 型安全なURL取得操作
    const urlResult = await getUrl({
      path: path,
      options: {
        expiresIn: 3600, // URL有効期限（1時間）
        validateObjectExistence: true // URL生成前にファイル存在確認
      }
    });
    
    return urlResult;
  } catch (error) {
    console.error('ダウンロードURL生成エラー:', error);
    throw error;
  }
}
```

完全な型安全な画像アップロードとプレビュー実装例:

```typescript
import React, { useState } from 'react';
import { uploadData, getUrl } from 'aws-amplify/storage';
import { type UploadDataOutput, type GetUrlOutput } from 'aws-amplify/storage';

interface ImageData {
  id: string;
  path: string;
  url: string;
}

const ImageUploader: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // ユニークなファイルパスを生成
      const userId = 'current-user-id'; // 認証コンテキストから取得
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `uploads/${userId}/${fileName}`;
      
      // 型安全なファイルアップロード
      const uploadResult: UploadDataOutput = await uploadData({
        path: filePath,
        data: file,
        options: {
          contentType: file.type,
          onProgress: ({ transferredBytes, totalBytes }) => {
            if (totalBytes) {
              const progress = Math.round((transferredBytes / totalBytes) * 100);
              console.log(`アップロード進捗: ${progress}%`);
            }
          }
        }
      }).result;
      
      // アップロードしたファイルのURLを取得
      const urlResult: GetUrlOutput = await getUrl({
        path: filePath
      });
      
      // 状態に追加
      setImages(prev => [...prev, {
        id: Date.now().toString(),
        path: filePath,
        url: urlResult.url.toString()
      }]);
      
    } catch (error) {
      console.error('画像アップロードエラー:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      
      {isUploading && <p>アップロード中...</p>}
      
      <div className="image-gallery">
        {images.map(image => (
          <div key={image.id} className="image-item">
            <img src={image.url} alt="アップロードコンテンツ" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
```

## データモデリング(GraphQL/DynamoDB)

### defineDataの最新構文

Amplify Gen2のデータモデリングは、TypeScriptベースの構文を使用してGraphQL APIとDynamoDBテーブルを定義します。

```typescript
// amplify/data/resource.ts
import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

// スキーマ定義
const schema = a.schema({
  // Todoモデルの定義
  Todo: a.model({
    content: a.string().required(),
    isDone: a.boolean().default(false),
    priority: a.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  }),
});

// クライアント用のスキーマ型をエクスポート
export type Schema = ClientSchema<typeof schema>;

// データリソースの定義
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
```

利用可能なフィールドタイプ:

```typescript
const schema = a.schema({
  Product: a.model({
    // 基本的な型
    name: a.string().required(),
    description: a.string(),
    price: a.float().required(),
    quantity: a.integer().default(0),
    isAvailable: a.boolean().default(true),
    
    // 日付と時間
    releaseDate: a.date(),
    createdAt: a.datetime(),
    
    // 複合型
    tags: a.string().array(),
    metadata: a.json(),
    
    // 列挙型
    category: a.enum(['ELECTRONICS', 'BOOKS', 'CLOTHING']),
    
    // カスタム型（インライン）
    location: a.object({
      address: a.string(),
      city: a.string(),
      country: a.string(),
      zipCode: a.string(),
    }),
  }),
  
  // カスタム型（別途定義）
  Address: a.customType({
    street: a.string(),
    city: a.string(),
    state: a.string(),
    zipCode: a.string(),
  }),
});
```

カスタムプライマリキー:

```typescript
const schema = a.schema({
  User: a.model({
    email: a.string().required(),
    username: a.string().required(),
  }).identifier(['email']), // emailをプライマリキーとして使用
  
  // 複合プライマリキー
  BookEdition: a.model({
    isbn: a.string().required(),
    edition: a.integer().required(),
    title: a.string().required(),
  }).identifier(['isbn', 'edition']), // isbnとeditionの複合キー
});
```

セカンダリインデックス:

```typescript
const schema = a.schema({
  Order: a.model({
    id: a.id().required(),
    customerId: a.string().required(),
    orderDate: a.datetime().required(),
    status: a.string().required(),
  })
  .secondaryIndex('byCustomer', ['customerId', 'orderDate']) // 顧客でのクエリ用インデックス
  .secondaryIndex('byStatus', ['status', 'orderDate']), // ステータスでのクエリ用インデックス
});
```

### リレーションシップの定義方法

Amplify Gen2では、一対一、一対多、多対多のリレーションシップがサポートされています。

**1対1のリレーションシップ**:

```typescript
const schema = a.schema({
  Customer: a.model({
    name: a.string().required(),
    email: a.string().required(),
    // Cartへのリレーションシップフィールド
    activeCart: a.hasOne('Cart', 'customerId'),
  }),
  
  Cart: a.model({
    // Customerへの参照フィールド
    customerId: a.id().required(),
    // Customerへのリレーションシップフィールド
    customer: a.belongsTo('Customer', 'customerId'),
    cartItems: a.integer().default(0),
    totalAmount: a.float().default(0),
  }),
});
```

**1対多のリレーションシップ**:

```typescript
const schema = a.schema({
  Team: a.model({
    name: a.string().required(),
    description: a.string(),
    // Memberへのリレーションシップフィールド（1対多）
    members: a.hasMany('Member', 'teamId'),
  }),
  
  Member: a.model({
    name: a.string().required(),
    email: a.string(),
    // Teamへの参照フィールド
    teamId: a.id().required(),
    // Teamへのリレーションシップフィールド
    team: a.belongsTo('Team', 'teamId'),
  }),
});
```

**多対多のリレーションシップ**:

```typescript
const schema = a.schema({
  Post: a.model({
    title: a.string().required(),
    content: a.string(),
    // PostTagジョインモデルへのリレーションシップフィールド
    tags: a.hasMany('PostTag', 'postId'),
  }),
  
  Tag: a.model({
    name: a.string().required(),
    // PostTagジョインモデルへのリレーションシップフィールド
    posts: a.hasMany('PostTag', 'tagId'),
  }),
  
  // 多対多リレーションシップ用のジョインモデル
  PostTag: a.model({
    // PostとTagへの参照フィールド
    postId: a.id().required(),
    tagId: a.id().required(),
    // リレーションシップフィールド定義
    post: a.belongsTo('Post', 'postId'),
    tag: a.belongsTo('Tag', 'tagId'),
  })
  .identifier(['postId', 'tagId']), // 複合キー
});
```

### 権限ルールの書き方

Amplify Gen2では、データアクセスに対する柔軟な認可ルールを提供しています。認可システムはデフォルトで「拒否」の原則に従い、明示的に許可されない限りアクセスは拒否されます。

**スキーマレベルでの認可**:

```typescript
const schema = a.schema({
  Todo: a.model({
    content: a.string().required(),
    isDone: a.boolean().default(false),
  }),
  
  Note: a.model({
    title: a.string().required(),
    content: a.string(),
  }),
})
.authorization(allow => [
  // パブリック読み取りアクセスを許可、認証されたユーザーはすべての操作可能
  allow.public().to(['read']),
  allow.authenticated().to(['create', 'read', 'update', 'delete']),
]);
```

**モデルレベルでの認可**:

```typescript
const schema = a.schema({
  // パブリックTodoリスト - 誰でも読み取り可能、認証ユーザーのみ作成/更新/削除可能
  PublicTodo: a.model({
    content: a.string().required(),
    isDone: a.boolean().default(false),
  })
  .authorization(allow => [
    allow.public().to(['read']),
    allow.authenticated().to(['create', 'read', 'update', 'delete']),
  ]),
  
  // プライベートノート - 認証ユーザーのみアクセス可能
  PrivateNote: a.model({
    title: a.string().required(),
    content: a.string(),
  })
  .authorization(allow => [
    allow.authenticated().to(['create', 'read', 'update', 'delete']),
  ]),
});
```

**ユーザー単位（オーナー）認可**:

```typescript
const schema = a.schema({
  UserPost: a.model({
    title: a.string().required(),
    content: a.string(),
  })
  .authorization(allow => [
    // 作成者（オーナー）のみすべての操作可能
    allow.owner(),
    // 誰でも読み取り可能
    allow.public().to(['read']),
  ]),
});
```

**ユーザーグループ認可**:

```typescript
const schema = a.schema({
  Document: a.model({
    title: a.string().required(),
    content: a.string(),
    status: a.string(),
  })
  .authorization(allow => [
    // adminグループメンバーはすべて操作可能
    allow.specificGroups(['admin']),
    // editorグループメンバーは読み取りと更新が可能
    allow.specificGroups(['editor']).to(['read', 'update']),
    // すべての認証ユーザーは読み取り可能
    allow.authenticated().to(['read']),
  ]),
});
```

**フィールドレベルの認可**:

```typescript
const schema = a.schema({
  User: a.model({
    username: a.string().required(),
    email: a.string().required(),
    // 誰でも読み取り可能なパブリックプロフィール情報
    profilePicture: a.string()
      .authorization(allow => [
        allow.public().to(['read']),
        allow.owner().to(['create', 'read', 'update']),
      ]),
    // オーナーのみアクセス可能なプライベートフィールド
    phoneNumber: a.string()
      .authorization(allow => [
        allow.owner(),
      ]),
    // 管理者専用フィールド
    accountStatus: a.string()
      .authorization(allow => [
        allow.specificGroups(['admin']),
        allow.owner().to(['read']),
      ]),
  })
  .authorization(allow => [
    // デフォルトのモデルレベル認可
    allow.public().to(['read']),
    allow.owner().to(['create', 'read', 'update']),
  ]),
});
```

## TypeScriptエラー解決策

### amplify_outputs.jsonの型定義

`amplify_outputs.json`ファイルは、バックエンドリソースへの接続情報を含むクライアント設定ファイルです。

ファイルの内容:
- AppSync GraphQL APIのエンドポイント
- 認証メタデータと設定
- ストレージバケットと権限
- 関数の設定
- 一般公開APIキー
- 追加したカスタム出力

TypeScriptで適切に型付けするには、以下の2つの方法があります:

**アプローチ1: 宣言ファイルを使用した直接モジュールインポート**

```typescript
// amplify_outputs.json.d.ts
declare module "*/amplify_outputs.json" {
  export interface AmplifyOutputs {
    version: string;
    auth?: {
      userPoolId?: string;
      userPoolClientId?: string;
      identityPoolId?: string;
      region?: string;
      requiredAttributes?: string[];
    };
    api?: {
      GraphQL?: {
        endpoint: string;
        region: string;
        defaultAuthMode?: string;
        apiKey?: string;
      };
    };
    storage?: {
      S3?: {
        bucket: string;
        region: string;
      };
    };
    [key: string]: any;
  }

  const outputs: AmplifyOutputs;
  export default outputs;
}
```

**アプローチ2: TypeScriptのJSONインポートと型アサーション**

```typescript
// main.ts または同様のエントリーファイル
import outputs from "./amplify_outputs.json" with { type: "json" };
import { Amplify } from "aws-amplify";

// 型アサーション
interface AmplifyOutputs {
  version: string;
  auth?: {
    // 上記で定義した認証プロパティ
  };
  // 必要に応じて追加のプロパティ
}

Amplify.configure(outputs as AmplifyOutputs);
```

### generateClient使用時の型安全性

`generateClient`関数は、データモデルとやり取りするための完全に型付けされたクライアントを提供します。

**基本パターン: スキーマ型のインポート**

```typescript
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

// 完全に型付けされたクライアントを生成
const client = generateClient<Schema>();

// 型安全なCRUD操作
async function createTodo(content: string) {
  return client.models.Todo.create({
    content,
    completed: false,
  });
}

async function listTodos() {
  const { data } = await client.models.Todo.list();
  return data; // Todo[]として完全に型付け
}
```

**Reactフックでの使用例**

```typescript
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

function TodoList() {
  // 型安全な状態
  const [todos, setTodos] = useState<Schema["Todo"]["type"][]>([]);
  const client = generateClient<Schema>();

  useEffect(() => {
    // 型安全なクエリ
    const fetchTodos = async () => {
      const { data } = await client.models.Todo.list();
      setTodos(data);
    };
    
    fetchTodos();
    
    // リアルタイムサブスクリプション（型安全）
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: ({ items }) => {
        setTodos([...items]);
      }
    });
    
    return () => subscription.unsubscribe();
  }, []);

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
  );
}
```

### 型エラーの一般的な対処法

#### 1. モジュールが見つからない: `amplify_outputs.json`

**エラー**: 
```
Error: Cannot find module '../amplify_outputs.json' or its corresponding type declarations.
```

**解決策**:

A. 宣言ファイルを作成:
```typescript
// amplify_outputs.json.d.ts
declare module "*amplify_outputs.json" {
  const value: any;
  export default value;
}
```

B. `tsconfig.json`を更新してJSONインポートを許可:
```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true
  }
}
```

C. ファイルを生成:
```bash
npx ampx sandbox
# または
npx ampx generate outputs --branch <branch> --app-id <app-id>
```

#### 2. デプロイ中のTypeScript検証エラー

**エラー**:
```
SyntaxError: TypeScript validation check failed.
Resolution: Fix the syntax and type errors in your backend definition.
```

**解決策**:

A. amplifyディレクトリにローカルの`tsconfig.json`を追加:
```json
// amplify/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "lib": ["es2018"],
    "declaration": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": false,
    "inlineSourceMap": true,
    "inlineSources": true,
    "experimentalDecorators": true,
    "strictPropertyInitialization": false,
    "typeRoots": ["./node_modules/@types"]
  },
  "exclude": ["node_modules", "cdk.out"]
}
```

B. 環境固有のTypeScriptエラーをチェック:
```bash
npx tsc --noEmit --project amplify/tsconfig.json
```

#### 3. 関数内の環境変数

**エラー**:
```
Cannot find module '$amplify/env/functionName' or its corresponding type declarations
```

**解決策**:

初回実行用の`// @ts-nocheck`ディレクティブを追加するか、宣言ファイルを作成:

```typescript
// amplify/functions/myFunction/handler.ts
// @ts-nocheck  // 初回サンドボックス実行用
import { env } from '$amplify/env/myFunction';

// または宣言ファイルを作成
// $amplify.d.ts
declare module '$amplify/env/*' {
  export const env: {
    [key: string]: string;
  };
}
```

## 開発フローとファイル構成

### srcフォルダの推奨構成

AWS Amplify Gen2では、フロントエンドコードをTypeScriptベースの構造で整理することが推奨されています。

```
src/
├── components/           # 再利用可能なUIコンポーネント
│   ├── auth/             # 認証関連コンポーネント
│   ├── data/             # データ表示とフォームコンポーネント
│   └── common/           # 共通UIエレメント
├── hooks/                # カスタムReactフック
│   ├── useAuth.ts        # 認証フック
│   ├── useData.ts        # データ取得/操作フック
│   └── useStorage.ts     # ストレージ関連フック
├── models/               # データモデルの型定義
├── pages/                # ページコンポーネント（ルーティング用）
├── utils/                # ヘルパー関数
├── App.[tsx|jsx]         # メインアプリケーションコンポーネント
├── index.[tsx|jsx]       # エントリポイント
└── main.[tsx|jsx]        # amplify_outputs.jsonをインポートする設定ファイル
```

### amplifyフォルダ必須ファイル一覧

Amplify Gen2のバックエンド設定は、amplifyフォルダに整理されています。

```
amplify/
├── backend.ts                   # メインバックエンド定義ファイル
├── package.json                 # バックエンド用の依存関係
├── tsconfig.json                # TypeScript設定
├── auth/                        # 認証設定
│   └── resource.ts              # Cognito設定を定義
├── data/                        # APIとデータベース設定
│   └── resource.ts              # データモデル、クエリ、ミューテーションを定義
├── storage/                     # ストレージ設定
│   └── resource.ts              # S3バケット設定とアクセスルールを定義
├── function/                    # Lambda関数
│   └── [function-name]/
│       ├── resource.ts          # 関数設定
│       └── index.ts             # 関数実装
├── custom/                      # CDK経由のカスタムAWSサービス
│   └── [service-name]/
│       └── resource.ts          # カスタムサービス設定
└── amplify_outputs.json         # 生成された設定（手動編集不可）
```

主要ファイルとその目的:

1. **backend.ts**: バックエンド設定のメインエントリポイント。すべてのリソース定義をインポートして構成します。

2. **auth/resource.ts**: Amazon Cognitoを使用した認証設定を定義します。

3. **data/resource.ts**: AppSyncとDynamoDBを使用してデータモデル、クエリ、ミューテーションを定義します。

4. **storage/resource.ts**: 適切な権限を持つS3ストレージを設定します。

5. **function/[name]/resource.ts**: Lambda関数を設定します。

6. **custom/[service]/resource.ts**: CDKを使用して追加のAWSサービスを拡張します。

7. **amplify_outputs.json**: バックエンドリソースのエンドポイント情報、APIキー、接続詳細を含む生成された設定ファイル。手動で編集しないでください。

### ローカル開発からGit pushまでのワークフロー

AWS Amplify Gen2は、ローカル開発にはクラウドサンドボックス環境を、本番環境にはGitベースのデプロイを使用して開発プロセスを合理化します。

#### 初期セットアップ

1. **新しいAmplifyプロジェクトを作成**:
   ```bash
   npm create amplify@latest my-app
   cd my-app
   ```

2. **AWS認証情報を設定**:
   `AmplifyBackendDeployFullAccess`権限ポリシーを持つAWS認証情報が設定されていることを確認します。

   ```bash
   aws configure
   ```

#### クラウドサンドボックスを使用したローカル開発

1. **フロントエンド開発サーバーを起動**:
   ```bash
   npm run dev
   ```

2. **クラウドサンドボックス環境を起動**（別のターミナルで）:
   ```bash
   npx ampx sandbox
   ```
   - 開発専用の独立したバックエンド環境がデプロイされます。
   - 初回デプロイには約5分かかり、amplifyフォルダに基づいてAWSリソースが作成されます。
   - デプロイ後、`amplify_outputs.json`が接続情報で更新されます。

3. **バックエンドコードを変更**:
   - amplifyディレクトリ内のファイルを編集します（データモデルの変更、認証機能の追加など）。
   - クラウドサンドボックスは変更を自動的に検知してバックエンドを更新します。
   - AmplifyはCDKホットスワップを可能な限り使用してデプロイ時間を短縮します。

4. **変更をローカルでテスト**:
   - フロントエンドはクラウドサンドボックスのバックエンドに接続します。
   - データの作成、読み取り、更新、削除、認証のテストなどが可能です。

5. **サンドボックスを終了**（開発終了時）:
   ```bash
   # サンドボックスのターミナルでCtrl+Cを押し、リソースを削除するを選択
   # または明示的に削除:
   npx ampx sandbox delete
   ```

#### 本番環境へのデプロイ準備

1. **変更をGitにコミット**:
   ```bash
   git add .
   git commit -m "機能Xを実装"
   ```

2. **リポジトリにプッシュ**:
   ```bash
   git push origin main
   ```

3. **Amplify CI/CDパイプライン**:
   - GitリポジトリでAmplify Hostingを設定している場合、ブランチへのプッシュが自動デプロイをトリガーします。
   - CI/CDパイプラインはフロントエンドをビルドし、バックエンドリソースをデプロイします。
   - 各ブランチは独自の分離されたバックエンド環境を持つことができます。

### セキュリティ脆弱性の回避方法

AWS Amplify Gen2はAWSセキュリティのベストプラクティスを取り入れていますが、セキュアなアプリケーションを確保するために追加の対策を実装する必要があります。

#### 認証とアクセス制御

1. **適切な認証フローの実装**:
   - 機密性の高いアプリケーションには多要素認証（MFA）を有効化。
   - 適切なパスワードポリシー（複雑さ、有効期限）を設定。
   - 簡素化されたが安全な認証のためにソーシャルIDプロバイダーを使用。

2. **きめ細かなアクセス制御**:
   - データモデルにエンティティベースのアクセス制御を使用:

   ```typescript
   // セキュアなデータモデル例
   Todo: a.model({
     content: a.string(),
     done: a.boolean()
   }).authorization((allow) => [
     allow.authenticated().to(['read']),
     allow.owner().to(['create', 'update', 'delete'])
   ])
   ```

3. **カスタムクレームとグループ**:
   - ロールベースのアクセス制御にCognitoユーザーグループを活用。
   - 追加の認可ロジックにカスタムクレームを実装。

#### データセキュリティ

1. **保存時および転送時の暗号化**:
   - AWS AmplifyはAPI通信にHTTPSを自動的に有効化。
   - DynamoDBまたはS3に保存される機密データに暗号化を使用。

2. **入力検証**:
   - クライアント側とサーバー側の両方で厳格な検証を実装。
   - TypeScriptの型システムを使用してデータの整合性を強制。

3. **ストレージセキュリティルール**:
   - S3ストレージに適切なパスパターンを使用:

   ```typescript
   // セキュアなストレージ設定
   storage = defineStorage({
     name: 'securefiles',
     access: (allow) => ({
       'public/*': [allow.guest.to(['read'])],
       'private/{entity_id}/*': [
         allow.entity('identity').to(['read', 'write', 'delete'])
       ]
     })
   });
   ```

#### シークレット管理

1. **安全なパラメータストレージの使用**:
   - AWS Systems Manager Parameter Storeを使用して機密値を保存:

   ```bash
   npx ampx sandbox secret set API_KEY "your-api-key"
   ```

   - 本番ブランチでは、Amplify Consoleを使用して暗号化された環境変数とシークレットを設定。

2. **シークレットのハードコーディングを避ける**:
   - 機密情報をリポジトリにコミットしないでください。
   - 環境変数またはAWS Parameter Storeからシークレットを参照してください。

### amplify sandboxとCI/CDの連携

Amplify Gen2のクラウドサンドボックスはローカル開発向けに設計されていますが、より高度なワークフローのためにCI/CDパイプラインと統合することもできます。

#### カスタムパイプライン統合

1. **基本的な統合セットアップ**:

   ```yaml
   # AWS CodeBuild用のビルド仕様例
   version: 0.2
   phases:
     install:
       runtime-versions:
         nodejs: 18
       commands:
         - npm install -g @aws-amplify/cli@latest
     build:
       commands:
         - npm ci
         - npx ampx pipeline-deploy --branch $BRANCH_NAME --app-id $AMPLIFY_APP_ID
         - npm run build
   artifacts:
     base-directory: build
     files:
       - '**/*'
   ```

2. **CI/CDのセットアップ**:
   - Gitリポジトリを接続してAmplifyアプリを作成。
   - カスタムCI/CDを使用するブランチの自動ビルドを無効化。
   - 必要なコマンドを含むようにAmplifyビルド仕様を更新。

3. **カスタムパイプライン設定**:
   - AWS CodePipeline、Amazon CodeCatalyst、またはGitHub Actionsの場合:
     1. Amplifyアプリを作成し、最初にフルスタックGen2ブランチを接続。
     2. ブランチの自動ビルドを無効化。
     3. `npx ampx generate outputs`および`npx ampx pipeline-deploy`を使用するようにビルド仕様を更新。

4. **実装パターン**:
   ```yaml
   # GitHub Actionsワークフロー例
   name: Deploy Amplify Backend
   
   on:
     push:
       branches:
         - main
         - dev
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - name: Install dependencies
           run: npm ci
         - name: Deploy Amplify backend
           run: npx ampx pipeline-deploy --branch ${GITHUB_REF#refs/heads/} --app-id ${{ secrets.AMPLIFY_APP_ID }}
           env:
             AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
             AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
             AWS_REGION: us-east-1
         - name: Build frontend
           run: npm run build
   ```

## まとめ

AWS Amplify Gen2は、TypeScriptベースのコードファーストアプローチを採用しており、フロントエンド開発者がクラウドバックエンドをより簡単に構築できるように設計されています。Auth（Cognito）、Storage（S3）、Data（GraphQL/DynamoDB）の各コンポーネントは、TypeScriptの型安全性を最大限に活用し、堅牢なアプリケーション開発をサポートします。

Gen2の主な利点は、エンドツーエンドの型安全性、柔軟なアクセス制御、強力な開発ワークフロー、そして既存のAWSサービスとの緊密な統合です。エンドツーエンドの型安全なアプローチにより、開発者はフロントエンドとバックエンドの間の不整合を早期に発見し、バグやセキュリティ問題を未然に防ぐことができます。

このガイドで紹介したパターンとベストプラクティスに従うことで、2024年以降のAWS Amplify Gen2を使用した最新のクラウドアプリケーション開発を効率的に行うことができます。