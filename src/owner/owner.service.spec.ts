import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { OwnerService } from './owner.service';
import { Owner } from './entities/owner.entity';
import { verifyPassword } from '../auth/password';

const saved: Array<Record<string, unknown>> = [];

class FakeOwnerModel {
  _id = 'owner-id';
  name: string;
  password: string;
  responderToken?: string;

  constructor(data: { name: string; password: string }) {
    this.name = data.name;
    this.password = data.password;
  }

  static findOne = jest.fn().mockResolvedValue(null);

  save() {
    saved.push({ ...this });
    return Promise.resolve(this);
  }
}

describe('OwnerService', () => {
  let ownerService: OwnerService;

  beforeEach(async () => {
    saved.length = 0;
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ global: true, secret: 'test' })],
      providers: [
        OwnerService,
        { provide: getModelToken(Owner.name), useValue: FakeOwnerModel },
      ],
    }).compile();
    ownerService = moduleRef.get(OwnerService);
  });

  it('should store an argon2 hash instead of the password', async () => {
    await ownerService.create({ name: 'tester', password: 'Senha123' });
    const password = saved[0].password as string;
    expect(password.startsWith('$argon2id$')).toBe(true);
    expect(await verifyPassword(password, 'Senha123')).toBe(true);
  });

  it('should not return the password', async () => {
    const result = await ownerService.create({
      name: 'tester',
      password: 'Senha123',
    });
    expect(result).not.toHaveProperty('password');
  });
});
