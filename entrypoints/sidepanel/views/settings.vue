<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useSettingsStore } from "@/stores/settings";
import { testOssConnection } from "@/utils/oss";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import Select from "primevue/select";
import Divider from "primevue/divider";
import { SDKRespTransform } from "@/utils/resp";
import { ossChinaRegionsWithName } from "@/utils/region";
import Panel from "primevue/panel";
import { LinkFormat, OssConfig } from "@/typings";

const settingsStore = useSettingsStore();
const toast = useToast();

const form = ref<OssConfig>({
  accessKeyId: "",
  accessKeySecret: "",
  bucket: "",
  region: "",
  customDomain: "",
});

const isTesting = ref(false);

const linkFormats = [
  { label: "Markdown", value: "markdown" },
  { label: "HTML", value: "html" },
  { label: "直链 (URL)", value: "url" },
];

const regionOptions = ossChinaRegionsWithName.map((region) => ({
  label: `${region.name} (${region.address})`,
  value: region.address,
}));

const selectedFormat = ref(linkFormats[0]);

onMounted(async () => {
  await settingsStore.loadConfig();
  if (settingsStore.ossConfig) {
    form.value = { ...settingsStore.ossConfig };
  }

  const found = linkFormats.find((f) => f.value === settingsStore.linkFormat);
  if (found) selectedFormat.value = found;
});

watch(selectedFormat, (newVal) => {
  settingsStore.linkFormat = newVal.value as LinkFormat;
});

const saveConfig = async () => {
  isTesting.value = true;
  try {
    const res = await testOssConnection(form.value);
    if (res.success) {
      await settingsStore.saveConfig(form.value);
      toast.add({
        severity: "success",
        summary: "配置已保存",
        detail: "OSS 连接测试通过",
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "配置校验失败",
        detail: SDKRespTransform(res.message),
        life: 3000,
      });
    }
  } catch (err: any) {
    toast.add({
      severity: "error",
      summary: "保存失败",
      detail: err.message || "未知错误",
      life: 3000,
    });
  } finally {
    isTesting.value = false;
  }
};
</script>

<template>
  <div class="settings-page">
    <div class="page-header">
      <h2>设置</h2>
      <p class="page-desc">配置阿里云 OSS 连接参数与插件偏好</p>
    </div>

    <Panel header="阿里云 OSS 配置" toggleable :collapsed="false" class="settings-panel">
      <div class="form-grid">
        <div class="field">
          <label for="ak">AccessKey ID</label>
          <InputText id="ak" v-model="form.accessKeyId" placeholder="输入 AccessKey ID" />
          <small>建议使用 RAM 子账号，仅授予 OSS 管理权限</small>
        </div>
        <div class="field">
          <label for="sk">AccessKey Secret</label>
          <Password
            id="sk"
            v-model="form.accessKeySecret"
            placeholder="输入 AccessKey Secret"
            toggleMask
            :feedback="false"
          />
        </div>
        <div class="field">
          <label for="bucket">Bucket 名称</label>
          <InputText id="bucket" v-model="form.bucket" placeholder="例如：my-pic-bed" />
        </div>
        <div class="field">
          <label for="region">Bucket 区域 (Region)</label>
          <Select
            id="region"
            v-model="form.region"
            :options="regionOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="请选择区域"
            filter
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="domain">自定义域名 <span class="optional-tag">可选</span></label>
          <InputText
            id="domain"
            v-model="form.customDomain"
            placeholder="https://img.example.com"
          />
        </div>
      </div>

      <Button
        label="保存配置并测试连接"
        icon="pi pi-check-circle"
        @click="saveConfig"
        :loading="isTesting"
        class="save-btn"
      />
    </Panel>

    <Divider class="my-4" />

    <Panel header="常规设置" toggleable :collapsed="false" class="settings-panel">
      <div class="field">
        <label>默认链接格式</label>
        <Select
          v-model="selectedFormat"
          :options="linkFormats"
          optionLabel="label"
          placeholder="选择链接格式"
          class="w-full"
        />
        <small>上传图片后自动复制的链接格式</small>
      </div>
    </Panel>
  </div>
</template>

<style scoped lang="scss">
.settings-page {
  padding: 24px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: $cus-bg-color;
}

.page-header {
  margin-bottom: 24px;

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

.settings-panel {
  margin-bottom: 8px;

  :deep(.p-panel-header) {
    font-weight: 600;
    font-size: 15px;
  }

  :deep(.p-panel-content) {
    padding: 20px;
  }
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 20px;
}

.field {
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #334155;
  }

  .optional-tag {
    font-weight: 400;
    font-size: 11px;
    color: #94a3b8;
    background: #f1f5f9;
    padding: 1px 6px;
    border-radius: 4px;
    margin-left: 4px;
  }

  small {
    margin-top: 4px;
    font-size: 12px;
    color: #94a3b8;
  }

  :deep(.p-inputtext),
  :deep(.p-password-input),
  :deep(.p-select) {
    width: 100%;
    font-size: 14px;
    padding: 9px 12px;
  }
}

.save-btn {
  width: 100%;
  justify-content: center;
  font-weight: 600;
}

.my-4 {
  margin: 20px 0;
}
</style>
