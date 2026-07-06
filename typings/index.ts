export type LinkFormat = "markdown" | "html" | "url";

export interface OssConfig {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
  customDomain?: string;
}
