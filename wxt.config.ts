import { defineConfig } from 'wxt';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import AutoImport from 'unplugin-auto-import/vite'
// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
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
    version: '0.1',
    // 插件版本名称
    version_name: 'V0.1',
    // 插件描述
    description: '🚀 轻量级阿里云OSS专用图床浏览器插件 | 专注极简、极速、极稳',
    // 手动指定插件图标
    icons: {
      '16': 'icon/icon-16.png',
      '32': 'icon/icon-32.png',
      '48': 'icon/icon-48.png',
      '128': 'icon/icon-128.png',
    },
    permissions: [
      'storage',
      'activeTab',
      'clipboardRead',
      'clipboardWrite'
    ],
    host_permissions: [
      '<all_urls>'
    ],
    browser_specific_settings: {
      "gecko": {
        // 火狐浏览器数据收集权限配置（仅Firefox支持，忽略TypeScript类型检查）
        // @ts-ignore
        "data_collection_permissions": {
          "required": ["none"]
        }
      }
    }
  },
  // Vite配置;
  vite: () => ({
    plugins: [
      AutoImport({
      }),
      Components({
        resolvers: [
          PrimeVueResolver(),
        ],
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
