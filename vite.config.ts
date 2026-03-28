import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      // Konva requires 'canvas' only for SSR; exclude it from browser builds.
      exclude: ['canvas'],
    },
    server: {
      port: 3000,
    },
    preview: {
      port: 3000,
    },
    build: {
      outDir: 'dist',
    },
  };
});
