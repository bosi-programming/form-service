import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { OwnerDocument } from 'src/owner/entities/owner.entity';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractResponderTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<OwnerDocument>(token, {
        secret: jwtConstants.secret,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['owner'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractResponderTokenFromHeader(
    request: Request,
  ): string | undefined {
    return request.headers.responder as string | undefined;
  }
}
