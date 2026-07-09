<script setup lang="ts">
import { ref } from "vue";
import { uploadImageToOss } from "@/utils/oss";
import { formatLink } from "@/utils/link";
import { useSettingsStore } from "@/stores/settings";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import ProgressBar from "primevue/progressbar";
import Chip from "primevue/chip";

const settingsStore = useSettingsStore();
const toast = useToast();

const isDragging = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);

const fileInput = ref<HTMLInputElement | null>(null);

const recentUploads = ref<{ url: string; name: string }[]>([]);

const triggerFileInput = () => {
  if (!settingsStore.isConfigured) {
    toast.add({ severity: "warn", summary: "提示", detail: "请先完成OSS配置", life: 3000 });
    return;
  }
  fileInput.value?.click();
};

const onFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    await handleFiles(Array.from(target.files));
    target.value = "";
  }
};

const onDrop = async (event: DragEvent) => {
  isDragging.value = false;
  if (!settingsStore.isConfigured) {
    toast.add({ severity: "warn", summary: "提示", detail: "请先完成OSS配置", life: 3000 });
    return;
  }
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    await handleFiles(Array.from(event.dataTransfer.files));
  }
};

const handleFiles = async (files: File[]) => {
  const validFiles = files
    .filter((f) => f.type.startsWith("image/") && f.size <= 50 * 1024 * 1024)
    .slice(0, 10);

  if (validFiles.length === 0) {
    toast.add({
      severity: "error",
      summary: "错误",
      detail: "请选择有效的图片文件（单张≤50MB）",
      life: 3000,
    });
    return;
  }

  isUploading.value = true;
  uploadProgress.value = 0;

  let successCount = 0;
  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    try {
      const res = await uploadImageToOss(
        settingsStore.ossConfig,
        file,
        undefined,
        settingsStore.enableCompression,
      );
      if (res.success && res.url) {
        recentUploads.value.unshift({ url: res.url, name: res.name || file.name });
        if (recentUploads.value.length > 5) {
          recentUploads.value.pop();
        }
        successCount++;
      }
    } catch (error: any) {
      toast.add({ severity: "error", summary: "上传失败", detail: error.message, life: 3000 });
    }
    uploadProgress.value = Math.round(((i + 1) / validFiles.length) * 100);
  }

  isUploading.value = false;

  if (successCount > 0) {
    toast.add({
      severity: "success",
      summary: "上传成功",
      detail: `成功上传 ${successCount} 张图片`,
      life: 3000,
    });
  }
};

const captureScreen = async () => {
  if (!settingsStore.isConfigured) {
    toast.add({ severity: "warn", summary: "提示", detail: "请先完成OSS配置", life: 3000 });
    return;
  }
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.windowId) {
      const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `screenshot_${Date.now()}.png`, { type: "image/png" });
      await handleFiles([file]);
    }
  } catch (error: any) {
    toast.add({ severity: "error", summary: "截图失败", detail: error.message, life: 3000 });
  }
};

const checkClipboard = async () => {
  if (!settingsStore.isConfigured) return;
  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      const imageTypes = item.types.filter((type) => type.startsWith("image/"));
      if (imageTypes.length > 0) {
        const blob = await item.getType(imageTypes[0]);
        const file = new File([blob], `clipboard_${Date.now()}.${imageTypes[0].split("/")[1]}`, {
          type: imageTypes[0],
        });
        if (confirm("检测到剪贴板有图片，是否上传？")) {
          await handleFiles([file]);
        }
        break;
      }
    }
  } catch {
    console.log("Clipboard read failed");
  }
};

const copyUrl = (url: string, name: string) => {
  const link = formatLink(url, name, settingsStore.linkFormat);
  navigator.clipboard
    .writeText(link)
    .then(() => {
      toast.add({
        severity: "success",
        summary: "已复制",
        detail: "链接已复制到剪贴板",
        life: 2000,
      });
    })
    .catch(() => {
      toast.add({ severity: "error", summary: "失败", detail: "复制失败", life: 2000 });
    });
};
</script>

