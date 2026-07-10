<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useSettingsStore } from "@/stores/settings";
import { testOssConnection } from "@/utils/oss";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import Select from "primevue/select";
import ToggleSwitch from "primevue/toggleswitch";
import Divider from "primevue/divider";
import { Icon } from "@iconify/vue";
import { SDKRespTransform } from "@/utils/resp";
import { ossChinaRegionsWithName } from "@/utils/region";
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
  { label: "直链", value: "url" },
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
      console.log("toast called");
      toast.add({ severity: "success", summary: "成功", detail: "配置保存成功", life: 3000 });
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
      summary: "配置保存失败",
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
    <!-- <Toast /> -->
    <div class="section">
      <h3 class="section-title">
        <Icon icon="mdi:cloud-cog-outline" width="16" height="16" />
        阿里云OSS配置
      </h3>
      <div class="field">
        <label for="ak">
          <Icon icon="mdi:key-outline" width="14" height="14" />
          AccessKey ID
        </label>
        <InputText id="ak" v-model="form.accessKeyId" placeholder="输入AccessKey ID" />
      </div>
      <div class="field">
        <label for="sk">
          <Icon icon="mdi:shield-key-outline" width="14" height="14" />
          AccessKey Secret
        </label>
        <Password id="sk" v-model="form.accessKeySecret" placeholder="输入AccessKey Secret" toggleMask
          :feedback="false" />
      </div>
      <div class="field">
        <label for="bucket">
          <Icon icon="mdi:bucket-outline" width="14" height="14" />
          Bucket 名称
        </label>
        <InputText id="bucket" v-model="form.bucket" placeholder="例如：my-pic-bed" />
      </div>
      <div class="field">
        <label for="region">
          <Icon icon="mdi:earth" width="14" height="14" />
          Bucket 所在区域 (Region)
        </label>
        <Select id="region" v-model="form.region" :options="regionOptions" optionLabel="label" optionValue="value"
          placeholder="请选择 Bucket 所在区域" filter class="w-full" />
      </div>
      <div class="field">
        <label for="domain">
          <Icon icon="mdi:link-variant" width="14" height="14" />
          自定义域名 (可选)
        </label>
        <InputText id="domain" v-model="form.customDomain" placeholder="例如：https://img.example.com" />
      </div>

      <Button label="保存配置并测试连接" @click="saveConfig" :loading="isTesting" class="w-full mt-2" />
    </div>

    <Divider />

    <div class="section">
      <h3 class="section-title">
        <Icon icon="mdi:tune" width="16" height="16" />
        其他设置
      </h3>
      <div class="field">
        <label>
          <Icon icon="mdi:format-link" width="14" height="14" />
          默认链接格式
        </label>
        <Select v-model="selectedFormat" :options="linkFormats" optionLabel="label" placeholder="选择链接格式"
          class="w-full" />
      </div>
      <div class="field">
        <label>
          <Icon icon="mdi:compress" width="14" height="14" />
          上传前压缩图片
        </label>
        <div class="toggle-row">
          <ToggleSwitch v-model="settingsStore.enableCompression" />
          <span class="toggle-label">{{
            settingsStore.enableCompression ? "已开启" : "已关闭"
          }}</span>
        </div>
        <small>开启后上传图片前自动对图片进行压缩处理</small>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// use custom global scss styles variable
.settings-page {
  padding: 12px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: $cus-bg-color;
}

.section {
  margin-bottom: 14px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 14px;
  color: $cus-text-color;
  font-weight: 600;

  :deep(svg) {
    color: #f97316;
    flex-shrink: 0;
  }
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;

  label {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 4px;
    font-size: 13px;
    color: #475569;

    :deep(svg) {
      color: #94a3b8;
      flex-shrink: 0;
    }
  }

  small {
    margin-top: 2px;
    font-size: 11px;
    color: #94a3b8;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    gap: 8px;

    .toggle-label {
      font-size: 12px;
      color: #64748b;
    }
  }

  :deep(.p-inputtext),
  :deep(.p-password-input),
  :deep(.p-select) {
    width: 100%;
    font-size: 13px;
    padding: 6px 10px;
  }
}
</style>
