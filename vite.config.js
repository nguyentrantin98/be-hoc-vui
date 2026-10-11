import { defineConfig } from 'vite';

// base './' để build chạy được khi upload dạng zip (CrazyGames, YouTube Playables)
export default defineConfig({
  base: './',
  build: { assetsInlineLimit: 0, chunkSizeWarningLimit: 2000 },
});
