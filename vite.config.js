// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
<<<<<<< HEAD
  base: '/Sistema-de-Cadastro-e-Avalia-o/', // 👈 Nome exato do seu repositório
=======
  base: '/Sistema-de-Cadastro-e-Avalia-o-/', // ✅ Confirmado: Nome exato do seu repositório
>>>>>>> 9ac9fb4 (Hospedando o site e corrigindo links)
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
