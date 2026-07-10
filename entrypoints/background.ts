/**
 * Service Worker 环境 Polyfill
 * 必须在 ali-oss SDK 加载前补全 SW 缺失的浏览器 API
 */
if (typeof location === "undefined") {
  (globalThis as any).location = { protocol: "https:" };
}
if (typeof atob === "undefined") {
  (globalThis as any).atob = (s: string) =>
    String.fromCharCode(...new Uint8Array([...s].map((c) => c.charCodeAt(0))));
}
if (typeof window === "undefined") {
  (globalThis as any).window = globalThis;
}

// 静态导入 — 不依赖 DOM/ali-oss，SW 安全
import { decrypt } from "@/utils/crypto";
import { formatLink } from "@/utils/link";
import type { LinkFormat, OssConfig } from "@/typings";

const OSS_CONFIG_KEY = "ossConfig";
const APP_SETTINGS_KEY = "appSettings";

interface Q {
  appSettings: {
    enableCompression: boolean;
    linkFormat: LinkFormat;
  };
}
// ============================================================
// background 是一个无界面、轻量级的后台 Service Worker
// 事件驱动，闲置约 30 秒后自动休眠
// ============================================================
export default defineBackground(() => {
  console.log("PicAliOSS Background Service Worker", { id: browser.runtime.id });

  // ---- 创建右键上下文菜单 ----
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: "upload-to-oss",
      title: "上传至阿里云OSS",
      contexts: ["image"],
    });
  });

  // SW 每次唤醒时也注册（幂等，相同 id 不会重复创建）
  browser.contextMenus.create({
    id: "upload-to-oss",
    title: "上传至阿里云OSS",
    contexts: ["image"],
  });

  // ---- 处理右键菜单点击 ----
  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== "upload-to-oss") return;
    if (!info.srcUrl || !tab?.id) return;

    const imageUrl = info.srcUrl;
    console.log("[PicAliOSS] 右键上传:", imageUrl);
    try {
      // 1. 读取并解密 OSS 配置
      const storageResult = await chrome.storage.local.get(OSS_CONFIG_KEY);
      const encrypted = storageResult[OSS_CONFIG_KEY] as string | undefined;
      if (!encrypted) {
        showNotification("请先在插件设置中配置阿里云OSS信息");
        return;
      }
      const decryptedStr = decrypt(encrypted);
      if (!decryptedStr) {
        showNotification("OSS配置解密失败，请重新保存设置");
        return;
      }
      const config: OssConfig = JSON.parse(decryptedStr);
      if (!config.accessKeyId || !config.accessKeySecret || !config.bucket || !config.region) {
        showNotification("OSS配置不完整，请检查设置");
        return;
      }
      // 2. 下载图片为 File
      const file = await fetchImageAsFile(imageUrl);
      console.log("[PicAliOSS] 图片已下载:", file.name, file.size);
      // 3. 读取用户偏好（压缩开关、链接格式）
      const settingsResult: Q = await chrome.storage.local.get(APP_SETTINGS_KEY);
      const appSettings = settingsResult[APP_SETTINGS_KEY];
      const enableCompression: boolean = appSettings?.enableCompression ?? true;
      const linkFormat: LinkFormat = appSettings?.linkFormat ?? "markdown";
      // 4. 动态导入 oss 模块（确保 polyfill 先生效，ali-oss 此时才加载）
      const { uploadImageToOss, uploadImageToOssNotCompress } = await import("@/utils/oss");
      // 5. 上传
      let uploadResult;
      if (enableCompression) {
        // SW 中 Web Worker 不可用，压缩失败会自动降级为原图上传
        uploadResult = await uploadImageToOss(config, file, undefined, true);
      } else {
        uploadResult = await uploadImageToOssNotCompress(config, file);
      }
      if (!uploadResult.success || !uploadResult.url) {
        throw new Error("上传返回结果异常");
      }
      console.log("[PicAliOSS] 上传成功:", uploadResult.url);
      // 6. 格式化链接 → 剪贴板
      const formattedLink = formatLink(uploadResult.url, file.name, linkFormat);
      await copyToClipboard(formattedLink);
      // 7. 通知
      showNotification("上传成功，链接已复制到剪贴板", formattedLink);
    } catch (error: any) {
      console.error("[PicAliOSS] 上传失败:", error);
      showNotification(`上传失败: ${error.message || "未知错误"}`);
    }
  });
});

/**
 * 辅助函数
 */

/**
 * 从 URL 下载图片，返回 File 对象
 */
async function fetchImageAsFile(url: string): Promise<File> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`下载图片失败: HTTP ${response.status}`);
  }
  const blob = await response.blob();
  const urlPath = url.split("?")[0];
  const filename = urlPath.split("/").pop() || "image.png";
  return new File([blob], filename, { type: blob.type || "image/png" });
}

/**
 * 写入系统剪贴板
 * SW 中 navigator.clipboard.writeText 可用（Chrome 116+）
 * 用户已通过右键点击聚焦页面，clipboard API 可正常工作
 */
async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("[PicAliOSS] 已复制到剪贴板");
  } catch (error) {
    console.warn("[PicAliOSS] 剪贴板写入失败:", error);
  }
}

/**
 * 发送系统通知
 */
function showNotification(message: string, contextMessage?: string) {
  browser.notifications.create({
    type: "basic",
    iconUrl: "icon/icon-128.png",
    title: "PicAliOSS",
    message,
    contextMessage,
  });
}
