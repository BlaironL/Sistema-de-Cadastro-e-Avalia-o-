import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Necessário para o alias

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Alias '@' apontando para a sua pasta 'src' principal
    },
  },
});