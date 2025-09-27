import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OwnerService } from 'src/owner/owner.service';
import { OwnerDocument } from 'src/owner/entities/owner.entity';
import { decrypt } from './utils';
import { cryptMasterKey } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private ownerService: OwnerService,
    private jwtService: JwtService,
  ) { }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const owner = await this.ownerService.findOne(username);
    // TODO: Decript password
    if (owner?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: owner._id, name: owner.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  validatePassword(owner: OwnerDocument, password: string) {
    if (!password) {
      throw new HttpException(
        'Please write a password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const decriptedPassword = decrypt(owner.password,cryptMasterKey);

    if (password !== decriptedPassword) {
      throw new HttpException(
        'Please write a password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
