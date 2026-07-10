import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { decrypt, encrypt } from "@/utils/crypto";
import { LinkFormat, OssConfig } from "@/typings";

const STORAGE_KEY = "ossConfig";

interface StorageData {
  [STORAGE_KEY]?: string;
}
const createDefaultOssConfig = (): OssConfig => ({
  accessKeyId: "",
  accessKeySecret: "",
  bucket: "",
  region: "",
  customDomain: "",
});

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const ossConfig = ref<OssConfig>(createDefaultOssConfig());
    const isConfigured = ref(false);
    const isLoaded = ref(false);
    const linkFormat = ref<LinkFormat>("markdown");
    const enableCompression = ref(true);
    let loadConfigPromise: Promise<void> | null = null;

    const checkIsConfigured = (): void => {
      const { accessKeyId, accessKeySecret, bucket, region } = ossConfig.value;
      isConfigured.value = !!(accessKeyId && accessKeySecret && bucket && region);
    };

    const loadConfig = async (): Promise<void> => {
      if (loadConfigPromise) {
        return loadConfigPromise;
      }

      loadConfigPromise = (async () => {
        const result = (await chrome.storage.local.get(STORAGE_KEY)) as StorageData;
        const storedConfig = result[STORAGE_KEY];

        if (storedConfig) {
          try {
            const decryptedStr = decrypt(storedConfig);

            if (decryptedStr) {
              ossConfig.value = {
                ...createDefaultOssConfig(),
                ...JSON.parse(decryptedStr),
              };
            }
          } catch (error) {
            console.error("Failed to parse OSS config", error);
          }
        }

        checkIsConfigured();
        isLoaded.value = true;
      })();

      try {
        await loadConfigPromise;
      } finally {
        loadConfigPromise = null;
      }
    };

    const saveConfig = async (config: OssConfig): Promise<void> => {
      const nextConfig = {
        ...createDefaultOssConfig(),
        ...config,
      };
      const encryptedStr = encrypt(JSON.stringify(nextConfig));

      await chrome.storage.local.set({ [STORAGE_KEY]: encryptedStr });
      ossConfig.value = nextConfig;
      checkIsConfigured();
    };
    watch(
      [enableCompression, linkFormat],
      () => {
        chrome.storage.local.set({
          appSettings: {
            enableCompression: enableCompression.value,
            linkFormat: linkFormat.value,
          },
        });
      },
      { immediate: true },
    ); // immediate: true 确保初始化时写入
    return {
      ossConfig,
      isConfigured,
      isLoaded,
      linkFormat,
      enableCompression,
      loadConfig,
      saveConfig,
      checkIsConfigured,
    };
  },
  {
    persist: {
      pick: ["linkFormat", "enableCompression"],
    },
  },
);
