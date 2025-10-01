import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { cryptMasterKey, jwtConstants } from './constants';
import { AuthService } from './auth.service';
import { encrypt } from './utils';
import { OwnerService } from '../owner/owner.service';

const jwtService = new JwtService({
  secret: jwtConstants.secret,
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
    password: encrypt('1234', cryptMasterKey),
  }),
};

describe('ResponderGuard', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
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
