import { Test } from '@nestjs/testing';
import { ResponderGuard } from './responder.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { getModelToken } from '@nestjs/mongoose';

const jwtService = new JwtService({
  secret: jwtConstants.secret,
});
const owner = 'id';
const token = jwtService.sign({
  owner,
  name: 'name',
  level: 'responder',
});
const mockOwnerModule = {
  findById: jest.fn().mockResolvedValue({ _id: owner, responderToken: token }),
};

describe('ResponderGuard', () => {
  let guard: ResponderGuard;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
        }),
      ],
      providers: [
        ResponderGuard,
        {
          provide: getModelToken('Owner'),
          useValue: mockOwnerModule,
        },
      ],
    }).compile();
    guard = moduleRef.get<ResponderGuard>(ResponderGuard);
  });

  it('should deny access', async () => {
    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { responder: null } }),
      }),
    } as any as ExecutionContext;
    try {
      await guard.canActivate(executionContext);
    } catch (e) {
      expect(e instanceof UnauthorizedException).toBe(true);
    }

    const wrongToken = jwtService.sign({
      owner,
      name: 'name',
      level: 'any',
    });
    const executionContextWithWrongToken = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: { responder: wrongToken } }),
      }),
    } as any as ExecutionContext;
    try {
      await guard.canActivate(executionContextWithWrongToken);
    } catch (e) {
      expect(e instanceof UnauthorizedException).toBe(true);
    }
  });
  it('should give access', async () => {
    const request: Record<string, unknown> = {
      headers: {
        responder: token,
      },
    };
    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any as ExecutionContext;
    expect(await guard.canActivate(executionContext)).toBe(true);
    expect(request.owner).toBe('id');
  });
});
