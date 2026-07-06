<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useImagesStore } from "@/stores/image";
import { useSettingsStore } from "@/stores/settings";
import { formatLink } from "@/utils/link";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Dialog from "primevue/dialog";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import Tag from "primevue/tag";

const imagesStore = useImagesStore();
const settingsStore = useSettingsStore();
const toast = useToast();

const searchQuery = ref("");
const currentPage = ref(1);
const pageSize = ref(12);
const selectedImages = ref<string[]>([]);
const previewUrl = ref("");
const showPreview = ref(false);
const viewMode = ref<"grid" | "list">("grid");

onMounted(async () => {
  if (settingsStore.isConfigured) {
    try {
      await imagesStore.fetchImages();
    } catch (e: any) {
      toast.add({ severity: "error", summary: "加载失败", detail: e.message, life: 3000 });
    }
  }
});

const refresh = async () => {
  if (!settingsStore.isConfigured) {
    toast.add({ severity: "warn", summary: "提示", detail: "请先完成OSS配置", life: 3000 });
    return;
  }
  try {
    await imagesStore.fetchImages(true);
    toast.add({ severity: "success", summary: "刷新成功", detail: "已更新图片列表", life: 2000 });
  } catch (e: any) {
    toast.add({ severity: "error", summary: "刷新失败", detail: e.message, life: 3000 });
  }
};

const filteredImages = computed(() => {
  let list = imagesStore.images;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((img) => img.name.toLowerCase().includes(q));
  }
  return list;
});

const totalPages = computed(() => Math.ceil(filteredImages.value.length / pageSize.value) || 1);

const paginatedImages = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredImages.value.slice(start, start + pageSize.value);
});

const formatSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString("zh-CN", { hour12: false });
};

const openPreview = (url: string) => {
  previewUrl.value = url;
  showPreview.value = true;
};

const copyLink = (url: string, name?: string) => {
  const link = formatLink(url, name, settingsStore.linkFormat);
  navigator.clipboard.writeText(link).then(() => {
    toast.add({
      severity: "success",
      summary: "复制成功",
      detail: "链接已复制到剪贴板",
      life: 2000,
    });
  });
};

const downloadImage = async (url: string, name: string) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = blobUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
    toast.add({ severity: "success", summary: "下载成功", detail: "图片已下载", life: 2000 });
  } catch {
    toast.add({ severity: "error", summary: "下载失败", detail: "无法下载图片", life: 3000 });
  }
};

const deleteImage = async (name: string) => {
  if (confirm(`确定要删除图片 ${name} 吗？此操作不可恢复。`)) {
    try {
      await imagesStore.removeImage(name);
      toast.add({ severity: "success", summary: "删除成功", detail: "图片已删除", life: 2000 });
      selectedImages.value = selectedImages.value.filter((sel) => sel !== name);
    } catch (e: any) {
      toast.add({ severity: "error", summary: "删除失败", detail: e.message, life: 3000 });
    }
  }
};

const toggleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedImages.value = paginatedImages.value.map((img) => img.name);
  } else {
    selectedImages.value = [];
  }
};

const isAllSelected = computed(() => {
  if (paginatedImages.value.length === 0) return false;
  return paginatedImages.value.every((img) => selectedImages.value.includes(img.name));
});

const batchDelete = async () => {
  if (selectedImages.value.length === 0) return;
  if (confirm(`确定要删除选中的 ${selectedImages.value.length} 张图片吗？`)) {
    try {
      for (const name of selectedImages.value) {
        await imagesStore.removeImage(name);
      }
      toast.add({
        severity: "success",
        summary: "删除成功",
        detail: `已删除 ${selectedImages.value.length} 张图片`,
        life: 2000,
      });
      selectedImages.value = [];
    } catch (e: any) {
      toast.add({ severity: "error", summary: "批量删除失败", detail: e.message, life: 3000 });
    }
  }
};

