<script setup lang="ts">
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

const faqs = [
  {
    title: '如何配置阿里云OSS？',
    content: '1. 登录阿里云控制台，进入OSS管理控制台。\n2. 创建一个Bucket，读写权限建议设置为“公共读”。\n3. 获取AccessKey ID和AccessKey Secret（建议使用RAM子账号，并仅授予OSS管理权限）。\n4. 将这些信息填入插件的“设置”页面中即可。'
  },
  {
    title: '为什么上传失败？',
    content: '上传失败可能有以下原因：\n1. OSS配置错误：请检查AccessKey是否正确，Bucket和Region是否匹配。\n2. 网络问题：请检查您的网络连接。\n3. 文件大小超限：单张图片限制为50MB。\n4. 跨域问题：请在OSS控制台设置CORS，允许来自插件的跨域请求（建议设置来源为*，允许Methods为GET, POST, PUT, DELETE, HEAD，允许Headers为*）。'
  },
  {
    title: '图片列表加载缓慢？',
    content: '图片列表加载速度取决于您的网络以及OSS中的图片数量。插件已默认使用本地缓存以提升加载速度。如需查看最新图片，可点击列表页的“刷新”按钮。'
  }
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
            <p style="white-space: pre-wrap; font-size: 14px; color: #475569; margin: 0;">{{ faq.content }}</p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>

    <div class="section">
      <h3 class="section-title">关于</h3>
      <div class="about-info">
        <p><strong>PicAliOSS</strong> v1.0-beta</p>
        <p>轻量级阿里云OSS图床浏览器插件。</p>
        <p>基于 WXT + Vue3 + TypeScript 构建。</p>
        <p><strong>插件作者</strong> 程序员轻叶</p>
        <p><strong>插件版本</strong> v1.0-beta</p>
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
  padding: 16px;
  border-radius: $cus-border-radius;
  border: 1px solid #e2e8f0;
  font-size: 14px;
  color: #475569;

  p {
    margin: 0 0 8px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
