import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    hmr: {
      clientPort: 8080,
    },
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    include: [
      '@tanstack/react-query',
      '@mui/x-date-pickers',
      '@mui/x-date-pickers/AdapterDayjs',
      'dayjs'
    ]
  }
})