const batchCopy = () => {
  if (selectedImages.value.length === 0) return;
  const urls = selectedImages.value
    .map((name) => {
      const img = imagesStore.images.find((i) => i.name === name);
      return img ? formatLink(img.url, img.name, settingsStore.linkFormat) : "";
    })
    .filter(Boolean);

  navigator.clipboard.writeText(urls.join("\n")).then(() => {
    toast.add({
      severity: "success",
      summary: "复制成功",
      detail: `已复制 ${urls.length} 个链接`,
      life: 2000,
    });
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
    <!-- 顶部工具栏 -->
    <div class="manage-header">
      <div class="header-left">
        <h2>图片管理</h2>
        <Tag v-if="filteredImages.length" :value="`${filteredImages.length} 张`" severity="info" />
      </div>
      <div class="header-right">
        <div class="search-box">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText v-model="searchQuery" placeholder="搜索文件名..." class="search-input" />
          </IconField>
        </div>
        <Button
          icon="pi pi-refresh"
          severity="secondary"
          text
          rounded
          @click="refresh"
          :loading="imagesStore.isLoading"
          title="刷新"
        />
        <div class="view-toggle">
          <Button
            icon="pi pi-th-large"
            :text="viewMode !== 'grid'"
            :severity="viewMode === 'grid' ? 'primary' : 'secondary'"
            size="small"
            rounded
            @click="viewMode = 'grid'"
          />
          <Button
            icon="pi pi-list"
            :text="viewMode !== 'list'"
            :severity="viewMode === 'list' ? 'primary' : 'secondary'"
            size="small"
            rounded
            @click="viewMode = 'list'"
          />
        </div>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="selectedImages.length > 0" class="batch-bar">
      <span class="batch-count">已选 {{ selectedImages.length }} 项</span>
      <div class="batch-actions">
        <Button label="复制链接" icon="pi pi-copy" size="small" @click="batchCopy" />
        <Button
          label="删除"
          icon="pi pi-trash"
          size="small"
          severity="danger"
          @click="batchDelete"
        />
      </div>
    </div>

    <!-- 列表模式 -->
    <div v-if="viewMode === 'list'" class="list-view">
      <div class="list-header-row">
        <Checkbox :modelValue="isAllSelected" :binary="true" @update:modelValue="toggleSelectAll" />
        <span class="col-preview">预览</span>
        <span class="col-name">文件名</span>
        <span class="col-size">大小</span>
        <span class="col-date">上传时间</span>
        <span class="col-actions">操作</span>
      </div>

      <div class="list-body">
        <div v-if="imagesStore.isLoading && imagesStore.images.length === 0" class="empty-state">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p>加载中...</p>
        </div>
        <div v-else-if="filteredImages.length === 0" class="empty-state">
          <i class="pi pi-image" style="font-size: 2.5rem; color: #cbd5e1"></i>
          <p>暂无图片</p>
        </div>
        <div v-else class="list-item" v-for="img in paginatedImages" :key="img.name">
          <Checkbox v-model="selectedImages" :value="img.name" />
          <div class="col-preview" @click="openPreview(img.url)">
            <img :src="img.url" alt="thumb" loading="lazy" />
          </div>
          <span class="col-name" :title="img.name">{{ img.name }}</span>
          <span class="col-size">{{ formatSize(img.size) }}</span>
          <span class="col-date">{{ formatDate(img.lastModified) }}</span>
          <div class="col-actions">
            <Button
              icon="pi pi-copy"
              text
              rounded
              size="small"
              @click="copyLink(img.url, img.name)"
              title="复制"
            />
            <Button
              icon="pi pi-download"
              text
              rounded
              size="small"
              @click="downloadImage(img.url, img.name)"
              title="下载"
            />
            <Button
              icon="pi pi-trash"
              text
              rounded
              size="small"
              severity="danger"
              @click="deleteImage(img.name)"
              title="删除"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 网格模式 -->
    <div v-else class="grid-view">
      <div v-if="imagesStore.isLoading && imagesStore.images.length === 0" class="empty-state">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <p>加载中...</p>
      </div>
      <div v-else-if="filteredImages.length === 0" class="empty-state">
        <i class="pi pi-image" style="font-size: 2.5rem; color: #cbd5e1"></i>
        <p>暂无图片</p>
      </div>
      <div v-else class="grid-container">
        <div class="grid-card" v-for="img in paginatedImages" :key="img.name">
          <div class="grid-check">
            <Checkbox v-model="selectedImages" :value="img.name" />
          </div>
          <div class="grid-image" @click="openPreview(img.url)">
            <img :src="img.url" alt="thumb" loading="lazy" />
          </div>
          <div class="grid-info">
            <span class="grid-name" :title="img.name">{{ img.name }}</span>
            <span class="grid-meta"
              >{{ formatSize(img.size) }} · {{ formatDate(img.lastModified) }}</span
            >
          </div>
          <div class="grid-actions">
            <Button
              icon="pi pi-copy"
              text
              rounded
              size="small"
              @click="copyLink(img.url, img.name)"
              title="复制"
            />
            <Button
              icon="pi pi-download"
              text
              rounded
              size="small"
              @click="downloadImage(img.url, img.name)"
              title="下载"
            />
            <Button
              icon="pi pi-trash"
              text
              rounded
              size="small"
              severity="danger"
              @click="deleteImage(img.name)"
              title="删除"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination" v-if="totalPages > 1">
      <Button
        icon="pi pi-angle-left"
        text
        rounded
        size="small"
        @click="prevPage"
        :disabled="currentPage === 1"
      />
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <Button
        icon="pi pi-angle-right"
        text
        rounded
        size="small"
        @click="nextPage"
        :disabled="currentPage === totalPages"
      />
    </div>

    <!-- 预览弹窗 -->
    <Dialog
      v-model:visible="showPreview"
      modal
      header="图片预览"
      :style="{ width: '85vw', maxWidth: '700px' }"
      :dismissableMask="true"
    >
      <div class="preview-container">
        <img :src="previewUrl" alt="preview" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.manage-page {
  padding: 24px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: $cus-bg-color;
  overflow: hidden;
}

// 头部
.manage-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;

    .search-box {
      width: 200px;
    }
  }
}

.search-input {
  width: 100%;
  height: 34px;
  padding-left: 2.35rem;
  border-radius: 10px;
  font-size: 13px;
}

.view-toggle {
  display: flex;
  gap: 2px;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 3px;
}

// 批量操作栏
.batch-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  margin-bottom: 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;

  .batch-count {
    font-size: 13px;
    font-weight: 600;
    color: #1e40af;
  }

  .batch-actions {
    display: flex;
    gap: 8px;
  }
}

