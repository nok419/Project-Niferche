import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailSubject: 'ようこそProject Nifercheへ',
      verificationEmailBody: (code) => `認証コード: ${code}`,
    }
  },
  userAttributes: {
    nickname: {
      required: true,
      mutable: true,
    },
    email: {
      required: true,
      mutable: true,
    }
  },
  multiFactor: {
    mode: 'OFF',
  },
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialCharacters: true
  }
});