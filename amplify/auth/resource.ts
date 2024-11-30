import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
    // username: false, // メールアドレスのみを使用
  },
  userAttributes: {
    nickname: {
      required: true,
      mutable: true,
    },
    userRole: {
      required: true,
      mutable: false,
      default: 'user'
    }
  },
  multiFactor: {
    mode: 'OFF'  // 必要に応じてOPTIONALまたはREQUIREDに変更可能
  }
});