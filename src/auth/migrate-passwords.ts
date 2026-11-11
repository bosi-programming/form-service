import { decrypt } from './utils';
import { hashPassword, isHashed } from './password';

export interface OwnerPasswordStore {
  findAll(): Promise<Array<{ id: string; password: string }>>;
  updatePassword(id: string, password: string): Promise<void>;
}

export async function migratePasswords(
  store: OwnerPasswordStore,
  masterKey: string,
): Promise<{ migrated: number; skipped: number }> {
  const owners = await store.findAll();
  const pending = owners.filter((owner) => !isHashed(owner.password));
  const hashes = await Promise.all(
    pending.map(async (owner) => ({
      id: owner.id,
      hash: await hashPassword(decrypt(owner.password, masterKey)),
    })),
  );
  for (const { id, hash } of hashes) {
    await store.updatePassword(id, hash);
  }
  return { migrated: hashes.length, skipped: owners.length - pending.length };
}
