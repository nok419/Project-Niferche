
// サムネイル用のキー生成
export const generateThumbnailKey = (originalKey: string): string => {
  const parts = originalKey.split('.');
  const extension = parts.pop();
  return `${parts.join('.')}_thumb.${extension}`;
};

// Content-Typeの取得
export const getContentType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const contentTypes: { [key: string]: string } = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'pdf': 'application/pdf',
    'md': 'text/markdown',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    // 必要に応じて追加
  };
  return contentTypes[extension || ''] || 'application/octet-stream';
};