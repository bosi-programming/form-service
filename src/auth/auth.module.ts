import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OwnerModule } from '../owner/owner.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [OwnerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
