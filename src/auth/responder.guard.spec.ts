import { Test } from '@nestjs/testing';
import { ResponderGuard } from './responder.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

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
      providers: [ResponderGuard],
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
  });
  it('should give access', async () => {
    const request: Record<string, unknown> = {
      headers: {
        responder:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NTkyODAxMjgsImV4cCI6MTc5MDgxNjEyOCwib3duZXIiOiJ0ZXN0In0.y_8V6KigIEW-8EGKpR9jUT1GPB4nSwN5rFCko9c8TP4',
      },
    };
    const executionContext = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any as ExecutionContext;
    expect(await guard.canActivate(executionContext)).toBe(true);
    expect(request.owner).toBe('test');
  });
});
