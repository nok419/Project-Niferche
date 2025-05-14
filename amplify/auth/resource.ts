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
      verificationEmailBody: (code: string) => 
        `Project Nifercheへようこそ。\n認証コード：${code}\nこのコードの有効期限は15分です。`,
      verificationEmailStyle: 'CODE'
    }
  },
  
  // ユーザー属性定義
  userAttributes: {
    // 表示名（必須）
    nickname: {
      mutable: true,
      required: true
    },
    // メールアドレス（必須）
    email: {
      mutable: true,
      required: true
    },
    // ユーザー名（オプション）
    preferredUsername: {
      mutable: true,
      required: false
    },
    // プロフィール情報（オプション）
    profile: {
      mutable: true,
      required: false
    },
    // 区画アクセス権限（カスタム属性）
    'custom:sectionAccess': {
      mutable: true,
      required: false
    },
    // ユーザーロール（カスタム属性）
    'custom:userRole': {
      mutable: true,
      required: false
    },
    // Laboratory固有ロール（カスタム属性）
    'custom:laboratoryRole': {
      mutable: true,
      required: false
    }
  },
  
  // 二要素認証（オプション）
  multifactor: {
    mode: 'OPTIONAL',
    sms: {
      smsMessage: (code) => `認証コード: ${code}`
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
  
  // 検証メッセージ設定
  verificationMessages: {
    email: {
      subject: 'Project Niferche - メールアドレス確認',
      message: (code: string) => `Project Nifercheへようこそ。\n認証コード：${code}\nこのコードの有効期限は15分です。`
    }
  }
});