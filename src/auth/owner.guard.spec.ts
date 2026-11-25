import { Test } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { JWT_SECRET } from 'src/constants';
import { OwnerGuard } from './owner.guard';

const jwtService = new JwtService({ secret: JWT_SECRET });
const owner = 'id';
const ownerModel = { findById: jest.fn() };

const contextWithOwnerHeader = (
  token: string | undefined,
  request: Record<string, unknown> = {},
) => {
  request.headers = { owner: token };
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
};

describe('OwnerGuard', () => {
  let guard: OwnerGuard;

  beforeEach(async () => {
    ownerModel.findById.mockReset();
    ownerModel.findById.mockResolvedValue({ _id: owner });
    const moduleRef = await Test.createTestingModule({
      imports: [JwtModule.register({ global: true, secret: JWT_SECRET })],
      providers: [
        OwnerGuard,
        { provide: getModelToken('Owner'), useValue: ownerModel },
      ],
    }).compile();
    guard = moduleRef.get<OwnerGuard>(OwnerGuard);
  });

  it('denies a request without the owner header', async () => {
    await expect(
      guard.canActivate(contextWithOwnerHeader(undefined)),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('denies a token signed with another secret', async () => {
    const token = new JwtService({ secret: 'other-secret' }).sign({
      owner,
      level: 'owner',
    });

    await expect(
      guard.canActivate(contextWithOwnerHeader(token)),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('denies a responder token', async () => {
    const token = jwtService.sign({ owner, name: 'name', level: 'responder' });

    await expect(
      guard.canActivate(contextWithOwnerHeader(token)),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('denies a token without a level', async () => {
    const token = jwtService.sign({ owner, name: 'name' });

    await expect(
      guard.canActivate(contextWithOwnerHeader(token)),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('does not set the owner on the request when the level is wrong', async () => {
    const token = jwtService.sign({ owner, name: 'name', level: 'responder' });
    const request: Record<string, unknown> = {};

    await expect(
      guard.canActivate(contextWithOwnerHeader(token, request)),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(request.owner).toBeUndefined();
  });

  it('denies an owner token whose owner no longer exists', async () => {
    ownerModel.findById.mockResolvedValue(null);
    const token = jwtService.sign({ owner, name: 'name', level: 'owner' });
    const request: Record<string, unknown> = {};

    await expect(
      guard.canActivate(contextWithOwnerHeader(token, request)),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(ownerModel.findById).toHaveBeenCalledWith(owner);
    expect(request.owner).toBeUndefined();
  });

  it('allows an owner token and sets the owner on the request', async () => {
    const token = jwtService.sign({ owner, name: 'name', level: 'owner' });
    const request: Record<string, unknown> = {};

    await expect(
      guard.canActivate(contextWithOwnerHeader(token, request)),
    ).resolves.toBe(true);
    expect(request.owner).toBe(owner);
  });
});
