import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_STORAGE_BUCKET': JSON.stringify(
        env.VITE_STORAGE_BUCKET || 'niferche-content'
      ),
    },
    resolve: {
      alias: {
        './runtimeConfig': './runtimeConfig.browser',
      },
    },
  };
});