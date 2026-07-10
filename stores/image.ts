import { defineStore } from "pinia";
import { ref } from "vue";
import { deleteOssImage, listOssImages } from "@/utils/oss";
import { useSettingsStore } from "@/stores/settings";
import { OssImage } from "@/typings";
import { APP_CONFIG } from "@/constants/config";

export const useImagesStore = defineStore(
  "images",
  () => {
    const images = ref<OssImage[]>([]);
    const isLoading = ref(false);
    const lastFetchTime = ref(0);

    const fetchImages = async (forceRefresh = false): Promise<void> => {
      const settingsStore = useSettingsStore();

      if (!settingsStore.isConfigured) {
        images.value = [];
        return;
      }

      if (
        !forceRefresh &&
        images.value.length > 0 &&
        Date.now() - lastFetchTime.value < APP_CONFIG.IMAGE_CACHE_DURATION_MS
      ) {
        return;
      }

      isLoading.value = true;

      try {
        let allImages: OssImage[] = [];
        let continuationToken: string | undefined;
        let isTruncated = true;
        let loopCount = 0;

        while (isTruncated && loopCount < APP_CONFIG.OSS_LIST_MAX_LOOPS) {
          const response = await listOssImages(
            settingsStore.ossConfig,
            APP_CONFIG.OSS_TEST_MAX_KEYS,
            continuationToken,
          );
          allImages = allImages.concat(response.images);
          isTruncated = response.isTruncated;
          continuationToken = response.nextContinuationToken;
          loopCount++;
        }

        allImages.sort(
          (a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
        );

        images.value = allImages;
        lastFetchTime.value = Date.now();
      } catch (error) {
        console.error("Failed to fetch images", error);
        throw error;
      } finally {
        isLoading.value = false;
      }
    };

    const removeImage = async (name: string): Promise<void> => {
      const settingsStore = useSettingsStore();

      await deleteOssImage(settingsStore.ossConfig, name);
      images.value = images.value.filter((img) => img.name !== name);
    };

    const clearCache = (): void => {
      images.value = [];
      lastFetchTime.value = 0;
    };

    return {
      images,
      isLoading,
      fetchImages,
      removeImage,
      clearCache,
    };
  },
  {
    persist: true,
  },
);
