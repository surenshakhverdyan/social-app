import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { TokenService } from 'src/common/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.tokenService.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Token not found');

    this.tokenService.verifyToken(token);

    return true;
  }
}
