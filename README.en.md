# PicAliOSS

> A lightweight browser extension for Alibaba Cloud OSS image uploading, management, and link generation.

[中文说明](./README.md) | [Requirements](./REQUMENTS.md)

## Overview

PicAliOSS is a browser extension built with `WXT`, `Vue 3`, `TypeScript`, `PrimeVue`, and `Pinia`. It is designed for developers, designers, and creators who need to upload images to Alibaba Cloud OSS, manage stored assets, and copy shareable links with minimal friction.

The project follows a frontend-only architecture. OSS credentials are stored locally in the browser and sensitive values are encrypted on the client side. No custom backend service is required.

## Features

- OSS-focused image hosting workflow for Alibaba Cloud OSS
- Multiple upload methods: local file picker, drag and drop, screenshot upload, clipboard upload
- Quick link generation for `URL`, `Markdown`, and `HTML`
- Built-in image management with search, preview, delete, and batch operations
- Better settings UX with region select options and connection testing
- Local encrypted storage for sensitive OSS configuration
- Engineering tooling with `Vitest`, `Husky`, `VitePress`, type checking, and lint/format scripts

## Tech Stack

- Extension Framework: `WXT`
- Frontend: `Vue 3` + `TypeScript`
- State Management: `Pinia`
- UI Library: `PrimeVue` + `PrimeIcons`
- Cloud Storage: `ali-oss`
- Build Tooling: `Vite`
- Testing: `Vitest`
- Documentation: `VitePress`
- Code Quality: `Husky` + `oxlint` + `oxfmt`

## Browser Support

- Chrome / Edge and other Chromium-based browsers
- Firefox target is included, but its development workflow should still be verified in your local environment

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yxb123456cy/PicAliOSS.git
cd PicAliOSS
```

### 2. Install dependencies

`bun` is recommended:

```bash
bun install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your OSS configuration:

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

### 4. Start development

```bash
bun run dev
```

For Firefox development:

```bash
bun run dev:firefox
```

After startup, load the generated development directory from your browser's extension management page.

### 5. Build and package

```bash
bun run build
bun run zip
```

## Common Commands

```bash
bun run dev            # Chrome/Chromium development
bun run dev:firefox    # Firefox development
bun run build          # Chrome/Chromium build
bun run build:firefox  # Firefox build
bun run zip            # Generate extension archive
bun run test:unit      # Run unit tests
bun run typecheck      # TypeScript type checking
bun run lint           # Lint code
bun run format:check   # Check formatting
```

## Usage

### 1. Configure OSS

Open the `Settings` page in the extension and fill in:

- `AccessKey ID`
- `AccessKey Secret`
- `Bucket`
- `Region`
- Custom domain (optional)

Use the "Test Connection" action to verify the configuration before uploading.

### 2. Upload Images

- Click upload: select one or more local image files
- Drag and drop: drop image files into the upload area
- Screenshot upload: capture the current page and upload it directly
- Clipboard upload: detect images in the clipboard and upload them quickly

### 3. Manage Images

- Search uploaded images in OSS
- Display image files only to avoid unrelated objects
- Preview, copy links, download, and delete images
- Use batch operations for faster management

## Screenshots

### Extension Installed

![Extension installation view](./screenshots/ext.png)

### OSS Settings

![Alibaba Cloud OSS settings page](./screenshots/settings.png)

### Upload Entry

![Upload page](./screenshots/upload.png)

### Upload Completed

![Upload success message](./screenshots/upload_success.png)

### Image Management

![Image management list](./screenshots/list.png)

### List Refresh

![Image list refreshed successfully](./screenshots/get_success.png)

### Help Page

![Help and FAQ page](./screenshots/help.png)

## Project Structure

```text
PicAliOSS/
├── entrypoints/          # Extension entrypoints: popup / background / content
├── entrypoints/popup/    # Popup pages, routes, stores, and views
├── utils/                # OSS, crypto, link, and region utilities
├── tests/                # Vitest unit tests
├── public/               # Icons and static assets
├── assets/               # Global styles and theme variables
├── docs/                 # VitePress documentation
├── .husky/               # Git hooks
├── .env.example          # Environment variable template
├── package.json          # Project metadata and scripts
└── wxt.config.ts         # WXT / manifest configuration
```

## Roadmap

- Large file uploads, multipart uploads, and resumable uploads
- Richer extension capabilities such as context-menu upload, i18n, and theme switching
- Automated packaging and multi-browser release flow with GitHub Actions
- More complete user and developer documentation

## Contributing

Contributions are welcome:

- Open an `Issue` for bugs or feature ideas
- Submit a `Pull Request` for code, docs, or test improvements
- Star the repository to support the project

Before contributing code, it is recommended to run:

```bash
bun run typecheck
bun run test:unit
```

## License

This project is released under the [MIT License](./License).

## Repository

- GitHub: [https://github.com/yxb123456cy/PicAliOSS](https://github.com/yxb123456cy/PicAliOSS)
