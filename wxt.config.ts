import { defineConfig } from 'wxt';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  // 插件manifestV3配置
  manifest: {
    // 插件名称
    name: 'PicAliOSS',
    // 插件作者email联系方式
    author: {
      email: '2186256471@qq.com',
    },
    // 插件版本号
    version: '1.0',
    // 插件版本名称
    version_name: '1.0-beta',
    // 插件描述
    description: '🚀 轻量级阿里云OSS专用图床浏览器插件 | 专注极简、极速、极稳',
    // 手动指定插件图标
    icons: {
      '16': 'icon/icon16.png',
      '32': 'icon/icon32.png',
      '48': 'icon/icon48.png',
      '96': 'icon/icon96.png',
      '128': 'icon/icon128.png',
    },
    permissions: [
      'storage',
      'activeTab',
      'clipboardRead',
      'clipboardWrite'
    ],
    host_permissions: [
      '<all_urls>'
    ]
  },
  // Vite配置;
  vite: () => ({
    plugins: [
      Components({
        resolvers: [PrimeVueResolver()],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/variables.scss" as *;\n`
        }
      }
    }
  }),
});
