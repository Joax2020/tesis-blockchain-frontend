import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      // Esto le dice al plugin que NO genere un manifest nuevo, 
      // porque ya tienes el tuyo vinculado en tu index.html
      manifest: false, 
      workbox: {
        // Archivos que se guardarán en caché para funcionar offline
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'] 
      }
    })
  ],
});