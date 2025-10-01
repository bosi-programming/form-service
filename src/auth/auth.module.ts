import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OwnerModule } from '../owner/owner.module';

@Module({
  imports: [OwnerModule],
  controllers: [],
  providers: [AuthService],
})
export class AuthModule { }
