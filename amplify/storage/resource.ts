// amplify/storage/resource.ts
import { defineStorage } from '@aws-amplify/backend';

/**
 * S3ストレージ定義
 * - 各区画ごとに分離されたストレージパス
 * - 細かく設定された権限
 * - Laboratoryセクションの独立性を保持
 */
export const storage = defineStorage({
  name: 'niferche-content',
  access: (allow) => ({
    /**
     * 区画A: サイト管理 - ストレージ構造
     */
    // サイト管理用ファイル
    'site/announcements/*': [
      allow.guest().to(['read']),
      allow.authenticated().to(['read']).when(context => 
        context.identity.claims.has('custom:userRole')
      ),
      allow.authenticated().to(['write', 'delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN'
      )
    ],
    'site/analytics/*': [
      allow.authenticated().to(['read', 'write', 'delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN'
      )
    ],
    'site/system/*': [
      allow.authenticated().to(['read', 'write', 'delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN'
      )
    ],
    
    /**
     * 区画B: Project Niferche - ストレージ構造
     */
    // メインストーリー（公式コンテンツ）
    'niferche/official/main-story/*': [
      allow.guest().to(['read']),
      allow.authenticated().to(['write', 'delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN' || 
        context.identity.claims.get('custom:userRole') === 'CONTENT_MANAGER'
      )
    ],
    
    // サイドストーリー（公式コンテンツ）
    'niferche/official/side-story/*': [
      allow.guest().to(['read']),
      allow.authenticated().to(['write', 'delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN' || 
        context.identity.claims.get('custom:userRole') === 'CONTENT_MANAGER'
      )
    ],
    
    // 設定資料（世界ごと、公式コンテンツ）
    'niferche/official/materials/common/*': [
      allow.guest().to(['read']),
      allow.authenticated().to(['write', 'delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN' || 
        context.identity.claims.get('custom:userRole') === 'CONTENT_MANAGER'
      )
    ],
    'niferche/official/materials/hodemei/*': [
      allow.guest().to(['read']),
      allow.authenticated().to(['write', 'delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN' || 
        context.identity.claims.get('custom:userRole') === 'CONTENT_MANAGER'
      )
    ],
    'niferche/official/materials/quxe/*': [
      allow.guest().to(['read']),
      allow.authenticated().to(['write', 'delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN' || 
        context.identity.claims.get('custom:userRole') === 'CONTENT_MANAGER'
      )
    ],
    'niferche/official/materials/alsarejia/*': [
      allow.guest().to(['read']),
      allow.authenticated().to(['write', 'delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN' || 
        context.identity.claims.get('custom:userRole') === 'CONTENT_MANAGER'
      )
    ],
    
    // キャラクター情報（公式コンテンツ）
    'niferche/official/characters/*': [
      allow.guest().to(['read']),
      allow.authenticated().to(['write', 'delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN' || 
        context.identity.claims.get('custom:userRole') === 'CONTENT_MANAGER'
      )
    ],
    
    // ユーザー作成コンテンツ（公開）
    'niferche/user/{identity_id}/public/*': [
      allow.guest().to(['read']),
      allow.owner().to(['read', 'write', 'delete'])
    ],
    
    // ユーザー作成コンテンツ（認証済みユーザーのみ閲覧可能）
    'niferche/user/{identity_id}/authenticated/*': [
      allow.authenticated().to(['read']),
      allow.owner().to(['read', 'write', 'delete'])
    ],
    
    // ユーザー作成コンテンツ（非公開）
    'niferche/user/{identity_id}/private/*': [
      allow.owner().to(['read', 'write', 'delete'])
    ],
    
    /**
     * 区画C: Laboratory - ストレージ構造（LCB独立セクション）
     */
    // 公開プロジェクト
    'laboratory/projects/public/*': [
      allow.guest().to(['read']),
      allow.authenticated().to(['write']).when(context => 
        context.identity.claims.has('custom:laboratoryRole')
      ),
      allow.authenticated().to(['delete']).when(context => 
        context.identity.claims.get('custom:laboratoryRole') === 'ADMIN'
      )
    ],
    
    // 認証済みユーザー向けプロジェクト
    'laboratory/projects/authenticated/*': [
      allow.authenticated().to(['read']),
      allow.authenticated().to(['write']).when(context => 
        context.identity.claims.has('custom:laboratoryRole')
      ),
      allow.authenticated().to(['delete']).when(context => 
        context.identity.claims.get('custom:laboratoryRole') === 'ADMIN'
      )
    ],
    
    // ユーザー固有のプロジェクト
    'laboratory/user/{identity_id}/*': [
      allow.owner().to(['read', 'write', 'delete']),
      allow.authenticated().to(['read']).when(context => 
        context.identity.claims.get('custom:laboratoryRole') === 'ADMIN'
      )
    ],
    
    // 創作タスク成果物
    'laboratory/artifacts/{identity_id}/*': [
      allow.owner().to(['read', 'write', 'delete']),
      allow.authenticated().to(['read']).when(context => 
        context.identity.claims.has('custom:laboratoryRole')
      )
    ],
    
    // Laboratory実験コンテンツ
    'laboratory/experiments/*': [
      allow.guest().to(['read']),
      allow.authenticated().to(['write']).when(context => 
        context.identity.claims.has('custom:laboratoryRole')
      ),
      allow.authenticated().to(['delete']).when(context => 
        context.identity.claims.get('custom:laboratoryRole') === 'ADMIN'
      )
    ],
    
    /**
     * 共通リソース
     */
    // 共有アセット
    'assets/shared/*': [
      allow.guest().to(['read']),
      allow.authenticated().to(['write']).when(context => 
        context.identity.claims.get('custom:userRole') === 'CONTENT_CREATOR' || 
        context.identity.claims.get('custom:userRole') === 'CONTENT_MANAGER' || 
        context.identity.claims.get('custom:userRole') === 'ADMIN'
      ),
      allow.authenticated().to(['delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN'
      )
    ],
    
    // 公開画像
    'assets/images/*': [
      allow.guest().to(['read']),
      allow.authenticated().to(['write']),
      allow.authenticated().to(['delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN'
      )
    ],
    
    // プロフィール画像
    'profiles/{identity_id}/*': [
      allow.guest().to(['read']),
      allow.owner().to(['read', 'write']),
      allow.authenticated().to(['delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN'
      )
    ],
    
    // 一時ファイル（48時間後に自動削除）
    'temp/{identity_id}/*': [
      allow.owner().to(['read', 'write']),
      allow.authenticated().to(['read', 'delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN'
      )
    ],
    
    // サムネイル
    'thumbnails/*': [
      allow.guest().to(['read']),
      allow.authenticated().to(['write']),
      allow.authenticated().to(['delete']).when(context => 
        context.identity.claims.get('custom:userRole') === 'ADMIN'
      )
    ]
  })
});