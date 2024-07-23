import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist', // adjust this to your desired output directory
    assetsDir: 'img',
    publicPath: '/', // serve static assets from the root directory
    index: 'index.html', // adjust this to your desired index file
  },
});