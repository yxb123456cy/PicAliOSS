<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useImagesStore } from '../store/images';
import { useSettingsStore } from '../store/settings';
import { formatLink } from '@/utils/link';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';

const imagesStore = useImagesStore();
const settingsStore = useSettingsStore();
const toast = useToast();

const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const selectedImages = ref<string[]>([]);
const previewUrl = ref('');
const showPreview = ref(false);

onMounted(async () => {
  if (settingsStore.isConfigured) {
    try {
      await imagesStore.fetchImages();
    } catch (e: any) {
      toast.add({ severity: 'error', summary: '加载失败', detail: e.message, life: 3000 });
    }
  }
});

const refresh = async () => {
  if (!settingsStore.isConfigured) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请先完成OSS配置', life: 3000 });
    return;
  }
  try {
    await imagesStore.fetchImages(true);
    toast.add({ severity: 'success', summary: '刷新成功', detail: '已更新图片列表', life: 2000 });
  } catch (e: any) {
    toast.add({ severity: 'error', summary: '刷新失败', detail: e.message, life: 3000 });
  }
};

const filteredImages = computed(() => {
  let list = imagesStore.images;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(img => img.name.toLowerCase().includes(q));
  }
  return list;
});

const totalPages = computed(() => Math.ceil(filteredImages.value.length / pageSize.value) || 1);

const paginatedImages = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredImages.value.slice(start, start + pageSize.value);
});

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', { hour12: false });
};

const openPreview = (url: string) => {
  previewUrl.value = url;
  showPreview.value = true;
};

const copyLink = (url: string, name?: string) => {
  const link = formatLink(url, name);
  navigator.clipboard.writeText(link).then(() => {
    toast.add({ severity: 'success', summary: '复制成功', detail: '链接已复制到剪贴板', life: 2000 });
  });
};

const downloadImage = async (url: string, name: string) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
    toast.add({ severity: 'success', summary: '下载成功', detail: '图片已下载', life: 2000 });
  } catch (e) {
    toast.add({ severity: 'error', summary: '下载失败', detail: '无法下载图片', life: 3000 });
  }
};

const deleteImage = async (name: string) => {
  if (confirm(`确定要删除图片 ${name} 吗？此操作不可恢复。`)) {
    try {
      await imagesStore.removeImage(name);
      toast.add({ severity: 'success', summary: '删除成功', detail: '图片已删除', life: 2000 });
      // remove from selection
      selectedImages.value = selectedImages.value.filter(sel => sel !== name);
    } catch (e: any) {
      toast.add({ severity: 'error', summary: '删除失败', detail: e.message, life: 3000 });
    }
  }
};

const toggleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedImages.value = paginatedImages.value.map(img => img.name);
  } else {
    selectedImages.value = [];
  }
};

const isAllSelected = computed(() => {
  if (paginatedImages.value.length === 0) return false;
  return paginatedImages.value.every(img => selectedImages.value.includes(img.name));
});

const batchDelete = async () => {
  if (selectedImages.value.length === 0) return;
  if (confirm(`确定要删除选中的 ${selectedImages.value.length} 张图片吗？`)) {
    try {
      for (const name of selectedImages.value) {
        await imagesStore.removeImage(name);
      }
      toast.add({ severity: 'success', summary: '删除成功', detail: `已删除 ${selectedImages.value.length} 张图片`, life: 2000 });
      selectedImages.value = [];
    } catch (e: any) {
      toast.add({ severity: 'error', summary: '批量删除失败', detail: e.message, life: 3000 });
    }
  }
};

const batchCopy = () => {
  if (selectedImages.value.length === 0) return;
  const urls = selectedImages.value.map(name => {
    const img = imagesStore.images.find(i => i.name === name);
    return img ? formatLink(img.url, img.name) : '';
  }).filter(Boolean);

  navigator.clipboard.writeText(urls.join('\n')).then(() => {
    toast.add({ severity: 'success', summary: '复制成功', detail: `已复制 ${urls.length} 个链接`, life: 2000 });
  });
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};
</script>

