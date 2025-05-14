// amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';
import { defineFunction } from '@aws-amplify/backend';

/**
 * カスタム認証トリガー - サインアップ後の処理
 */
const postConfirmationTrigger = defineFunction({
  name: 'postConfirmationHandler',
  entrypoint: 'functions/auth/postConfirmation.ts',
  environment: {
    USERPOOL_ID: '#{auth:userPoolId}',
    DEFAULT_GROUP: 'USER'
  },
  // 設定可能なメモリと実行タイムアウト
  runtime: {
    memory: 128,
    timeout: 10
  }
});

/**
 * 認証システム定義
 * - 区画共通のユーザー認証システム
 * - 区画ごとの権限を持つユーザーグループ
 * - カスタム属性によるアクセス制御
 * - 最新のセキュリティ機能を有効化
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
      mutable: true,
      required: true
    },
    // メールアドレス
    email: {
      mutable: true,
      required: true
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
      },
      // 最終ログイン日時
      lastLogin: {
        type: "datetime",
        mutable: true
      },
      // 利用統計トラッキング許可
      allowTracking: {
        type: "boolean",
        mutable: true,
        default: false
      }
    }
  },
  
  // 二要素認証（環境ごとに設定可能）
  multifactor: {
    mode: 'OPTIONAL',
    sms: {
      smsMessage: (createCode) => {
        const code = createCode();
        return `認証コード: ${code}`;
      }
    },
    totp: true // Time-based One-Time Password サポート追加
  },
  
  // パスワードポリシー - 強力なセキュリティ設定
  passwordPolicy: {
    minLength: 12,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
    temporaryPasswordValidityDays: 3
  },
  
  // アカウント回復オプション
  accountRecovery: 'EMAIL_ONLY',

  // セキュリティ強化 - 高度な保護機能
  advancedSecurity: {
    enabled: true,
    compromisedCredentialsDetection: true,
    riskBasedAdaptiveAuth: true
  },

  // Lambda トリガー - カスタム認証ロジック
  triggers: {
    postConfirmation: postConfirmationTrigger
  },

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