import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  create(@Body() { name, password }: { name: string; password: string }) {
    return this.authService.signIn(name, password);
  }
}
