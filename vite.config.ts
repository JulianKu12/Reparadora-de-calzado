import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/icons-material': path.resolve(__dirname, 'node_modules/@mui/icons-material/esm')
    }
  }
})
