import { hash, verify } from '@node-rs/argon2';

const HASH_PREFIX = '$argon2';

export function isHashed(value: string): boolean {
  return value.startsWith(HASH_PREFIX);
}

export function hashPassword(password: string): Promise<string> {
  return hash(password);
}

export async function verifyPassword(
  stored: string,
  password: string,
): Promise<boolean> {
  if (!isHashed(stored)) {
    return false;
  }
  try {
    return await verify(stored, password);
  } catch {
    return false;
  }
}
