import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/RuraLGo/',
  plugins: [vue()],
  server: {
    port: 5183,
    open: true,
    host: 'localhost'
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    __VITE_ENV__: JSON.stringify(process.env.NODE_ENV || 'development')
  }
})
