import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Owner as OwnerEntity } from 'src/owner/entities/owner.entity';

export const GetOwner = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.owner as OwnerEntity;
  },
);
