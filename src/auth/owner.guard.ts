import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Owner } from '../owner/entities/owner.entity';
import { JWT_SECRET } from 'src/constants';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Owner.name)
    private ownerModel: Model<Owner>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractResponderTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<{
        owner: string;
        level: string;
      }>(token, {
        secret: JWT_SECRET,
      });

      if (payload.level !== 'owner') {
        throw new UnauthorizedException();
      }

      const owner = await this.ownerModel.findById(payload.owner);
      if (!owner) {
        throw new UnauthorizedException();
      }

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['owner'] = payload.owner;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractResponderTokenFromHeader(
    request: Request,
  ): string | undefined {
    return request.headers.owner as string | undefined;
  }
}
