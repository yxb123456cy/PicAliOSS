import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from '../utils/crypto';

describe('Crypto Utils', () => {
  it('should encrypt and decrypt a string correctly', () => {
    const originalText = 'Hello, PicAliOSS!';
    
    // 加密
    const encryptedText = encrypt(originalText);
    expect(encryptedText).not.toBe(originalText);
    expect(encryptedText).toBeTypeOf('string');
    expect(encryptedText.length).toBeGreaterThan(0);

    // 解密
    const decryptedText = decrypt(encryptedText);
    expect(decryptedText).toBe(originalText);
  });

  it('should return empty string when decrypting invalid payload', () => {
    const invalidText = 'not-a-valid-encrypted-string';
    const decryptedText = decrypt(invalidText);
    expect(decryptedText).toBe('');
  });
});
