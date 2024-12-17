// src/services/auth.ts
import { 
  signUp,
  confirmSignUp,
  resetPassword,
  confirmResetPassword,
  updateUserAttributes,
  UserAttributeKey
} from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export const authService = {
  // サインアップ
  async signUp(username: string, password: string, email: string) {
    try {
      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      });
      
      // UserProfileの作成
      if (result.userId) {
        await client.models.UserProfile.create({
          userId: result.userId,
          email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          badges: []
        });
      }
      
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },

  // サインアップ確認
  async confirmSignUp(username: string, confirmationCode: string) {
    try {
      return await confirmSignUp({
        username,
        confirmationCode
      });
    } catch (error) {
      console.error('Confirm sign up error:', error);
      throw error;
    }
  },

  // パスワードリセットの開始
  async initiateResetPassword(username: string) {
    try {
      return await resetPassword({ username });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  // パスワードリセットの確認
  async confirmResetPassword(username: string, newPassword: string, confirmationCode: string) {
    try {
      return await confirmResetPassword({
        username,
        newPassword,
        confirmationCode
      });
    } catch (error) {
      console.error('Confirm reset password error:', error);
      throw error;
    }
  },

  // ユーザー属性の更新
  async updateUserProfile(attributes: { [key in UserAttributeKey]?: string }) {
    try {
      return await updateUserAttributes({
        userAttributes: attributes
      });
    } catch (error) {
      console.error('Update user attributes error:', error);
      throw error;
    }
  }
};