import { defineStorage } from '@aws-amplify/backend';

// ストレージリソースの定義
export const storage = defineStorage({
  name: 'niferche-content',
  access: (allow) => ({
    // 公式コンテンツ - 誰でも閲覧可能、管理者のみ編集可能
    'niferche/*': [
      allow.public.to(['read']),
      allow.custom()
        .to(['read', 'write', 'delete'])
        .when(ctx => ctx.identity.claims.roles?.includes('ADMIN'))
    ],
    
    // Laboratory関連コンテンツ
    'laboratory/official/*': [
      allow.public.to(['read']),
      allow.custom()
        .to(['read', 'write', 'delete'])
        .when(ctx => ctx.identity.claims.roles?.includes('ADMIN'))
    ],
    'laboratory/shared/*': [
      allow.public.to(['read']),
      allow.owner().to(['read', 'write', 'delete'])
    ],

    // Materials関連コンテンツ
    'materials/official/*': [
      allow.public.to(['read']),
      allow.custom()
        .to(['read', 'write', 'delete'])
        .when(ctx => ctx.identity.claims.roles?.includes('ADMIN'))
    ],
    'materials/shared/*': [
      allow.public.to(['read']),
      allow.owner().to(['read', 'write', 'delete'])
    ],

    // ユーザーコンテンツ - アップロード者が管理
    'user-content/${cognito-identity.amazonaws.com:sub}/*': [
      allow.owner().to(['read', 'write', 'delete']),
      allow.public.to(['read'])
    ]
  })
});
