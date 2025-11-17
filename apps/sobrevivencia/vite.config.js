import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  plugins: [
    svgr(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@tostes/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@tostes/styles': path.resolve(__dirname, '../../packages/styles'),
    }
  },
  build: {
    outDir: 'build',
  },
})
