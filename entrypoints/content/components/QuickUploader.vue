<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const isDragging = ref(false);
const isUploading = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  if (isUploading.value) return;
  fileInputRef.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);
  if (files.length > 0) {
    handleFiles(files);
  }
  target.value = "";
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (!isUploading.value) {
    isDragging.value = true;
  }
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;

  if (isUploading.value) return;

  const files = Array.from(event.dataTransfer?.files || []);
  if (files.length > 0) {
    handleFiles(files);
  }
};

const handleFiles = (files: File[]) => {
  const imageFiles = files.filter((file) => file.type.startsWith("image/"));
  if (imageFiles.length > 0) {
    isUploading.value = true;

    // 直接调用全局上传函数
    if (typeof (window as any).__quickUploaderHandler === "function") {
      (window as any).__quickUploaderHandler(imageFiles);
    } else {
      console.error("[QuickUploader] 上传处理函数未注册");
      isUploading.value = false;
    }
  }
};

// 用于外部调用，结束上传状态
defineExpose({
  finishUpload: () => {
    isUploading.value = false;
  },
  setUploading: (state: boolean) => {
    isUploading.value = state;
  },
});
</script>

<template>
  <div
    class="quick-uploader"
    :class="{ dragging: isDragging, uploading: isUploading }"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @click="triggerFileInput"
  >
    <input
      ref="fileInputRef"
      type="file"
      multiple
      accept="image/*"
      style="display: none"
      @change="handleFileSelect"
    />

    <div class="uploader-icon">
      <Icon v-if="!isUploading" icon="mdi:cloud-upload" :width="32" />
      <Icon v-else icon="mdi:loading" :width="32" class="spinning" />
    </div>

    <div class="uploader-text">
      <span v-if="!isUploading">{{ isDragging ? "松开上传" : "上传图片" }}</span>
      <span v-else>上传中...</span>
    </div>
  </div>
</template>

<style scoped>
.quick-uploader {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 64px;
  height: 64px;
  background: #ff5000;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(255, 80, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 999999;
  user-select: none;
  border: none;
  outline: none;
}

.quick-uploader:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 80, 0, 0.4);
  background: #ff6a26;
}

.quick-uploader.dragging {
  transform: scale(1.15);
  box-shadow: 0 8px 24px rgba(255, 80, 0, 0.5);
  background: #ff6a26;
}

.quick-uploader.uploading {
  cursor: not-allowed;
  background: #ffa366;
  pointer-events: none;
}

.uploader-icon {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.uploader-text {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  color: #334155;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.95);
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.quick-uploader:hover .uploader-text {
  opacity: 1;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
