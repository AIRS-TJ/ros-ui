import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"
import { resolve } from 'path'
import { svgBuilder } from './src/plugins/svgBuilder'; 


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    svgBuilder('./src/assets/svg/')
  ],
  resolve: {
      alias: {
          '@': resolve(__dirname, './src'), // 设置 `@` 指向 `src` 目录
      },
  },
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@import "${resolve(__dirname, './src')}/scss/variable";` },
    },
  },
  base: './', // 设置打包路径
  build:{
    outDir: 'ros',
    rollupOptions: {
      output: {
        dir: 'ros'
      }
    }
  }
})
