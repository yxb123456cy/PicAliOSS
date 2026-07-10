import { createApp } from "vue";
import QuickUploader from "./components/QuickUploader.vue";
import { uploadImageToOss } from "@/utils/oss";
import type { LinkFormat, OssConfig } from "@/typings";

interface AppSettings {
  enableCompression: boolean;
  linkFormat: LinkFormat;
}

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    console.log("[ContentScript] 初始化快捷上传组件");

    let uploaderInstance: any = null;

    // 注册全局上传处理函数
    (window as any).__quickUploaderHandler = async (files: File[]) => {
      console.log("[ContentScript] 收到上传请求", files);
      await handleUpload(files, uploaderInstance);
    };

    // 创建 UI 容器
    const ui = await createShadowRootUi(ctx, {
      name: "quick-uploader-ui",
      position: "inline",
      onMount: (container) => {
        console.log("[ContentScript] 挂载 UI 组件");
        const app = createApp(QuickUploader);
        uploaderInstance = app.mount(container);
        console.log("[ContentScript] 组件实例:", uploaderInstance);
        return app;
      },
      onRemove: (app) => {
        app?.unmount();
        delete (window as any).__quickUploaderHandler;
      },
    });

    ui.mount();
    console.log("[ContentScript] 快捷上传组件已挂载");
  },
});

/**
 * 处理文件上传
 */
async function handleUpload(files: File[], uploaderInstance: any) {
  console.log("[QuickUploader] 开始上传", files);

  try {
    // 从 storage 获取 OSS 配置
    const result = await chrome.storage.local.get("ossConfig");
    const storedConfig = result.ossConfig as string | undefined;

    if (!storedConfig) {
      console.error("[QuickUploader] 未找到 OSS 配置");
      showNotification("配置错误", "请先在插件中配置 OSS 信息", "error");
      uploaderInstance?.finishUpload();
      return;
    }

    // 解密配置
    const { decrypt } = await import("@/utils/crypto");
    const decryptedStr = decrypt(storedConfig);

    if (!decryptedStr) {
      console.error("[QuickUploader] OSS 配置解密失败");
      showNotification("配置错误", "OSS 配置解密失败", "error");
      uploaderInstance?.finishUpload();
      return;
    }

    const ossConfig: OssConfig = JSON.parse(decryptedStr);
    console.log("[QuickUploader] OSS 配置加载成功");

    // 获取压缩设置
    const settingsResult = await chrome.storage.local.get("appSettings");
    const settings = settingsResult.appSettings as AppSettings | undefined;
    const enableCompression = settings?.enableCompression ?? true;

    console.log("[QuickUploader] 压缩设置:", enableCompression);

    // 上传文件
    let successCount = 0;
    let failCount = 0;
    let lastUrl = "";

    for (const file of files) {
      try {
        console.log("[QuickUploader] 开始上传文件:", file.name);
        const result = await uploadImageToOss(ossConfig, file, undefined, enableCompression);
        console.log("[QuickUploader] 上传结果:", result);

        if (result.success) {
          successCount++;
          lastUrl = result.url;
          console.warn("[QuickUploader] 最后一张图片链接:", lastUrl);
          // 复制最后一张图片链接到剪贴板
          try {
            await navigator.clipboard.writeText(result.url);
          } catch (clipError) {
            console.warn("[QuickUploader] 剪贴板写入失败:", clipError);
          }
        } else {
          failCount++;
        }
      } catch (error) {
        failCount++;
        console.error("[QuickUploader] 上传失败:", error);
      }
    }

    // 显示通知
    if (successCount > 0 && failCount === 0) {
      showNotification(
        "上传成功",
        `成功上传 ${successCount} 张图片，链接已复制到剪贴板`,
        "success",
      );
    } else if (successCount > 0 && failCount > 0) {
      showNotification("部分成功", `成功: ${successCount} 张，失败: ${failCount} 张`, "warning");
    } else {
      showNotification("上传失败", `所有图片上传失败`, "error");
    }
  } catch (error) {
    console.error("[QuickUploader] 上传错误:", error);
    showNotification("上传失败", String(error), "error");
  } finally {
    console.log("[QuickUploader] 上传完成，重置状态");
    uploaderInstance?.finishUpload();
  }
}

/**
 * 显示 Chrome 原生通知
 */
function showNotification(
  title: string,
  message: string,
  type: "success" | "error" | "warning" = "success",
) {
  const iconMap = {
    success: chrome.runtime.getURL("icon/icon-128.png"),
    error: chrome.runtime.getURL("icon/icon-128.png"),
    warning: chrome.runtime.getURL("icon/icon-128.png"),
  };

  chrome.runtime.sendMessage({
    type: "SHOW_NOTIFICATION",
    payload: {
      title,
      message,
      iconUrl: iconMap[type],
      notificationType: type,
    },
  });
}
