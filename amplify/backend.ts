import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

const backend = defineBackend({
  auth,
  data,
  storage
});

// Gen2の正しい形式で出力を追加
backend.addOutput({
  storage: {
    bucket_name: 'niferche-content',
    aws_region: 'ap-northeast-1'
  },
  data: {
    api_key_expiration_days: 30
  }
});

export const { auth: authOutput, data: dataOutput, storage: storageOutput } = backend;
