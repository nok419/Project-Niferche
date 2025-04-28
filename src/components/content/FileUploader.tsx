// src/components/content/FileUploader.tsx
import { useRef, useState, useEffect, ChangeEvent } from 'react';
import { useFileUpload, UseUploadOptions } from '../../utils/storage';
import { StorageAccessLevel } from 'aws-amplify/storage';

export interface FileUploaderProps {
  path?: string;
  accessLevel?: StorageAccessLevel;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  onUploadSuccess?: (results: Array<{ key: string; url: string }>) => void;
  onUploadError?: (error: Error) => void;
}

export const FileUploader = ({
  path = 'temp/uploads',
  accessLevel = 'private',
  accept = '*/*',
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  onUploadSuccess,
  onUploadError
}: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [results, setResults] = useState<Array<{ key: string; url: string }>>([]);

  const uploadOptions: UseUploadOptions = {
    path,
    accessLevel
  };

  const {
    isUploading,
    progress,
    error,
    result,
    uploadFile,
    reset
  } = useFileUpload(uploadOptions);

  useEffect(() => {
    if (error && onUploadError) {
      onUploadError(error);
    }
  }, [error, onUploadError]);

  useEffect(() => {
    if (result) {
      setResults(prev => [...prev, { key: result.key, url: result.url }]);
      
      // 全てのファイルがアップロードされたらコールバックを呼び出す
      if (results.length + 1 === files.length && onUploadSuccess) {
        onUploadSuccess([...results, { key: result.key, url: result.url }]);
      }
    }
  }, [result, files.length, results, onUploadSuccess]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    // エラーメッセージをリセット
    setErrorMessage('');
    reset();
    
    const fileList: File[] = [];
    let hasError = false;

    // ファイルの検証
    Array.from(selectedFiles).forEach(file => {
      if (file.size > maxSize) {
        setErrorMessage(`ファイル"${file.name}"のサイズが大きすぎます。最大${maxSize / 1024 / 1024}MBまで`);
        hasError = true;
        return;
      }
      fileList.push(file);
    });

    if (hasError) {
      return;
    }

    setFiles(fileList);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setErrorMessage('アップロードするファイルを選択してください');
      return;
    }

    setResults([]);
    
    try {
      // ファイルを1つずつアップロード
      for (const file of files) {
        await uploadFile(file);
      }
    } catch (err) {
      console.error('アップロードエラー:', err);
    }
  };

  return (
    <div className="file-uploader">
      <div className="file-input-container">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          disabled={isUploading}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          ファイルを選択
        </button>
      </div>
      
      {files.length > 0 && (
        <div className="selected-files">
          <h4>選択されたファイル:</h4>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      {isUploading ? (
        <div className="upload-progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <span>{progress}%</span>
        </div>
      ) : (
        <button 
          onClick={handleUpload} 
          disabled={files.length === 0 || isUploading}
        >
          アップロード
        </button>
      )}
      
      {results.length > 0 && (
        <div className="upload-results">
          <h4>アップロード完了:</h4>
          <ul>
            {results.map((item, index) => (
              <li key={index}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.key.split('/').pop()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

