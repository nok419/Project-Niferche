import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react({
        // Add React refresh options
        fastRefresh: true,
        // Use Babel to transform newer JSX features
        babel: {
          plugins: [
            // Add any babel plugins if needed
          ]
        }
      })
    ],
    define: {
      'import.meta.env.VITE_STORAGE_BUCKET': JSON.stringify(
        env.VITE_STORAGE_BUCKET || 'niferche-content'
      ),
    },
    resolve: {
      alias: {
        './runtimeConfig': './runtimeConfig.browser',
        // Add path aliases for better imports
        '@': '/src',
        '@components': '/src/components',
        '@pages': '/src/pages',
        '@hooks': '/src/hooks',
        '@api': '/src/api',
        '@utils': '/src/utils',
        '@types': '/src/types',
        '@styles': '/src/styles',
        '@assets': '/src/assets'
      },
    },
    // Optimizations for build
    build: {
      target: 'es2022',
      minify: 'terser',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'aws-vendor': ['aws-amplify']
          }
        }
      }
    },
    // Dev server configuration
    server: {
      port: 3000,
      open: true,
      cors: true
    }
  };
});