// amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';

/**
 * 認証システム定義
 * - 区画共通のユーザー認証システム
 * - 区画ごとの権限を持つユーザーグループ
 * - カスタム属性によるアクセス制御
 */
export const auth = defineAuth({
  // メールログイン
  loginWith: {
    email: {
      verificationEmailSubject: 'Project Niferche - メールアドレス確認',
      verificationEmailStyle: 'CODE',
      verificationEmailBody: (createCode) => {
        const code = createCode();
        return `Project Nifercheへようこそ。\n認証コード：${code}\nこのコードの有効期限は15分です。`;
      }
    }
  },
  
  // ユーザー属性定義
  userAttributes: {
    // 表示名
    nickname: {
      mutable: true
    },
    // メールアドレス
    email: {
      mutable: true
    },
    // ユーザー名（オプション）
    preferredUsername: {
      mutable: true
    },
    // プロフィール情報（オプション）
    profile: {
      mutable: true
    },
    // カスタム属性
    custom: {
      // 区画アクセス権限
      sectionAccess: {
        type: "string",
        mutable: true
      },
      // ユーザーロール
      userRole: {
        type: "string",
        mutable: true
      },
      // Laboratory固有ロール
      laboratoryRole: {
        type: "string",
        mutable: true
      }
    }
  },
  
  // 二要素認証（オプション）
  multifactor: {
    mode: 'OPTIONAL',
    sms: {
      smsMessage: (createCode) => {
        const code = createCode();
        return `認証コード: ${code}`;
      }
    }
  },
  
  // パスワードポリシー
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true
  },
  
  // アカウント回復オプション
  accountRecovery: 'EMAIL_ONLY',

  // ユーザーグループを定義
  groups: [
    'ADMIN',
    'CONTENT_MANAGER',
    'CONTENT_CREATOR',
    'LABORATORY_ADMIN',
    'LABORATORY_USER',
    'USER'
  ]
});