// 列表视图
.list-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.list-header-row {
  display: grid;
  grid-template-columns: 36px 48px 1fr 80px 140px 100px;
  align-items: center;
  padding: 10px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  gap: 8px;
}

.list-body {
  flex: 1;
  overflow-y: auto;
}

.list-item {
  display: grid;
  grid-template-columns: 36px 48px 1fr 80px 140px 100px;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #f1f5f9;
  gap: 8px;
  transition: background 0.15s;

  &:hover {
    background: #fafbfc;
  }
}

.col-preview {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.col-name {
  font-size: 13px;
  font-weight: 500;
  color: #334155;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-size,
.col-date {
  font-size: 12px;
  color: #64748b;
}

.col-actions {
  display: flex;
  gap: 2px;
  justify-content: flex-end;
}

// 网格视图
.grid-view {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.grid-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
  position: relative;

  &:hover {
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
    transform: translateY(-1px);

    .grid-actions {
      opacity: 1;
    }
  }

  .grid-check {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
  }

  .grid-image {
    aspect-ratio: 4 / 3;
    overflow: hidden;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .grid-info {
    padding: 10px 12px 8px;

    .grid-name {
      display: block;
      font-size: 12px;
      font-weight: 500;
      color: #334155;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 2px;
    }

    .grid-meta {
      font-size: 11px;
      color: #94a3b8;
    }
  }

  .grid-actions {
    display: flex;
    justify-content: flex-end;
    gap: 2px;
    padding: 0 8px 8px;
    opacity: 0;
    transition: opacity 0.2s;
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #94a3b8;

  p {
    margin-top: 12px;
    font-size: 14px;
  }
}

// 分页
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 8px;
  flex-shrink: 0;

  .page-info {
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    min-width: 50px;
    text-align: center;
  }
}

// 预览
.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 65vh;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }
}
</style>
