// functions/auth/postConfirmation.ts
import { PostConfirmationTriggerEvent } from 'aws-lambda';
import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

/**
 * ユーザー確認後の処理
 * - ユーザーのデフォルトグループ割り当て
 * - 初期属性の設定
 */
export const handler = async (event: PostConfirmationTriggerEvent): Promise<PostConfirmationTriggerEvent> => {
  try {
    console.log('Post confirmation event:', JSON.stringify(event, null, 2));
    
    const userPoolId = process.env.USERPOOL_ID;
    const defaultGroup = process.env.DEFAULT_GROUP || 'USER';
    const username = event.userName;
    
    if (!userPoolId) {
      throw new Error('USERPOOL_ID environment variable is not set');
    }

    // デフォルトグループにユーザーを追加
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: username,
      GroupName: defaultGroup,
    });
    
    await cognitoClient.send(addToGroupCommand);
    console.log(`User ${username} added to group ${defaultGroup}`);
    
    // 必要に応じて追加の初期設定
    // 例: DynamoDBにユーザープロファイルレコードを作成するなど
    
    return event;
  } catch (error) {
    console.error('Error in post confirmation handler:', error);
    // エラーがあっても認証プロセスを続行
    return event;
  }
};