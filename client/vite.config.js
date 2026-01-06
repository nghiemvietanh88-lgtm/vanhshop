import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
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
    'process.env.NODE_ENV': JSON.stringify(mode)
  }
}));
