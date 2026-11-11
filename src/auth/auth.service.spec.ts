import { Test } from '@nestjs/testing';
import { HttpException, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { hashPassword } from './password';
import { OwnerService } from '../owner/owner.service';
import { OwnerDocument } from '../owner/entities/owner.entity';
import { JWT_SECRET } from 'src/constants';

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

describe('AuthService', () => {
  let authService: AuthService;
  let storedOwner: { _id: string; responderToken: string; password: string };

  beforeAll(async () => {
    storedOwner = {
      _id: owner,
      responderToken: token,
      password: await hashPassword('1234'),
    };
  });

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
          useValue: {
            findByName: jest.fn().mockResolvedValue(storedOwner),
          },
        },
      ],
    }).compile();
    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should deny access with a wrong password', async () => {
    await expect(authService.signIn(name, 'wrong-pass')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should give access with the right password', async () => {
    expect(await authService.signIn(name, '1234')).toStrictEqual(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expect.objectContaining({ access_token: expect.any(String) }),
    );
  });

  it('should accept the right password in validatePassword', async () => {
    await expect(
      authService.validatePassword(
        storedOwner as unknown as OwnerDocument,
        '1234',
      ),
    ).resolves.toBeUndefined();
  });

  it('should reject a wrong password in validatePassword', async () => {
    await expect(
      authService.validatePassword(
        storedOwner as unknown as OwnerDocument,
        'wrong',
      ),
    ).rejects.toThrow(HttpException);
  });
});
