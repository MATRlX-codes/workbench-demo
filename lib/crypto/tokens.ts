// lib/crypto/tokens.ts
//
// AES-256-GCM encrypt/decrypt for connector OAuth tokens.
// Storage format: base64( iv[12] + ciphertext[N] + authTag[16] )
// Key source: TENANT_ENCRYPTION_KEY — 64-char hex string (32 bytes)

import { randomBytes, createCipheriv, createDecipheriv } from "crypto";

export type DecryptedTokens = {
  access_token: string;
  token_type: string;
  [k: string]: unknown;
};

function getKey(): Buffer {
  const keyHex = process.env.TENANT_ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error(
      "TENANT_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)"
    );
  }
  return Buffer.from(keyHex, "hex");
}

/**
 * Encrypts a JSON string of token data.
 * Returns a base64 string: iv[12] + ciphertext[N] + authTag[16]
 */
export function encryptTokens(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, ciphertext, authTag]).toString("base64");
}

/**
 * Decrypts a base64 token string produced by encryptTokens.
 * Returns the parsed token JSON.
 */
export function decryptTokens(encryptedTokens: string): DecryptedTokens {
  const key = getKey();
  const buf = Buffer.from(encryptedTokens, "base64");

  // Layout: iv[12] + ciphertext[N] + authTag[16]
  if (buf.length < 28) throw new Error("Encrypted token payload is too short");
  const iv = buf.subarray(0, 12);
  const authTag = buf.subarray(buf.length - 16);
  const ciphertext = buf.subarray(12, buf.length - 16);

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString("utf8");

  return JSON.parse(plaintext) as DecryptedTokens;
}
