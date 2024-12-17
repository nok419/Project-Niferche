// src/pages/system/auth/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import {
  Flex,
  Card,
  Text,
  TextField,
  Button,
  Alert,
  Divider,
} from '@aws-amplify/ui-react';
import { useAuth } from '../../../components/auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    nickname: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth/signin');
      return;
    }

    // ユーザー情報の初期化
    setProfile({
      nickname: user.nickname || '',
      email: user.email || ''
    });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await updateProfile({
        nickname: profile.nickname
      });
      
      setSuccess(true);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // ユーザー情報を元に戻す
    if (user) {
      setProfile({
        nickname: user.nickname || '',
        email: user.email || ''
      });
    }
  };

  if (authLoading) {
    return (
      <Flex direction="column" alignItems="center" padding="2rem">
        <Text>読み込み中...</Text>
      </Flex>
    );
  }

  if (!user) {
    return null; // ユーザーが存在しない場合はuseEffectでリダイレクト
  }

  return (
    <Flex direction="column" alignItems="center" padding="2rem">
      <Card variation="outlined" width="100%" maxWidth="600px">
        <Flex direction="column" gap="1rem">
          <Text
            variation="primary"
            fontSize="1.5rem"
            fontWeight="bold"
            textAlign="center"
          >
            プロフィール設定
          </Text>

          {error && (
            <Alert variation="error" isDismissible>
              {error}
            </Alert>
          )}

          {success && (
            <Alert variation="success" isDismissible>
              プロフィールを更新しました
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="1rem">
              <TextField
                label="メールアドレス"
                value={profile.email}
                isDisabled={true}
                descriptiveText="メールアドレスは変更できません"
              />

              <TextField
                label="ニックネーム"
                value={profile.nickname}
                onChange={(e) => 
                  setProfile(prev => ({
                    ...prev,
                    nickname: e.target.value
                  }))
                }
                isDisabled={!isEditing || loading}
                required
                placeholder="ニックネームを入力"
                descriptiveText="サイト内で表示される名前です"
                hasError={isEditing && profile.nickname.length === 0}
                errorMessage="ニックネームは必須です"
              />

              <Divider />

              <Flex 
                direction={{ base: 'column', medium: 'row' }} 
                gap="1rem"
                justifyContent="space-between"
              >
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variation="primary"
                    isFullWidth
                  >
                    編集する
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      variation="primary"
                      isLoading={loading}
                      loadingText="更新中..."
                      isDisabled={profile.nickname.length === 0}
                      flex={1}
                    >
                      保存
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variation="destructive"
                      isDisabled={loading}
                      flex={1}
                    >
                      キャンセル
                    </Button>
                  </>
                )}
              </Flex>
            </Flex>
          </form>
        </Flex>
      </Card>
    </Flex>
  );
};