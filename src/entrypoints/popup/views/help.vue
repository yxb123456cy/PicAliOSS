<script setup lang="ts">
import Accordion from "primevue/accordion";
import AccordionPanel from "primevue/accordionpanel";
import AccordionHeader from "primevue/accordionheader";
import AccordionContent from "primevue/accordioncontent";

const faqs = [
  {
    title: "如何配置阿里云OSS？",
    content:
      "1. 登录阿里云控制台，进入OSS管理控制台。\n2. 创建一个Bucket，读写权限建议设置为“公共读”。\n3. 获取AccessKey ID和AccessKey Secret（建议使用RAM子账号，并仅授予OSS管理权限）。\n4. 将这些信息填入插件的“设置”页面中即可。",
  },
  {
    title: "为什么上传失败？",
    content:
      "上传失败可能有以下原因：\n1. OSS配置错误：请检查AccessKey是否正确，Bucket和Region是否匹配。\n2. 网络问题：请检查您的网络连接。\n3. 文件大小超限：单张图片限制为50MB。\n4. 跨域问题：请在OSS控制台设置CORS，允许来自插件的跨域请求（建议设置来源为*，允许Methods为GET, POST, PUT, DELETE, HEAD，允许Headers为*）。",
  },
  {
    title: "图片列表加载缓慢？",
    content:
      "图片列表加载速度取决于您的网络以及OSS中的图片数量。插件已默认使用本地缓存以提升加载速度。如需查看最新图片，可点击列表页的“刷新”按钮。",
  },
];

const env = import.meta.env;

const pluginInfo = {
  emojiIcon: env.VITE_APP_EMOJI_ICON || "🧡",
  name: env.VITE_APP_NAME || "PicAliOSS",
  version: env.VITE_APP_VERSION || "v0.1",
  author: env.VITE_APP_AUTHOR || "程序员轻叶",
  description: env.VITE_APP_DESCRIPTION || "轻量级阿里云 OSS 图床浏览器插件。",
  bio:
    env.VITE_APP_BIO ||
    "基于 WXT + Vue 3 + TypeScript + PrimeVue 构建，专注图片上传、管理与链接生成。",
  repository: env.VITE_APP_REPOSITORY || "https://github.com/yxb123456cy/PicAliOSS",
};

const techStacks = [
  {
    emoji: "🧩",
    title: "WXT + Manifest V3",
    description:
      "负责浏览器插件工程化、开发热更新、入口拆分与后续 Chrome / Firefox / Edge 的扩展适配基础。",
  },
  {
    emoji: "💚",
    title: "Vue 3 + Composition API",
    description:
      "承载 Popup 界面与交互逻辑，适合拆分上传、管理、设置、帮助等功能视图，保证界面迭代效率。",
  },
  {
    emoji: "🔷",
    title: "TypeScript",
    description:
      "为 OSS 配置、图片列表、工具函数和状态管理提供类型约束，降低插件长期维护时的回归风险。",
  },
  {
    emoji: "🎨",
    title: "PrimeVue",
    description: "提供统一的组件体系与主题能力，适配插件小窗场景，当前已结合品牌主色做视觉定制。",
  },
  {
    emoji: "☁️",
    title: "Aliyun OSS SDK",
    description: "负责图片上传、文件查询、链接生成与资源删除，是整个图床能力的核心存储服务层。",
  },
  {
    emoji: "🔐",
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
            <p style="white-space: pre-wrap; font-size: 14px; color: #475569; margin: 0">
              {{ faq.content }}
            </p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>

    <div class="section">
      <h3 class="section-title">关于</h3>
      <div class="about-info">
        <div class="about-hero">
          <div class="icon-box">{{ pluginInfo.emojiIcon }}</div>
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
              <div class="tech-icon">{{ item.emoji }}</div>
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
// use custom global scss styles variable
.help-page {
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

.about-info {
  background: white;
  padding: 18px;
  border-radius: $cus-border-radius;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  color: #475569;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);

  .about-hero {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid #f1f5f9;
  }

  .icon-box {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    background: linear-gradient(135deg, #fff2eb 0%, #ffe2d5 100%);
    box-shadow: inset 0 0 0 1px #ffd2bd;
    flex-shrink: 0;
  }

  .hero-content {
    min-width: 0;
    flex: 1;
  }

  .hero-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }

  h4 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
  }

  .version-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    color: #c2410c;
    background: #fff1eb;
    border: 1px solid #fed7c3;
  }

  .hero-description,
  .hero-bio {
    margin: 0;
    line-height: 1.6;
  }

  .hero-description {
    color: #334155;
    font-weight: 500;
  }

  .hero-bio {
    margin-top: 6px;
    color: #64748b;
  }

  .meta-grid {
    display: grid;
    gap: 12px;
    margin-bottom: 18px;
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }

  .meta-label {
    font-size: 12px;
    color: #64748b;
  }

  .meta-value,
  .meta-link {
    font-size: 14px;
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
    margin: 0 0 12px 0;
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
  }

  .tech-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .tech-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px;
    border-radius: 12px;
    background: linear-gradient(180deg, #ffffff 0%, #fffaf7 100%);
    border: 1px solid #f1f5f9;
  }

  .tech-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    background: #fff2eb;
    flex-shrink: 0;
  }

  .tech-content {
    min-width: 0;
  }

  .tech-name {
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
  }

  p {
    margin: 0;
    line-height: 1.6;

    color: #64748b;
  }
}
</style>