<template>
  <div class="manage-page">
    <!-- <Toast /> -->

    <div class="toolbar">
      <div class="search-box">
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search" />
          <InputText v-model="searchQuery" placeholder="搜索文件名" class="w-full p-inputtext-sm" />
        </span>
      </div>
      <div class="actions">
        <Button icon="pi pi-refresh" severity="secondary" @click="refresh" :loading="imagesStore.isLoading"
          title="刷新缓存" />
        <Button icon="pi pi-trash" severity="danger" @click="batchDelete" :disabled="selectedImages.length === 0"
          title="批量删除" />
        <Button icon="pi pi-copy" severity="info" @click="batchCopy" :disabled="selectedImages.length === 0"
          title="批量复制" />
      </div>
    </div>

    <div class="list-header" v-if="paginatedImages.length > 0">
      <div class="checkbox-col">
        <Checkbox :modelValue="isAllSelected" :binary="true" @update:modelValue="toggleSelectAll" />
      </div>
      <div class="info-col">文件信息</div>
      <div class="action-col">操作</div>
    </div>

    <div class="image-list">
      <div v-if="imagesStore.isLoading && imagesStore.images.length === 0" class="loading-state">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <p>加载中...</p>
      </div>
      <div v-else-if="filteredImages.length === 0" class="empty-state">
        <p>暂无图片</p>
      </div>
      <template v-else>
        <div class="image-item" v-for="img in paginatedImages" :key="img.name">
          <div class="checkbox-col">
            <Checkbox v-model="selectedImages" :value="img.name" />
          </div>
          <div class="thumb-col" @click="openPreview(img.url)">
            <img :src="img.url" alt="thumbnail" loading="lazy" />
          </div>
          <div class="info-col">
            <div class="name" :title="img.name">{{ img.name }}</div>
            <div class="meta">
              <span>{{ formatSize(img.size) }}</span>
              <span>{{ formatDate(img.lastModified) }}</span>
            </div>
          </div>
          <div class="action-col">
            <Button icon="pi pi-copy" text size="small" @click="copyLink(img.url, img.name)" title="复制链接" />
            <Button icon="pi pi-download" text size="small" @click="downloadImage(img.url, img.name)" title="下载" />
            <Button icon="pi pi-trash" text severity="danger" size="small" @click="deleteImage(img.name)" title="删除" />
          </div>
        </div>
      </template>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <Button icon="pi pi-angle-left" text size="small" @click="prevPage" :disabled="currentPage === 1" />
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <Button icon="pi pi-angle-right" text size="small" @click="nextPage" :disabled="currentPage === totalPages" />
    </div>

    <Dialog v-model:visible="showPreview" modal header="图片预览" :style="{ width: '90vw' }" :dismissableMask="true">
      <div class="preview-container">
        <img :src="previewUrl" alt="preview" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
// use custom global scss styles variable
.manage-page {
  padding: 12px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: $cus-bg-color;
  overflow: hidden;
}

.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;

  .search-box {
    flex: 1;
    position: relative;

    :deep(.p-input-icon-left) {
      width: 100%;

      i {
        left: 0.75rem;
      }
    }

    :deep(.p-inputtext) {
      width: 100%;
      padding-left: 2.5rem;
    }
  }

  .actions {
    display: flex;
    gap: 4px;

    :deep(.p-button) {
      padding: 0.5rem;
    }
  }
}

.list-header {
  display: flex;
  align-items: center;
  padding: 8px;
  background: #f1f5f9;
  border-radius: 4px 4px 0 0;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;

  .checkbox-col {
    width: 30px;
    display: flex;
    justify-content: center;
  }

  .info-col {
    flex: 1;
    padding-left: 48px;
  }

  .action-col {
    width: 100px;
    text-align: center;
  }
}

.image-list {
  flex: 1;
  overflow-y: auto;
  background: white;
  border-radius: 0 0 4px 4px;
  border: 1px solid #e2e8f0;
  border-top: none;

  .loading-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #64748b;
  }

  .image-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid #f1f5f9;

    &:hover {
      background: #f8fafc;
    }

    .checkbox-col {
      width: 30px;
      display: flex;
      justify-content: center;
    }

    .thumb-col {
      width: 40px;
      height: 40px;
      margin-left: 8px;
      cursor: pointer;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid #e2e8f0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.2s;

        &:hover {
          transform: scale(1.1);
        }
      }
    }

    .info-col {
      flex: 1;
      margin-left: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .name {
        font-size: 13px;
        font-weight: 500;
        color: $cus-text-color;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 4px;
      }

      .meta {
        font-size: 11px;
        color: #64748b;
        display: flex;
        gap: 12px;
      }
    }

    .action-col {
      width: 100px;
      display: flex;
      justify-content: flex-end;
      gap: 2px;

      :deep(.p-button) {
        width: 28px;
        height: 28px;
        padding: 0;
      }
    }
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  font-size: 14px;
  color: #475569;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 70vh;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}
</style>
