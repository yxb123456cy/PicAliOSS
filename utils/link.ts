import { LinkFormat } from "@/typings";

/**
 * @description 格式化图片链接(三种格式：Markdown、HTML、原始直链);
 * @param url 图片链接;
 * @param filename 图片文件名;
 * @param format 链接格式;
 * @returns 格式化后的链接;
 */
export const formatLink = (url: string, filename?: string, format: LinkFormat = "markdown") => {
  if (format === "markdown") {
    return `![${filename || "image"}](${url})`;
  }

  if (format === "html") {
    return `<img src="${url}" alt="${filename || "image"}" />`;
  }

  return url;
};
