# ☁️ PicAliOSS

> **A professional, lightweight browser extension for Alibaba Cloud OSS image uploading, management, and link generation.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue.js-3.x-green.svg)](https://vuejs.org/)
[![WXT](https://img.shields.io/badge/WXT-Extension-blue.svg)](https://wxt.dev/)

[**English**](./README.md) | [**中文说明**](./README.zh-CN.md)

---

## 🌟 Overview

**PicAliOSS** is a powerful browser extension built with modern web technologies: `WXT`, `Vue 3`, `TypeScript`, `PrimeVue`, and `Pinia`. It is tailor-made for developers, designers, and content creators who require a seamless workflow for uploading images to **Alibaba Cloud OSS**, managing cloud assets, and generating shareable links with minimal friction.

Adopting a **pure frontend architecture**, PicAliOSS stores all OSS credentials securely within your local browser using AES encryption. No intermediate backend services are involved, ensuring maximum privacy and blazing-fast performance.

## ✨ Key Features

- **🎯 OSS-Centric Workflow**: Deeply optimized for Alibaba Cloud OSS image hosting.
- **🚀 Versatile Upload Methods**: Supports local file selection, drag-and-drop, full-page screenshot capturing, and clipboard image pasting.
- **🔗 Instant Link Generation**: Quickly copy your images as `URL`, `Markdown`, or `HTML` formats.
- **🖼️ Comprehensive Asset Management**: Built-in OSS explorer with search, preview, deletion, and batch operations.
- **⚙️ Intuitive Configuration**: Streamlined settings interface with region selection and real-time connection testing.
- **🔒 Secure Local Storage**: Sensitive OSS credentials are encrypted locally on the client side.
- **🛠️ Modern Engineering**: Robust development setup powered by `Vitest`, `Husky`, `VitePress`, with strict type-checking and code formatting.

## 💻 Tech Stack

- **Extension Framework**: `WXT`
- **Frontend Core**: `Vue 3` + `TypeScript`
- **State Management**: `Pinia`
- **UI Components**: `PrimeVue` + `PrimeIcons`
- **Cloud Storage SDK**: `ali-oss`
- **Build Tooling**: `Vite`
- **Testing**: `Vitest`
- **Documentation**: `VitePress`
- **Code Quality**: `Husky` + `oxlint` + `oxfmt`

## 🌐 Browser Support

- ✅ **Chrome / Edge** (and other Chromium-based browsers)
- ⚠️ **Firefox** (Build pipeline included; local verification recommended)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yxb123456cy/PicAliOSS.git
cd PicAliOSS
```

### 2. Install Dependencies

We highly recommend using `bun` for optimal performance:

```bash
bun install
```

### 3. Environment Configuration

Duplicate `.env.example` to create your local environment file:

```bash
cp .env.example .env.local
```

Fill in your OSS details in `.env.local`:

```env
VITE_ACCESSKEY_ID="your_access_key_id"
VITE_ACCESSKEY_SECRET="your_access_key_secret"
VITE_BUCKET="your_bucket_name"
VITE_REGION="your_region"
VITE_APP_EMOJI_ICON="🧡"
VITE_APP_NAME="PicAliOSS"
VITE_APP_VERSION="v0.1"
VITE_APP_AUTHOR="Your Name"
VITE_APP_DESCRIPTION="Lightweight Alibaba Cloud OSS browser extension."
VITE_APP_BIO="Built with WXT + Vue 3 + TypeScript + PrimeVue for seamless image management."
VITE_APP_REPOSITORY="https://github.com/yxb123456cy/PicAliOSS"
```

### 4. Start Development Server

```bash
bun run dev
```

For Firefox development:

```bash
bun run dev:firefox
```

_Note: Once started, load the generated output directory (`.output/`) via your browser's extension management page._

### 5. Build and Package

```bash
bun run build
bun run zip
```

## 🛠️ Common Commands

```bash
bun run dev            # Start Chrome/Chromium dev server
bun run dev:firefox    # Start Firefox dev server
bun run build          # Build for Chrome/Chromium
bun run build:firefox  # Build for Firefox
bun run zip            # Generate extension ZIP archive
bun run test:unit      # Execute unit tests
bun run typecheck      # Run TypeScript type checking
bun run lint           # Lint source code
bun run format:check   # Check code formatting
```

## 📖 Usage Guide

### 1. Configure OSS

Navigate to the **Settings** page within the extension and provide:

- `AccessKey ID`
- `AccessKey Secret`
- `Bucket`
- `Region`
- Custom Domain (Optional)

_Tip: Use the "Test Connection" button to verify your credentials before uploading._

### 2. Upload Images

- **Click**: Select files from your local system.
- **Drag & Drop**: Drop images directly into the upload zone.
- **Screenshot**: Capture the current webpage and upload it instantly.
- **Clipboard**: Paste images directly from your clipboard.

### 3. Manage Images

- Search through your uploaded OSS assets.
- Filter to display only image files, hiding unrelated bucket objects.
- Preview, copy links, download, or delete images.
- Utilize batch operations for efficient asset management.

## 📸 Screenshots

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

## 📁 Project Structure

```text
PicAliOSS/
├── src/                    # 📦 Source code directory
│   ├── entrypoints/        # Extension entrypoints: popup / background / content
│   │   └── popup/          # Popup UI: pages, routes, stores, and views
│   ├── utils/              # Core utilities: OSS, crypto, link formatting
│   ├── tests/              # Vitest unit tests
│   └── assets/             # Global styles, variables, and images
├── public/                 # 🖼️ Static assets and icons
├── docs/                   # 📚 VitePress documentation
├── screenshots/            # 📸 Extension screenshots
├── .husky/                 # 🐶 Git hooks
├── .env.example            # 🔐 Environment variables template
├── package.json            # 📦 Project metadata and dependencies
└── wxt.config.ts           # ⚙️ WXT & Manifest configuration
```

## 🗺️ Roadmap

- [ ] Advanced uploads: Large files, multipart uploads, and resumable uploads.
- [ ] Enhanced capabilities: Context-menu uploads, i18n support, and theme customization.
- [ ] CI/CD: Automated packaging and multi-browser release flows via GitHub Actions.
- [ ] Documentation: Comprehensive user guides and developer docs.

## 🤝 Contributing

We welcome all contributions! Here's how you can help:

- Open an **Issue** to report bugs or suggest new features.
- Submit a **Pull Request** to improve code, documentation, or tests.
- ⭐️ **Star** the repository to show your support!

Before submitting code, please ensure all checks pass:

```bash
bun run typecheck
bun run test:unit
```

## 📄 License

This project is licensed under the [MIT License](./License).

## 🏠 Repository

- **GitHub**: [https://github.com/yxb123456cy/PicAliOSS](https://github.com/yxb123456cy/PicAliOSS)
