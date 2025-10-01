import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OwnerService } from '../owner/owner.service';
import { OwnerDocument } from '../owner/entities/owner.entity';
import { decrypt } from './utils';
import { CRYPT_MASTER_KEY } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private ownerService: OwnerService,
    private jwtService: JwtService,
  ) {}

  async signIn(name: string, pass: string): Promise<{ access_token: string }> {
    const owner = await this.ownerService.findByName(name);
    if (!owner || decrypt(owner.password, CRYPT_MASTER_KEY) !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { owner: owner._id, name: owner.name, level: 'owner' };
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

    const decriptedPassword = decrypt(owner.password, CRYPT_MASTER_KEY);

    if (password !== decriptedPassword) {
      throw new HttpException(
        'Please write a password',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
