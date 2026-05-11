import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://back:80',
        changeOrigin: true,
        rewrite: (path) => path,  // сохраняем путь
      }
    }
  }
})