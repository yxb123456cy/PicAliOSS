<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { uploadImageToOss } from '@/utils/oss';
import { formatLink } from '@/utils/link';
import { useSettingsStore } from '../store/settings';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import ProgressBar from 'primevue/progressbar';
import Toast from 'primevue/toast';

const settingsStore = useSettingsStore();
const toast = useToast();

const isDragging = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);

const fileInput = ref<HTMLInputElement | null>(null);

const recentUploads = ref<{ url: string; name: string }[]>([]);

const triggerFileInput = () => {
  if (!settingsStore.isConfigured) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请先完成OSS配置', life: 3000 });
    return;
  }
  fileInput.value?.click();
};

const onFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    await handleFiles(Array.from(target.files));
    target.value = ''; // reset
  }
};

const onDrop = async (event: DragEvent) => {
  isDragging.value = false;
  if (!settingsStore.isConfigured) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请先完成OSS配置', life: 3000 });
    return;
  }
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    await handleFiles(Array.from(event.dataTransfer.files));
  }
};

const handleFiles = async (files: File[]) => {
  const validFiles = files.filter(f => f.type.startsWith('image/') && f.size <= 50 * 1024 * 1024).slice(0, 10);

  if (validFiles.length === 0) {
    toast.add({ severity: 'error', summary: '错误', detail: '请选择有效的图片文件（单张≤50MB）', life: 3000 });
    return;
  }

  isUploading.value = true;
  uploadProgress.value = 0;

  let successCount = 0;
  for (let i = 0; i < validFiles.length; i++) {
    const file = validFiles[i];
    try {
      const res = await uploadImageToOss(file);
      if (res.success && res.url) {
        recentUploads.value.unshift({ url: res.url, name: res.name || file.name });
        if (recentUploads.value.length > 3) {
          recentUploads.value.pop();
        }
        successCount++;
      }
    } catch (error: any) {
      toast.add({ severity: 'error', summary: '上传失败', detail: error.message, life: 3000 });
    }
    uploadProgress.value = Math.round(((i + 1) / validFiles.length) * 100);
  }

  isUploading.value = false;

  if (successCount > 0) {
    toast.add({ severity: 'success', summary: '上传成功', detail: `成功上传 ${successCount} 张图片`, life: 3000 });
  }
};

// 截图上传
const captureScreen = async () => {
  if (!settingsStore.isConfigured) {
    toast.add({ severity: 'warn', summary: '提示', detail: '请先完成OSS配置', life: 3000 });
    return;
  }
  try {
    // 调用 Chrome tabs API 截图
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.windowId) {
      const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });

      // dataUrl to File
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `screenshot_${Date.now()}.png`, { type: 'image/png' });

      await handleFiles([file]);
    }
  } catch (error: any) {
    toast.add({ severity: 'error', summary: '截图失败', detail: error.message, life: 3000 });
  }
};

// 剪贴板上传
const checkClipboard = async () => {
  if (!settingsStore.isConfigured) return;
  try {
    const items = await navigator.clipboard.read();
    for (const item of items) {
      const imageTypes = item.types.filter(type => type.startsWith('image/'));
      if (imageTypes.length > 0) {
        const blob = await item.getType(imageTypes[0]);
        const file = new File([blob], `clipboard_${Date.now()}.${imageTypes[0].split('/')[1]}`, { type: imageTypes[0] });

        // 提示是否上传
        if (confirm('检测到剪贴板有图片，是否上传？')) {
          await handleFiles([file]);
        }
        break;
      }
    }
  } catch (error) {
    // clipboard read may fail or require permission
    console.log('Clipboard read failed', error);
  }
};

const copyUrl = (url: string, name: string) => {
  const link = formatLink(url, name);
  navigator.clipboard.writeText(link).then(() => {
    toast.add({ severity: 'success', summary: '成功', detail: '链接已复制到剪贴板', life: 2000 });
  }).catch(() => {
    toast.add({ severity: 'error', summary: '失败', detail: '复制失败', life: 2000 });
  });
};

onMounted(() => {
  // maybe check clipboard on mount or window focus
});

</script>

<template>
  <div class="upload-page">
    <!-- <Toast /> -->

    <div v-if="!settingsStore.isConfigured" class="config-warning">
      <i class="pi pi-exclamation-triangle warning-icon"></i>
      <p>您还未配置阿里云OSS，请先前往设置页面进行配置</p>
    </div>

    <div class="actions">
      <Button label="点击上传" icon="pi pi-upload" @click="triggerFileInput" />
      <Button label="截图上传" icon="pi pi-camera" severity="secondary" @click="captureScreen" />
      <Button label="剪贴板上传" icon="pi pi-clipboard" severity="info" @click="checkClipboard" />
    </div>

    <input type="file" ref="fileInput" multiple accept="image/*" style="display: none" @change="onFileSelect" />

    <div class="drop-zone" :class="{ 'is-dragging': isDragging }" @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false" @drop.prevent="onDrop" @click="triggerFileInput">
      <i class="pi pi-cloud-upload drop-icon"></i>
      <p>将图片拖拽到此处，或点击上传</p>
      <span class="sub-text">支持 JPG, PNG, GIF, WebP, SVG，单张 ≤ 50MB</span>
    </div>

    <div v-if="isUploading" class="upload-progress">
      <p>上传中...</p>
      <ProgressBar :value="uploadProgress" />
    </div>

    <div class="recent-uploads" v-if="recentUploads.length > 0">
      <h3>最近上传</h3>
      <div class="upload-list">
        <div v-for="item in recentUploads" :key="item.url" class="upload-item">
          <img :src="item.url" class="thumbnail" />
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <Button icon="pi pi-copy" size="small" text @click="copyUrl(item.url, item.name)" title="复制链接" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// use custom global scss styles variable
.upload-page {
  padding: 16px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  background-color: $cus-bg-color;
}

.config-warning {
  background-color: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: $cus-border-radius;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b45309;
  font-size: 14px;

  .warning-icon {
    font-size: 20px;
  }
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  :deep(.p-button) {
    flex: 1;
    min-width: 100px;
    padding: 8px;
    font-size: 14px;
  }
}

.drop-zone {
  border: 2px dashed #cbd5e1;
  border-radius: $cus-border-radius;
  padding: 32px 16px;
  text-align: center;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover,
  &.is-dragging {
    border-color: $cus-primary-color;
    background-color: #f0fdf4;
  }

  .drop-icon {
    font-size: 48px;
    color: #94a3b8;
  }

  p {
    margin: 0;
    font-weight: 500;
    color: $cus-text-color;
  }

  .sub-text {
    font-size: 12px;
    color: #64748b;
  }
}

.upload-progress {
  p {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: $cus-text-color;
  }
}

.recent-uploads {
  h3 {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #475569;
  }

  .upload-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .upload-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    background: white;
    border-radius: $cus-border-radius;
    border: 1px solid #e2e8f0;

    .thumbnail {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
    }

    .item-info {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;

      .item-name {
        font-size: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
