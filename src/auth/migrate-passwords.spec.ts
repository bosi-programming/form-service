import { encrypt } from './utils';
import { hashPassword, verifyPassword } from './password';
import { migratePasswords, OwnerPasswordStore } from './migrate-passwords';

const KEY = 'master-key';

function memoryStore(passwords: Record<string, string>): OwnerPasswordStore & {
  passwords: Record<string, string>;
} {
  return {
    passwords,
    findAll: () =>
      Promise.resolve(
        Object.entries(passwords).map(([id, password]) => ({ id, password })),
      ),
    updatePassword: (id, password) => {
      passwords[id] = password;
      return Promise.resolve();
    },
  };
}

describe('migratePasswords', () => {
  it('should replace encrypted passwords with argon2 hashes', async () => {
    const store = memoryStore({ a: encrypt('Senha123', KEY) });
    const result = await migratePasswords(store, KEY);
    expect(result).toStrictEqual({ migrated: 1, skipped: 0 });
    expect(await verifyPassword(store.passwords.a, 'Senha123')).toBe(true);
  });

  it('should leave existing hashes alone', async () => {
    const hash = await hashPassword('Senha123');
    const store = memoryStore({ a: hash });
    const result = await migratePasswords(store, KEY);
    expect(result).toStrictEqual({ migrated: 0, skipped: 1 });
    expect(store.passwords.a).toBe(hash);
  });

  it('should be safe to run twice', async () => {
    const store = memoryStore({
      a: encrypt('one', KEY),
      b: encrypt('two', KEY),
    });
    await migratePasswords(store, KEY);
    const second = await migratePasswords(store, KEY);
    expect(second).toStrictEqual({ migrated: 0, skipped: 2 });
    expect(await verifyPassword(store.passwords.b, 'two')).toBe(true);
  });

  it('should stop without writing when the key is wrong', async () => {
    const encrypted = encrypt('Senha123', KEY);
    const store = memoryStore({ a: encrypted });
    await expect(migratePasswords(store, 'other-key')).rejects.toThrow();
    expect(store.passwords.a).toBe(encrypted);
  });
});
