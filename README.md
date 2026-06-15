# PicAliOSS

> 轻量级阿里云 OSS 图床浏览器插件，专注图片上传、管理与链接生成。

[English README](./README.en.md) | [项目需求文档](./REQUMENTS.md)

## 项目简介

PicAliOSS 是一个基于 `WXT + Vue 3 + TypeScript + PrimeVue + Pinia` 构建的浏览器插件，面向需要高频上传图片、管理 OSS 资源并快速复制外链的开发者、设计师与内容创作者。

项目坚持纯前端实现，阿里云 OSS 配置保存在本地浏览器侧，并对敏感信息进行本地加密处理；不依赖自建后端服务，开箱即可完成图床上传与基础管理。

## 核心能力

- 阿里云 OSS 专用图床：围绕 OSS 上传、管理、链接生成做深度优化
- 多种上传方式：支持本地文件选择、拖拽上传、截图上传、剪贴板上传
- 快速链接分发：支持复制 `URL`、`Markdown`、`HTML` 等常见链接格式
- 图片管理面板：支持列表浏览、关键词搜索、图片预览、删除与批量操作
- 设置体验优化：支持 OSS 区域下拉选择、连接测试、默认参数集中配置
- 本地安全存储：敏感配置仅保存在本地，并通过 AES 做基础加密处理
- 工程化完善：集成 `Vitest`、`Husky`、`VitePress`、类型检查与规范化脚本

## 技术栈

- Extension Framework: `WXT`
- Frontend: `Vue 3` + `TypeScript`
- State Management: `Pinia`
- UI Library: `PrimeVue` + `PrimeIcons`
- Cloud Storage: `ali-oss`
- Build Tooling: `Vite`
- Testing: `Vitest`
- Documentation: `VitePress`
- Code Quality: `Husky` + `oxlint` + `oxfmt`

## 浏览器支持

- Chrome / Edge 等 Chromium 内核浏览器
- Firefox 构建链路已接入，开发链路仍建议结合实际环境验证

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/yxb123456cy/PicAliOSS.git
cd PicAliOSS
```

### 2. 安装依赖

推荐使用 `bun`：

```bash
bun install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env.local`，并填写你的 OSS 配置：

```bash
cp .env.example .env.local
```

```env
VITE_ACCESSKEY_ID=""
VITE_ACCESSKEY_SECRET=""
VITE_BUCKET=""
VITE_REGION=""
VITE_APP_EMOJI_ICON="🧡"
VITE_APP_NAME="PicAliOSS"
VITE_APP_VERSION="v0.1"
VITE_APP_AUTHOR="程序员轻叶"
VITE_APP_DESCRIPTION="轻量级阿里云 OSS 图床浏览器插件。"
VITE_APP_BIO="基于 WXT + Vue 3 + TypeScript + PrimeVue 构建，专注图片上传、管理与链接生成。"
VITE_APP_REPOSITORY="https://github.com/yxb123456cy/PicAliOSS"
```

### 4. 启动开发

```bash
bun run dev
```

如果需要 Firefox 开发构建：

```bash
bun run dev:firefox
```

启动后可在浏览器扩展管理页加载开发产物目录。

### 5. 构建与打包

```bash
bun run build
bun run zip
```

## 常用命令

```bash
bun run dev            # Chrome/Chromium 开发模式
bun run dev:firefox    # Firefox 开发模式
bun run build          # Chrome/Chromium 构建
bun run build:firefox  # Firefox 构建
bun run zip            # 生成压缩包
bun run test:unit      # 运行单元测试
bun run typecheck      # TypeScript 类型检查
bun run lint           # 代码检查
bun run format:check   # 格式检查
```

## 使用流程

### 1. 配置 OSS

在插件 `设置` 页填写以下信息：

- `AccessKey ID`
- `AccessKey Secret`
- `Bucket`
- `Region`
- 自定义域名（可选）

点击“测试连接”确认配置生效后，即可开始上传。

### 2. 上传图片

- 点击上传：从本地选择一个或多个图片文件
- 拖拽上传：将图片拖入上传区域
- 截图上传：截取当前页面后直接上传
- 剪贴板上传：检测剪贴板中的图片并快速上传

### 3. 管理图片

- 搜索 OSS 中已上传图片
- 仅展示图片类型文件，减少非图片对象干扰
- 预览、复制链接、下载与删除图片
- 支持批量操作提升管理效率

## 插件截图

### 插件安装

![浏览器扩展安装视图](./screenshots/ext.png)

### OSS 配置

![阿里云 OSS 配置页](./screenshots/settings.png)

### 上传入口

![上传页](./screenshots/upload.png)

### 上传成功

![上传成功提示](./screenshots/upload_success.png)

### 图片管理

![图片管理列表](./screenshots/list.png)

### 列表刷新

![图片列表刷新成功](./screenshots/get_success.png)

### 帮助页面

![帮助与常见问题页面](./screenshots/help.png)

## 项目结构

```text
PicAliOSS/
├── entrypoints/          # 插件入口：popup / background / content
├── entrypoints/popup/    # Popup 页面、路由、状态管理与视图
├── utils/                # OSS、加密、链接、区域等工具函数
├── tests/                # Vitest 单元测试
├── public/               # 图标与静态资源
├── assets/               # 全局样式与主题变量
├── docs/                 # VitePress 文档
├── .husky/               # Git Hooks
├── .env.example          # 环境变量示例
├── package.json          # 项目元数据与脚本
└── wxt.config.ts         # WXT / Manifest 配置
```

## Roadmap

- 更多上传能力：大文件、分片上传、断点续传
- 更丰富的扩展能力：网页图片右键上传、国际化、多主题切换
- 自动化发布：GitHub Actions 打包与多浏览器发布流程
- 文档完善：持续补充使用手册与开发文档

## 参与贡献

欢迎通过以下方式参与项目建设：

- 提交 `Issue` 反馈 Bug 或产品建议
- 提交 `Pull Request` 改进代码、文档或测试
- Star 本仓库，帮助项目获得更多反馈

如果你准备贡献代码，建议先执行：

```bash
bun run typecheck
bun run test:unit
```

## License

本项目基于 [MIT License](./License) 开源。

## 仓库地址

- GitHub: [https://github.com/yxb123456cy/PicAliOSS](https://github.com/yxb123456cy/PicAliOSS)
