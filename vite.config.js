import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src', 'index.html'),
        login: resolve(__dirname, 'src', 'login.html'),
        
        about: resolve(__dirname, 'src', 'landing-page', 'about-us.html'),
        report: resolve(__dirname, 'src', 'landing-page', 'report.html'),
        verification: resolve(
          __dirname,
          'src',
          'landing-page',
          'verification.html'
        ),
        '404': resolve(__dirname, 'src', '404.html'),
      },
    },
  },
  css: {
    modules: false,
    postcss: {
      plugins: [],
    },
  },
});
