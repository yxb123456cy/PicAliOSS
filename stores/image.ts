import { defineStore } from "pinia";
import { ref } from "vue";
import { deleteOssImage, listOssImages } from "@/utils/oss";
import { useSettingsStore } from "@/stores/settings";

export interface OssImage {
  name: string;
  url: string;
  lastModified: string;
  size: number;
}

export const useImagesStore = defineStore(
  "images",
  () => {
    const images = ref<OssImage[]>([]);
    const isLoading = ref(false);
    const lastFetchTime = ref(0);

    const fetchImages = async (forceRefresh = false) => {
      const settingsStore = useSettingsStore();

      if (!settingsStore.isConfigured) {
        images.value = [];
        return;
      }

      if (
        !forceRefresh &&
        images.value.length > 0 &&
        Date.now() - lastFetchTime.value < 5 * 60 * 1000
      ) {
        return;
      }

      isLoading.value = true;

      try {
        let allImages: OssImage[] = [];
        let continuationToken: string | undefined;
        let isTruncated = true;
        let loopCount = 0;

        while (isTruncated && loopCount < 10) {
          const response = await listOssImages(settingsStore.ossConfig, 100, continuationToken);
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

    const removeImage = async (name: string) => {
      const settingsStore = useSettingsStore();

      await deleteOssImage(settingsStore.ossConfig, name);
      images.value = images.value.filter((img) => img.name !== name);
    };

    const clearCache = () => {
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
