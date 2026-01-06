import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      util: path.resolve(__dirname, 'src/utils/polyfill-util.js'),
      buffer: path.resolve(__dirname, 'src/utils/polyfill-buffer.js')
    }
  },
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    host: true,
    port: 4173
  },
  build: {
    outDir: 'build'
  },
  envPrefix: ['VITE_', 'REACT_APP_'],
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    global: 'window'
  }
}));