<template>
  <div class="upload-page">
    <div class="page-header">
      <h2>上传图片</h2>
      <p class="page-desc">拖拽、截图或从剪贴板快速上传至阿里云 OSS</p>
    </div>

    <div v-if="!settingsStore.isConfigured" class="config-warning">
      <i class="pi pi-exclamation-triangle warning-icon"></i>
      <div>
        <strong>未配置阿里云 OSS</strong>
        <p>请先前往 <em>设置</em> 页面完成 AccessKey 与 Bucket 配置</p>
      </div>
    </div>

    <!-- 快捷操作按钮 -->
    <div class="quick-actions">
      <button class="action-card" @click="triggerFileInput">
        <span class="action-icon-box" style="background: #fff2eb; color: #ff5000">
          <i class="pi pi-upload"></i>
        </span>
        <span class="action-label">本地文件</span>
      </button>
      <button class="action-card" @click="captureScreen">
        <span class="action-icon-box" style="background: #eef2ff; color: #6366f1">
          <i class="pi pi-camera"></i>
        </span>
        <span class="action-label">截图上传</span>
      </button>
      <button class="action-card" @click="checkClipboard">
        <span class="action-icon-box" style="background: #f0fdf4; color: #22c55e">
          <i class="pi pi-clipboard"></i>
        </span>
        <span class="action-label">剪贴板</span>
      </button>
    </div>

    <input
      type="file"
      ref="fileInput"
      multiple
      accept="image/*"
      style="display: none"
      @change="onFileSelect"
    />

    <!-- 拖拽区域 -->
    <div
      class="drop-zone"
      :class="{ 'is-dragging': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
      @click="triggerFileInput"
    >
      <div class="drop-zone-inner">
        <i class="pi pi-cloud-upload drop-icon"></i>
        <p class="drop-title">将图片拖拽到此处上传</p>
        <p class="drop-sub">支持 JPG / PNG / GIF / WebP / SVG，单张 ≤ 50MB</p>
      </div>
    </div>

    <!-- 上传进度 -->
    <div v-if="isUploading" class="upload-progress">
      <div class="progress-header">
        <i class="pi pi-spin pi-spinner"></i>
        <span>上传中...</span>
      </div>
      <ProgressBar :value="uploadProgress" />
    </div>

    <!-- 最近上传 -->
    <div class="recent-section" v-if="recentUploads.length > 0">
      <div class="recent-header">
        <h3>最近上传</h3>
        <Chip :label="`${recentUploads.length} 张`" class="recent-chip" />
      </div>
      <div class="recent-grid">
        <div v-for="item in recentUploads" :key="item.url" class="recent-card">
          <img :src="item.url" class="recent-thumb" />
          <div class="recent-info">
            <span class="recent-name" :title="item.name">{{ item.name }}</span>
            <Button
              icon="pi pi-copy"
              size="small"
              text
              rounded
              @click="copyUrl(item.url, item.name)"
              title="复制链接"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.upload-page {
  padding: 24px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  background-color: $cus-bg-color;
}

.page-header {
  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
  }

  .page-desc {
    margin: 4px 0 0;
    font-size: 13px;
    color: #64748b;
  }
}

.config-warning {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #b45309;

  .warning-icon {
    font-size: 20px;
    margin-top: 1px;
  }

  strong {
    display: block;
    font-size: 14px;
    margin-bottom: 2px;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #92400e;

    em {
      font-style: normal;
      font-weight: 600;
    }
  }
}

// 快捷操作卡片
.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  .action-icon-box {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .action-label {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
  }
}

// 拖拽区
.drop-zone {
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover,
  &.is-dragging {
    border-color: $cus-primary-color;
    background: linear-gradient(135deg, #fff7ed 0%, #fff 100%);
    box-shadow: 0 0 0 4px rgba($cus-primary-color, 0.06);
  }

  .drop-zone-inner {
    padding: 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .drop-icon {
    font-size: 56px;
    color: #94a3b8;
    transition: color 0.3s;
  }

  &:hover .drop-icon,
  &.is-dragging .drop-icon {
    color: $cus-primary-color;
  }

  .drop-title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: $cus-text-color;
  }

  .drop-sub {
    margin: 0;
    font-size: 12px;
    color: #94a3b8;
  }
}

// 上传进度
.upload-progress {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;

  .progress-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 500;
    color: $cus-text-color;
  }
}

// 最近上传
.recent-section {
  .recent-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;

    h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
    }

    .recent-chip {
      :deep(.p-chip) {
        font-size: 11px;
        background: #f1f5f9;
      }
    }
  }

  .recent-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
  }

  .recent-card {
    background: white;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    transition: box-shadow 0.2s;

    &:hover {
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
    }

    .recent-thumb {
      width: 100%;
      aspect-ratio: 16 / 10;
      object-fit: cover;
      display: block;
    }

    .recent-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      gap: 6px;

      .recent-name {
        font-size: 11px;
        color: #334155;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
