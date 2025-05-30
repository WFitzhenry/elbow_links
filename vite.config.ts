import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // uses index.html in project root
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'index.html'
    }
  }
});