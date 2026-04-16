// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        recipes: resolve(__dirname, 'recipes.html'),
        favorites: resolve(__dirname, 'favorites.html'),
      },
    },
  },
});