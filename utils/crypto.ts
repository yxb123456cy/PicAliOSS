import CryptoJS from 'crypto-js';
// 定义加密密钥 后需环境变量化;
const SECRET_KEY = 'PicAliOSS_Secret_Key_V1';

// 加密;
export const encrypt = (word: string) => {
    // AES加密;
    return CryptoJS.AES.encrypt(word, SECRET_KEY).toString();
};

// 解密;
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
