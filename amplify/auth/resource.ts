// File: amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailSubject: 'Project Niferche - メールアドレス確認',
      verificationEmailBody: (code) => 
        `Project Nifercheへようこそ。\n認証コード：${code}\nこのコードの有効期限は15分です。`,
      verificationEmailStyle: 'CODE'
    }
  },
  userAttributes: {
    nickname: {
      mutable: true,
      required: false
    },
    email: {
      mutable: true,
      required: true
    }
  },
  multifactor: {
    mode: 'OFF'
  },
  // 追加の設定
  accountRecovery: 'EMAIL_ONLY',
});
