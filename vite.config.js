import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
  server: {
    proxy: {
      '/Profile-images': {
        target: 'http://localhost:5214',
        changeOrigin: true,
        secure: false,
      },
      // Avoid browser CORS issues by proxying API requests through Vite.
      '/api': {
        target: 'https://invoiceapi-gcc3duhbc4age6bw.southafricanorth-01.azurewebsites.net',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});

