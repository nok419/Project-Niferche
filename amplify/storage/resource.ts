// File: amplify/storage/resource.ts
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'niferche-content',
  access: (allow) => ({
    // 公式コンテンツ (各カテゴリ別に分類)
    // メインストーリー
    'official/laboratory/main-story/*': [
      allow.guest.to(['read']),
      allow.groups(['admin']).to(['write', 'delete'])
    ],
    // サイドストーリー
    'official/laboratory/side-story/*': [
      allow.guest.to(['read']),
      allow.groups(['admin']).to(['write', 'delete'])
    ],
    // 設定資料 (世界別に分類)
    'official/materials/common/*': [
      allow.guest.to(['read']),
      allow.groups(['admin']).to(['write', 'delete'])
    ],
    'official/materials/worlds/quxe/*': [
      allow.guest.to(['read']),
      allow.groups(['admin']).to(['write', 'delete'])
    ],
    'official/materials/worlds/hodemei/*': [
      allow.guest.to(['read']),
      allow.groups(['admin']).to(['write', 'delete'])
    ],
    'official/materials/worlds/alsarejia/*': [
      allow.guest.to(['read']),
      allow.groups(['admin']).to(['write', 'delete'])
    ],

    // 共有コンテンツ - ユーザーごとのフォルダを管理 (visibility設定に応じてアクセス制御)
    // 公開コンテンツ
    'shared/laboratory/side-story/public/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'shared/materials/common/public/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'shared/materials/worlds/public/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    
    // 認証済みユーザーのみ閲覧可能なコンテンツ
    'shared/laboratory/side-story/authenticated/{entity_id}/*': [
      allow.authenticated.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'shared/materials/common/authenticated/{entity_id}/*': [
      allow.authenticated.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'shared/materials/worlds/authenticated/{entity_id}/*': [
      allow.authenticated.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    
    // プライベートコンテンツ
    'shared/laboratory/side-story/private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'shared/materials/common/private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'shared/materials/worlds/private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],

    // システムリソース
    'system/backups/*': [
      allow.groups(['admin']).to(['read', 'write', 'delete'])
    ],
    'system/logs/*': [
      allow.groups(['admin']).to(['read', 'write', 'delete'])
    ],
    'system/public/*': [
      allow.guest.to(['read']),
      allow.groups(['admin']).to(['write', 'delete'])
    ],

    // 一時ファイル用（アップロード中など）
    'temp/uploads/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write']),
      // 48時間後に自動削除するライフサイクルポリシーを設定する
      allow.authenticated.to(['read']),
      allow.groups(['admin']).to(['delete'])
    ],

    // サムネイル用
    'thumbnails/content/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['write']),
      allow.groups(['admin']).to(['delete'])
    ],
    'thumbnails/profile/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['write']),
      allow.groups(['admin']).to(['delete'])
    ],

    // ユーザープロフィール用
    'profiles/{entity_id}/*': [
      // プロフィール画像は常に公開
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write']),
      allow.groups(['admin']).to(['delete'])
    ],
    
    // バッジ画像
    'badges/*': [
      allow.guest.to(['read']),
      allow.groups(['admin']).to(['write', 'delete'])
    ]
  }),
  
  // ストレージのライフサイクル設定
  lifecycle: {
    // 一時ファイルの有効期限は48時間
    'temp/uploads/*': {
      expireAfterDays: 2
    }
  }
});
