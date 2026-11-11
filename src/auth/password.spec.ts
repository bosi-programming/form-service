import { hashPassword, isHashed, verifyPassword } from './password';

describe('password', () => {
  it('should hash with argon2id', async () => {
    const hash = await hashPassword('Senha123');
    expect(hash.startsWith('$argon2id$')).toBe(true);
    expect(hash).not.toContain('Senha123');
  });

  it('should verify the right password', async () => {
    const hash = await hashPassword('Senha123');
    expect(await verifyPassword(hash, 'Senha123')).toBe(true);
  });

  it('should reject a wrong password', async () => {
    const hash = await hashPassword('Senha123');
    expect(await verifyPassword(hash, 'wrong')).toBe(false);
  });

  it('should reject a value that is not a hash', async () => {
    expect(await verifyPassword('not-a-hash', 'not-a-hash')).toBe(false);
  });

  it('should tell hashes from legacy encrypted values', async () => {
    expect(isHashed(await hashPassword('x'))).toBe(true);
    expect(isHashed('c2FsdGl2dGFnZW5j')).toBe(false);
  });
});
