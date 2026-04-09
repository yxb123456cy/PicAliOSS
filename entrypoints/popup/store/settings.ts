import { defineStore } from 'pinia';
import { ref } from 'vue';
import { encrypt, decrypt } from '@/utils/crypto';

// 阿里云OSS存储配置 TS类型接口;
export interface OssConfig {
    // accessKey
    accessKeyId: string;
    // accessKeySecret
    accessKeySecret: string;
    // bucket
    bucket: string;
    // region
    region: string;
    // 自定义域名? 该为可选参数;
    customDomain?: string;
}
// 定义阿里云OSS存储配置状态管理Store;
export const useSettingsStore = defineStore('settings', () => {
    // 初始化阿里云OSS存储配置;
    const ossConfig = ref<OssConfig>({
        accessKeyId: '',
        accessKeySecret: '',
        bucket: '',
        region: '',
        customDomain: ''
    });

    const isConfigured = ref(false);
    // 格式化链接格式;
    const linkFormat = ref('markdown');

    // Initialize from chrome storage
    // 从chrome storage中加载阿里云OSS存储配置;
    const loadConfig = async () => {
        const result = await chrome.storage.local.get('ossConfig');
        const storedConfigStr = result.ossConfig as string;
        if (storedConfigStr) {
            try {
                const decryptedStr = decrypt(storedConfigStr);
                if (decryptedStr) {
                    const parsed = JSON.parse(decryptedStr);
                    ossConfig.value = parsed;
                    checkIsConfigured();
                }
            } catch (error) {
                console.error('Failed to parse OSS config', error);
            }
        }
    };

    // 保存阿里云OSS存储配置;
    const saveConfig = async (config: OssConfig) => {
        const configStr = JSON.stringify(config);
        const encryptedStr = encrypt(configStr);
        await chrome.storage.local.set({ ossConfig: encryptedStr });
        ossConfig.value = config;
        checkIsConfigured();
    };

    // 检查是否配置完成;
    const checkIsConfigured = () => {
        const { accessKeyId, accessKeySecret, bucket, region } = ossConfig.value;
        isConfigured.value = !!(accessKeyId && accessKeySecret && bucket && region);
    };

    // 导出需要供外部使用的状态和方法;
    return {
        ossConfig,
        isConfigured,
        linkFormat,
        loadConfig,
        saveConfig
    };
}, {
    persist: {
        // linkFormat不持久化;
        pick: ['linkFormat']
    }
});
