import { defineStore } from 'pinia';
import { ref } from 'vue';
import { listOssImages, deleteOssImage } from '@/utils/oss';

export interface OssImage {
    name: string;
    url: string;
    lastModified: string;
    size: number;
}

export const useImagesStore = defineStore('images', () => {
    const images = ref<OssImage[]>([]);
    const isLoading = ref(false);
    const lastFetchTime = ref(0);

    const fetchImages = async (forceRefresh = false) => {
        // Cache for 5 minutes unless forced
        if (!forceRefresh && images.value.length > 0 && Date.now() - lastFetchTime.value < 5 * 60 * 1000) {
            return;
        }
        
        isLoading.value = true;
        try {
            let allImages: OssImage[] = [];
            let continuationToken: string | undefined = undefined;
            let isTruncated = true;
            
            // fetch all to allow local search and pagination, up to a reasonable limit e.g. 1000
            let loopCount = 0;
            while (isTruncated && loopCount < 10) {
                const res: any = await listOssImages(100, continuationToken);
                allImages = allImages.concat(res.images);
                isTruncated = res.isTruncated;
                continuationToken = res.nextContinuationToken;
                loopCount++;
            }
            
            // sort by lastModified desc
            allImages.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
            images.value = allImages;
            lastFetchTime.value = Date.now();
        } catch (error) {
            console.error('Failed to fetch images', error);
            throw error;
        } finally {
            isLoading.value = false;
        }
    };

    const removeImage = async (name: string) => {
        await deleteOssImage(name);
        images.value = images.value.filter(img => img.name !== name);
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
        clearCache
    };
}, {
    persist: true
});
