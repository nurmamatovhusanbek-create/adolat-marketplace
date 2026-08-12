import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hash a password with bcrypt (cost factor 12).
 * Returns the full bcrypt hash string ready to store in the database.
 */
export async function hashPassword(plaintext: string): Promise<string> {
  if (plaintext.length > 128) {
    throw new Error("Parol juda uzun");
  }
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

/**
 * Verify a plaintext password against a stored bcrypt hash.
 * Constant-time comparison (bcrypt builtin).
 */
export async function verifyPassword(
  plaintext: string,
  hash: string
): Promise<boolean> {
  if (!hash || !hash.startsWith("$2")) return false;
  if (plaintext.length > 128) return false;
  try {
    return await bcrypt.compare(plaintext, hash);
  } catch {
    return false;
  }
}

/**
 * Generate a secure random token (URL-safe base64).
 * Used for email verification, password reset, etc.
 */
export function generateToken(byteLength: number = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString("base64url");
}

/**
 * Constant-time string comparison. Useful for token verification.
 * DO NOT use `===` to compare secrets.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
