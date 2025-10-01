import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { encrypt } from './utils';
import { OwnerService } from '../owner/owner.service';
import { CRYPT_MASTER_KEY, JWT_SECRET } from 'src/constants';

const jwtService = new JwtService({
  secret: JWT_SECRET,
});
const owner = 'id';
const name = 'name';
const token = jwtService.sign({
  owner,
  name,
  level: 'responder',
});
const mockOwnerModule = {
  findByName: jest.fn().mockResolvedValue({
    _id: owner,
    responderToken: token,
    password: encrypt('1234', CRYPT_MASTER_KEY),
  }),
};

describe('ResponderGuard', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: JWT_SECRET,
        }),
      ],
      providers: [
        AuthService,
        {
          provide: OwnerService,
          useValue: mockOwnerModule,
        },
      ],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should deny access', async () => {
    try {
      await authService.signIn(name, 'wrong-pass');
    } catch (e) {
      expect(e instanceof UnauthorizedException).toBe(true);
    }
  });
  it('should give access', async () => {
    expect(await authService.signIn(name, '1234')).toStrictEqual(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expect.objectContaining({ access_token: expect.any(String) }),
    );
  });
});
