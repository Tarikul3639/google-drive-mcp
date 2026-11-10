import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

import { ConfigService } from '../../../config/config.service.js';

@Injectable()
export class GoogleTokenService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor(private readonly configService: ConfigService) {
    const encryptionKey = this.configService.googleTokenEncryptionKey;

    if (!/^[0-9a-fA-F]{64}$/.test(encryptionKey)) {
      throw new Error(
        'GOOGLE_TOKEN_ENCRYPTION_KEY must be a 64-character hexadecimal key.',
      );
    }

    this.key = Buffer.from(encryptionKey, 'hex');
  }

  /**
   * Encrypts a Google OAuth token using AES-256-GCM.
   *
   * @param plainText - Original token.
   * @returns Encrypted token in iv:authTag:cipherText format.
   */
  encrypt(plainText: string): string {
    if (!plainText) {
      throw new Error('Plain text cannot be empty.');
    }

    const iv = randomBytes(12);

    const cipher = createCipheriv(this.algorithm, this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(plainText, 'utf8'),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return [
      iv.toString('hex'),
      authTag.toString('hex'),
      encrypted.toString('hex'),
    ].join(':');
  }

  /**
   * Decrypts an encrypted Google OAuth token.
   *
   * @param encryptedText - Encrypted token.
   * @returns Original token.
   */
  decrypt(encryptedText: string): string {
    try {
      const parts = encryptedText.split(':');

      if (parts.length !== 3) {
        throw new Error('Invalid encrypted token format.');
      }

      const [ivHex, authTagHex, encryptedHex] = parts;

      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const encrypted = Buffer.from(encryptedHex, 'hex');

      if (
        iv.length !== 12 ||
        authTag.length !== 16 ||
        !ivHex ||
        !authTagHex ||
        !encryptedHex
      ) {
        throw new Error('Invalid encrypted token data.');
      }

      const decipher = createDecipheriv(this.algorithm, this.key, iv);

      decipher.setAuthTag(authTag);

      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);

      return decrypted.toString('utf8');
    } catch {
      throw new InternalServerErrorException('Failed to decrypt Google token.');
    }
  }
}
