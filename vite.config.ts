import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use relative paths so dist/index.html works when opened directly
  // from the filesystem (file:// protocol) without a dev server
  base: './',
})
