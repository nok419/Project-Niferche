// File: amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      // メール認証のカスタマイズ
      verificationEmailSubject: 'ようこそProject Nifercheへ',
      verificationEmailBody: (createCode: () => string) => 
        `認証コード: ${createCode()}\nこのコードは15分間有効です。`
    }
  },
  // ユーザー属性の定義
  userAttributes: {
    nickname: { 
      mutable: true 
    },
    email: { 
      mutable: true 
    }
  },
  // 追加の設定
  accountRecovery: 'EMAIL_ONLY',
  multifactor: {
    mode: 'OFF'  // 初期段階ではMFAをオフに
  }
});