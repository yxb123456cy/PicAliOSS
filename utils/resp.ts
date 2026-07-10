/**
 * @description 转换阿里云 OSS SDK 错误信息为中文;
 * @param message 原始错误信息;
 * @returns 优化后的中文错误信息;
 */
export function SDKRespTransform(message: string): string {
  switch (message) {
    case "The specified bucket does not exist.":
      return "指定的存储桶不存在!";
    case "The request signature we calculated does not match the signature you provided. Check your key and signing method.":
      return "请检查您的AccessKey Secret是否正确!";
    case "The OSS Access Key Id you provided does not exist in our records.":
      return "您提供的 AccessKey ID 在阿里云 OSS 系统中不存在！";
    case "The bucket you are attempting to access must be addressed using the specified endpoint. Please send all future requests to this endpoint.":
      return "你访问 Bucket 时使用的 Endpoint（接入点）与该 Bucket 实际所在的地域不匹配,请检查region的选择以及自定义域名是否正确!";
    default:
      return message;
  }
}
