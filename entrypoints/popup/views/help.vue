<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";
import { version } from '../../../package.json'
const faqs = [
  {
    title: "如何配置阿里云OSS？",
    content:
      "1. 登录阿里云控制台，进入OSS管理控制台。\n2. 创建一个Bucket，读写权限建议设置为\u201C公共读\u201D。\n3. 获取AccessKey ID和AccessKey Secret（建议使用RAM子账号，并仅授予OSS管理权限）。\n4. 将这些信息填入插件的\u201C设置\u201D页面中即可。",
  },
  {
    title: "为什么上传失败？",
    content:
      "上传失败可能有以下原因：\n1. OSS配置错误：请检查AccessKey是否正确，Bucket和Region是否匹配。\n2. 网络问题：请检查您的网络连接。\n3. 文件大小超限：单张图片限制为50MB。\n4. 跨域问题：请在OSS控制台设置CORS，允许来自插件的跨域请求（建议设置来源为*，允许Methods为GET, POST, PUT, DELETE, HEAD，允许Headers为*）。",
  },
  {
    title: "图片列表加载缓慢？",
    content:
      "图片列表加载速度取决于您的网络以及OSS中的图片数量。插件已默认使用本地缓存以提升加载速度。如需查看最新图片，可点击列表页的\u201C刷新\u201D按钮。",
  },
];

const env = import.meta.env;

const pluginInfo = {
  name: env.VITE_APP_NAME || "PicAliOSS",
  version: env.VITE_APP_VERSION || `V${version}`,
  author: env.VITE_APP_AUTHOR || "程序员轻叶",
  description: env.VITE_APP_DESCRIPTION || "轻量级阿里云 OSS 图床浏览器插件。",
  bio:
    env.VITE_APP_BIO ||
    "基于 WXT + Vue 3 + TypeScript + PrimeVue 构建，专注图片上传、管理与链接生成。",
  repository: env.VITE_APP_REPOSITORY || "https://github.com/yxb123456cy/PicAliOSS",
};

const techStacks = [
  {
    icon: "mdi:puzzle-outline",
    title: "WXT + Manifest V3",
    description:
      "负责浏览器插件工程化、开发热更新、入口拆分与后续 Chrome / Firefox / Edge 的扩展适配基础。",
  },
  {
    icon: "mdi:vuejs",
    title: "Vue 3 + Composition API",
    description:
      "承载 Popup 界面与交互逻辑，适合拆分上传、管理、设置、帮助等功能视图，保证界面迭代效率。",
  },
  {
    icon: "mdi:language-typescript",
    title: "TypeScript",
    description:
      "为 OSS 配置、图片列表、工具函数和状态管理提供类型约束，降低插件长期维护时的回归风险。",
  },
  {
    icon: "mdi:palette-outline",
    title: "PrimeVue",
    description: "提供统一的组件体系与主题能力，适配插件小窗场景，当前已结合品牌主色做视觉定制。",
  },
  {
    icon: "mdi:cloud-outline",
    title: "Aliyun OSS SDK",
    description: "负责图片上传、文件查询、链接生成与资源删除，是整个图床能力的核心存储服务层。",
  },
  {
    icon: "mdi:shield-key-outline",
    title: "Chrome Storage + AES",
    description:
      "用于本地保存并加密 OSS 配置，尽量避免明文暴露敏感信息，兼顾插件端易用性与基础安全性。",
  },
];
</script>

<template>
  <div class="help-page">
    <div class="section">
      <h3 class="section-title">常见问题 (FAQ)</h3>
      <Accordion :value="0">
        <AccordionPanel v-for="(faq, index) in faqs" :key="index" :value="index">
          <AccordionHeader>{{ faq.title }}</AccordionHeader>
          <AccordionContent>
            <p class="faq-content">{{ faq.content }}</p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>

    <div class="section">
      <h3 class="section-title">关于</h3>
      <div class="about-info">
        <div class="about-hero">
          <div class="icon-box">
            <Icon icon="mdi:cloud-upload-outline" width="22" height="22" />
          </div>
          <div class="hero-content">
            <div class="hero-title-row">
              <h4>{{ pluginInfo.name }}</h4>
              <span class="version-badge">{{ pluginInfo.version }}</span>
            </div>
            <p class="hero-description">{{ pluginInfo.description }}</p>
            <p class="hero-bio">{{ pluginInfo.bio }}</p>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-item">
            <span class="meta-label">作者</span>
            <span class="meta-value">{{ pluginInfo.author }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">仓库地址</span>
            <a class="meta-link" :href="pluginInfo.repository" target="_blank" rel="noreferrer">
              {{ pluginInfo.repository }}
            </a>
          </div>
        </div>

        <div class="tech-section">
          <h4 class="tech-title">技术栈说明</h4>
          <div class="tech-list">
            <div v-for="item in techStacks" :key="item.title" class="tech-item">
              <div class="tech-icon">
                <Icon :icon="item.icon" width="16" height="16" />
              </div>
              <div class="tech-content">
                <div class="tech-name">{{ item.title }}</div>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.help-page {
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
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 14px;
  color: $cus-text-color;
  font-weight: 600;
}

.faq-content {
  white-space: pre-wrap;
  font-size: 12px;
  color: #475569;
  margin: 0;
  line-height: 1.5;
}

.about-info {
  background: white;
  padding: 12px;
  border-radius: $cus-border-radius;
  border: 1px solid #e2e8f0;
  font-size: 13px;
  color: #475569;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);

  .about-hero {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #f1f5f9;
  }

  .icon-box {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fff2eb 0%, #ffe2d5 100%);
    box-shadow: inset 0 0 0 1px #ffd2bd;
    flex-shrink: 0;
    color: #f97316;
  }

  .hero-content {
    min-width: 0;
    flex: 1;
  }

  .hero-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 5px;
  }

  h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
  }

  .version-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    color: #c2410c;
    background: #fff1eb;
    border: 1px solid #fed7c3;
  }

  .hero-description,
  .hero-bio {
    margin: 0;
    line-height: 1.4;
    font-size: 13px;
  }

  .hero-description {
    color: #334155;
    font-weight: 500;
  }

  .hero-bio {
    margin-top: 4px;
    color: #64748b;
  }

  .meta-grid {
    display: grid;
    gap: 8px;
    margin-bottom: 12px;
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 8px;
    border-radius: 8px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }

  .meta-label {
    font-size: 11px;
    color: #64748b;
  }

  .meta-value,
  .meta-link {
    font-size: 13px;
    color: #0f172a;
    font-weight: 600;
    word-break: break-all;
    text-decoration: none;
  }

  .meta-link:hover {
    color: #ff5000;
  }

  .tech-section {
    padding-top: 4px;
  }

  .tech-title {
    margin: 0 0 8px 0;
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
  }

  .tech-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .tech-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 8px;
    border-radius: 8px;
    background: linear-gradient(180deg, #ffffff 0%, #fffaf7 100%);
    border: 1px solid #f1f5f9;
  }

  .tech-icon {
    width: 26px;
    height: 26px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff2eb;
    flex-shrink: 0;
    color: #f97316;
  }

  .tech-content {
    min-width: 0;
  }

  .tech-name {
    margin-bottom: 2px;
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
  }

  p {
    margin: 0;
    line-height: 1.4;
    font-size: 12px;
    color: #64748b;
  }
}
</style>
