// File: src/pages/user/UploadContentPage.tsx

import React, { useState } from 'react';
import { View, TextField, Button, SelectField, Alert } from '@aws-amplify/ui-react';
import { useSession } from '../../contexts/SessionContext';
import { StorageService } from '../../services/storage';

export const UploadContentPage: React.FC = () => {
  const { user } = useSession();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<'official' | 'shared'>('shared');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isAdmin = user?.attributes?.['custom:role'] === 'admin';
  
  const handleSubmit = async () => {
    if (!file) {
      setError('ファイルを選択してください');
      return;
    }
    setError('');
    setSuccess('');

    try {
      // アップロード先パスの決定
      let uploadPath = '';
      if (category === 'official') {
        if (!isAdmin) {
          setError('管理者のみ official カテゴリに投稿できます');
          return;
        }
        uploadPath = `official/${title.replace(/\s+/g, '_')}/${file.name}`;
      } else {
        // shared
        const entityId = user?.username; 
        // or user?.attributes?.sub
        uploadPath = `shared/materials/${entityId}/${file.name}`;
      }

      await StorageService.uploadFile(uploadPath, file);
      setSuccess(`アップロード成功: ${uploadPath}`);
    } catch (err: any) {
      setError(`アップロード失敗: ${err.message}`);
    }
  };

  return (
    <View padding="1rem">
      <TextField
        label="タイトル"
        placeholder="コンテンツのタイトル"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <SelectField
        label="投稿カテゴリ"
        value={category}
        onChange={(e) => setCategory(e.target.value as 'official' | 'shared')}
        isDisabled={!isAdmin} // 管理者以外は "shared" のみ
      >
        <option value="shared">共有コンテンツ</option>
        <option value="official">公式コンテンツ</option>
      </SelectField>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        style={{ marginTop: '1rem' }}
      />
      <Button onClick={handleSubmit} marginTop="1rem">
        アップロード
      </Button>
      {error && <Alert variation="error" marginTop="1rem">{error}</Alert>}
      {success && <Alert variation="success" marginTop="1rem">{success}</Alert>}
    </View>
  );
};