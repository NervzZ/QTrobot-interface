import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'SRC': path.resolve(__dirname, './src'),
      'ASSETS': path.resolve(__dirname, './src/assets')
    }
  },
  plugins: [react()],
})
