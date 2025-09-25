import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OwnerService } from 'src/owner/owner.service';

@Injectable()
export class AuthService {
  constructor(
    private ownerService: OwnerService,
    private jwtService: JwtService
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const owner = await this.ownerService.findOne(username);
    if (owner?.token !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: owner._id, name: owner.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

