<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useSettingsStore, type OssConfig } from '../store/settings';
import { testOssConnection } from '@/utils/oss';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Select from 'primevue/select';
import Divider from 'primevue/divider';

const settingsStore = useSettingsStore();
const toast = useToast();

const form = ref<OssConfig>({
  accessKeyId: '',
  accessKeySecret: '',
  bucket: '',
  region: '',
  customDomain: ''
});

const isTesting = ref(false);

const linkFormats = [
  { label: 'Markdown', value: 'markdown' },
  { label: 'HTML', value: 'html' },
  { label: '直链', value: 'url' }
];

const selectedFormat = ref(linkFormats[0]);

onMounted(async () => {
  await settingsStore.loadConfig();
  if (settingsStore.ossConfig) {
    form.value = { ...settingsStore.ossConfig };
  }

  const found = linkFormats.find(f => f.value === settingsStore.linkFormat);
  if (found) selectedFormat.value = found;
});

watch(selectedFormat, (newVal) => {
  settingsStore.linkFormat = newVal.value;
});

const saveConfig = async () => {
  isTesting.value = true;
  try {
    const res = await testOssConnection(form.value);
    if (res.success) {
      await settingsStore.saveConfig(form.value);
      console.log('toast called');
      toast.add({ severity: 'success', summary: '成功', detail: '配置保存成功', life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: '配置校验失败', detail: res.message, life: 3000 });
    }
  } catch (err: any) {
    toast.add({ severity: 'error', summary: '配置保存失败', detail: err.message || '未知错误', life: 3000 });
  } finally {
    isTesting.value = false;
  }
};

</script>

<template>
  <div class="settings-page">
    <!-- <Toast /> -->
    <div class="section">
      <h3 class="section-title">阿里云OSS配置</h3>
      <div class="field">
        <label for="ak">AccessKey ID</label>
        <InputText id="ak" v-model="form.accessKeyId" placeholder="输入AccessKey ID" />
      </div>
      <div class="field">
        <label for="sk">AccessKey Secret</label>
        <Password id="sk" v-model="form.accessKeySecret" placeholder="输入AccessKey Secret" toggleMask
          :feedback="false" />
      </div>
      <div class="field">
        <label for="bucket">Bucket 名称</label>
        <InputText id="bucket" v-model="form.bucket" placeholder="例如：my-pic-bed" />
      </div>
      <div class="field">
        <label for="region">Bucket 所在区域 (Region)</label>
        <InputText id="region" v-model="form.region" placeholder="例如：oss-cn-hangzhou" />
      </div>
      <div class="field">
        <label for="domain">自定义域名 (可选)</label>
        <InputText id="domain" v-model="form.customDomain" placeholder="例如：https://img.example.com" />
      </div>

      <Button label="保存配置并测试连接" @click="saveConfig" :loading="isTesting" class="w-full mt-2" />
    </div>

    <Divider />

    <div class="section">
      <h3 class="section-title">其他设置</h3>
      <div class="field">
        <label>默认链接格式</label>
        <Select v-model="selectedFormat" :options="linkFormats" optionLabel="label" placeholder="选择链接格式"
          class="w-full" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// use custom global scss styles variable
.settings-page {
  padding: 16px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: $cus-bg-color;
}

.section {
  margin-bottom: 24px;
}

.section-title {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  color: $cus-text-color;
  font-weight: 600;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  label {
    margin-bottom: 6px;
    font-size: 14px;
    color: #475569;
  }

  :deep(.p-inputtext),
  :deep(.p-password-input) {
    width: 100%;
    font-size: 14px;
    padding: 8px 12px;
  }
}
</style>
