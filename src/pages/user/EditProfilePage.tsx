// File: src/pages/user/EditProfilePage.tsx

import React, { useEffect, useState } from 'react';
import { View, TextField, Button, Alert, Image } from '@aws-amplify/ui-react';
import { useSession } from '../../contexts/SessionContext';
import { StorageService } from '../../services/storage';

export const EditProfilePage: React.FC = () => {
  const { user, loadSession } = useSession();
  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      // Cognitoにあるユーザー属性
      const userNick = user.attributes?.nickname || '';
      setNickname(userNick);
      // ここでS3の profile/{entity_id}/avatar.jpg を取得する例
      const entityId = user.username;
      StorageService.getFileUrl(`profiles/${entityId}/avatar.jpg`)
        .then((url) => setAvatarUrl(url))
        .catch(() => setAvatarUrl(''));
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    try {
      const entityId = user.username;

      if (avatarFile) {
        // S3にアップロード
        await StorageService.uploadFile(`profiles/${entityId}/avatar.jpg`, avatarFile);
      }
      // Cognitoの nickname を更新する場合（SessionContextで提供するupdateUserAttributes呼び出し等）
      // あるいは Amplify CLIの "amplify auth update" でnickname有効化済みなら
      // 例: updateProfileNickname(nickname);

      setMessage('プロフィールを更新しました');
      loadSession(true); // Session再読み込み（attributesを反映させるため）
    } catch (err: any) {
      setMessage(`エラー: ${err.message}`);
    }
  };

  return (
    <View padding="1rem">
      {avatarUrl ? (
        <Image src={avatarUrl} alt="avatar" width="120px" height="120px" borderRadius="50%" />
      ) : (
        <View width="120px" height="120px" backgroundColor="var(--amplify-colors-background-tertiary)">
          {/* fallback */}
        </View>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
        style={{ margin: '1rem 0' }}
      />
      <TextField
        label="ニックネーム"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <Button onClick={handleSave} marginTop="1rem">保存</Button>
      {message && <Alert variation="info" marginTop="1rem">{message}</Alert>}
    </View>
  );
};
