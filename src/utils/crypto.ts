import CryptoJS from 'crypto-js';
// 定义加密密钥 后需环境变量化;
const SECRET_KEY = 'PicAliOSS_Secret_Key_V1';

/**
 * @description 基于AES加密算法进行内容加密;
 * @param word 待加密的内容;
 * @returns 加密后的内容;
 */
export const encrypt = (word: string) => {
    // AES加密;
    return CryptoJS.AES.encrypt(word, SECRET_KEY).toString();
};

/**
 * @description 基于AES解密算法进行内容解密;
 * @param word 待解密的内容;
 * @returns 解密后的内容;
 */
export const decrypt = (word: string) => {
    try {
        // AES解密;
        const bytes = CryptoJS.AES.decrypt(word, SECRET_KEY);
        // 解密后返回字符串;
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        return '';
    }
};
