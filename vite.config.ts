import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    /** 是否开启 HTTPS */
    https: false,
    /** 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目 */
    host: true, // host: "0.0.0.0"
    /** 端口号 */
    port: 3333,
    /** 是否自动打开浏览器 */
    open: false,
    /** 跨域设置允许 */
    cors: true,
    /** 端口被占用时，是否直接退出 */
    strictPort: false,
    /*
     * 连接后端服务时使用 server.proxy 设置代理
     * 当请求路径以 api 开头，说明调用的是真实后端服务
     */
    proxy: {
      '^/api': {
        target: 'http://127.0.0.1:8000/api/v1/',
        // target: 'http://172.18.6.232:8000/api/v1',
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true,
        /** 是否允许跨域 */
        changeOrigin: true
      }
    }
  },
  /** 打包相关操作 */
  build: {
    /** 单个 chunk 文件的大小超过 2048KB 时发出警告 */
    chunkSizeWarningLimit: 2048,
    /** 禁用 gzip 压缩大小报告 */
    reportCompressedSize: false,
    /** 打包后静态资源目录 */
    assetsDir: 'static',
    rollupOptions: {
      output: {
        /**
         * 分块策略
         * 1. 注意这些包名必须存在，否则打包会报错
         * 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
         */
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia'],
          element: ['element-plus', '@element-plus/icons-vue'],
          vxe: ['vxe-table', 'vxe-table-plugin-element', 'xe-utils']
        }
      }
    }
  },
  /** 混淆器 */
  esbuild: {
    /** 打包时移除 console.log */
    pure: ['console.log'],
    /** 打包时移除 debugger */
    drop: ['debugger'],
    /** 打包时移除所有注释 */
    legalComments: 'none'
  },
  plugins: [
    vue(),
    vueJsx(),
    VueSetupExtend(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
