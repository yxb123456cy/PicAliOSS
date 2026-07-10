export type LinkFormat = "markdown" | "html" | "url";

export interface OssConfig {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
  customDomain?: string;
}
export interface OssImage {
  name: string;
  url: string;
  lastModified: string;
  size: number;
}
