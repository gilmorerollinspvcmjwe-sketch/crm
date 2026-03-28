import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3010,
    strictPort: false, // 端口被占用时自动切换
    open: false,
    host: true, // 允许网络访问
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // 让 Vite 自动管理 chunk
      },
    },
  },
  // optimizeDeps 配置移除，避免启动时强制重新优化导致崩溃
});
