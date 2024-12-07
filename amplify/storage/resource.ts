// File: amplify/storage/resource.ts
import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'niferche-content',
  access: (allow) => ({
    // 公式コンテンツ
    'official/laboratory/*': [
      allow.guest.to(['read']),
      allow.groups(['admin']).to(['write', 'delete'])
    ],
    'official/materials/*': [
      allow.guest.to(['read']),
      allow.groups(['admin']).to(['write', 'delete'])
    ],

    // 共有コンテンツ - ユーザーごとのフォルダを管理
    'shared/laboratory/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'shared/materials/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],

    // システム用
    'system/*': [
      allow.guest.to(['read']),
      allow.groups(['admin']).to(['write', 'delete'])
    ],

    // 一時ファイル用（アップロード中など）
    'temp/*': [
      allow.authenticated.to(['read', 'write']),
      allow.groups(['admin']).to(['delete'])
    ],

    // サムネイル用
    'thumbnails/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['write']),
      allow.groups(['admin']).to(['delete'])
    ],

    // ユーザープロフィール用
    'profiles/{entity_id}/*': [
      allow.guest.to(['read']),
      allow.entity('identity').to(['read', 'write']),
      allow.groups(['admin']).to(['delete'])
    ]
  })
});