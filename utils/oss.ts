import { OssConfig } from "@/typings";
import OSS from "ali-oss";
// import imageCompression, { Options as CompressionOptions } from "browser-image-compression";

let ossClient: OSS | null = null;
let currentClientKey = "";
// 定义图片扩展名集合;
const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".bmp",
  ".svg",
  ".avif",
  ".heic",
  ".heif",
]);

/**
 * @description 检查文件是否为图片文件;
 * @param name 文件名;
 * @returns 是否为图片文件;
 */
const isImageFile = (name: string) => {
  // 去除空格并转换为小写;
  const normalizedName = name.trim().toLowerCase();
  // 检查文件名是否以图片扩展名结尾;有一个符合就行;
  return Array.from(IMAGE_EXTENSIONS).some((ext) => normalizedName.endsWith(ext));
};

/**
 * @description 获取阿里云OSS客户端实例;
 * @param config OSS配置;
 * @returns OSS客户端实例;
 */
export const getOssClient = (config: OssConfig) => {
  if (
    !config ||
    !config.accessKeyId ||
    !config.accessKeySecret ||
    !config.bucket ||
    !config.region
  ) {
    throw new Error("OSS Config is missing required fields");
  }

  const nextClientKey = JSON.stringify({
    accessKeyId: config.accessKeyId,
    accessKeySecret: config.accessKeySecret,
    bucket: config.bucket,
    region: config.region,
  });

  if (!ossClient || currentClientKey !== nextClientKey) {
    ossClient = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
      secure: true,
      // 使用 fetch API，兼容 Service Worker 环境
      // @ts-ignore
      useFetch: true,
    });
    currentClientKey = nextClientKey;
  }

  return ossClient;
};

/**
 * @description 测试阿里云OSS连接是否成功;
 * @param config OSS配置;
 * @returns 测试结果;
 */
export const testOssConnection = async (config: OssConfig) => {
  try {
    const client = getOssClient(config);
    // list buckets or just put an empty file to test
    // actually `listBuckets` requires full permission, `list` is safer if the key only has bucket permissions
    await client.listV2({ "max-keys": 1 });
    return { success: true, message: "配置成功" };
  } catch (error: any) {
    return { success: false, message: error.message || "连接失败" };
  }
};
export const uploadImageToOssNotCompress = async (config: OssConfig, file: File, _renamePattern?: string) => {
  const client = getOssClient(config);
  const timestamp = Date.now();
  const filename = `${timestamp}_${file.name}`;
  try {
    const result = await client.put(filename, file);
    let url = result.url;
    // Apply custom domain if configured
    if (config.customDomain) {
      let cleanDomain = config.customDomain.replace(/\/$/, "");
      if (!cleanDomain.startsWith("http")) {
        cleanDomain = `https://${cleanDomain}`;
      }
      url = `${cleanDomain}/${result.name}`;
    }
    return { success: true, url, name: result.name };
  } catch (error: any) {
    console.error("OSS Upload Error", error);
    throw new Error(error.message || "上传失败");
  }
};
/**
 * @description 上传图片到阿里云OSS;
 * @param config OSS配置;
 * @param file 待上传的图片文件;
 * @param renamePattern 重命名模式;
 * @returns 上传结果;
 */
export const uploadImageToOss = async (
  config: OssConfig,
  file: File,
  _renamePattern?: string,
  enableCompression?: boolean,
) => {
  // 动态加载：只在函数被调用时才加载
  const imageCompression = await import('browser-image-compression');
  let upFile = file;
  if (enableCompression !== false) {
    const options = {
      maxSizeMB: 1, // 目标最大体积 (MB)
      maxWidthOrHeight: 1920, // 目标最大宽/高
      useWebWorker: true, // 启用多线程，推荐
      initialQuality: 0.6,
      alwaysKeepResolution: true,
    };
    try {
      const compressedFile = await imageCompression.default(file, options);
      // 接下来将 compressedFile 上传到 OSS
      console.log("压缩后大小:", compressedFile.size);
      upFile = new File([compressedFile], compressedFile.name, { type: compressedFile.type });
    } catch (error) {
      console.error("压缩失败:", error);
    }
  }
  const client = getOssClient(config);
  const timestamp = Date.now();
  const filename = `${timestamp}_${file.name}`;
  try {
    const result = await client.put(filename, upFile);
    let url = result.url;
    // Apply custom domain if configured
    if (config.customDomain) {
      let cleanDomain = config.customDomain.replace(/\/$/, "");
      if (!cleanDomain.startsWith("http")) {
        cleanDomain = `https://${cleanDomain}`;
      }
      url = `${cleanDomain}/${result.name}`;
    }
    return { success: true, url, name: result.name };
  } catch (error: any) {
    console.error("OSS Upload Error", error);
    throw new Error(error.message || "上传失败");
  }
};

/**
 * @description 列出阿里云OSS中的图片;
 * @param config OSS配置;
 * @param maxKeys 最大返回数量;
 * @param continuationToken 继续分页标记;
 * @returns 图片列表;
 */
export const listOssImages = async (
  config: OssConfig,
  maxKeys: number = 50,
  continuationToken?: string,
) => {
  const client = getOssClient(config);
  const options: any = {
    "max-keys": maxKeys,
  };
  if (continuationToken) {
    options["continuation-token"] = continuationToken;
  }

  const result = await client.listV2(options);

  const objects = (result.objects || []).filter((obj: any) => isImageFile(obj.name));
  const images = objects.map((obj: any) => {
    let url = obj.url;
    if (!url) {
      url = client.generateObjectUrl(obj.name);
    }
    if (config.customDomain) {
      let cleanDomain = config.customDomain.replace(/\/$/, "");
      if (!cleanDomain.startsWith("http")) {
        cleanDomain = `https://${cleanDomain}`;
      }
      url = `${cleanDomain}/${obj.name}`;
    }
    return {
      name: obj.name,
      url: url,
      lastModified: obj.lastModified,
      size: obj.size,
    };
  });

  return {
    images,
    nextContinuationToken: result.nextContinuationToken,
    isTruncated: result.isTruncated,
  };
};

/**
 * @description 删除选中的阿里云OSS中的图片;
 * @param config OSS配置;
 * @param name 图片文件名;
 * @returns 删除结果;
 */
export const deleteOssImage = async (config: OssConfig, name: string) => {
  const client = getOssClient(config);
  await client.delete(name);
};
