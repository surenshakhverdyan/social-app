import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { IUser } from './interfaces/user.interface';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: SignUpDto): Promise<IUser> {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  signIn(@Body() dto: SignInDto): Promise<IUser> {
    return this.authService.signIn(dto);
  }
}
