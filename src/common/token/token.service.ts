import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: IJwtPayload): string {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: IJwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  verifyToken(token: string): IJwtPayload {
    try {
      return this.jwtService.verify(token);
    } catch (error: unknown) {
      if (error instanceof Error)
        throw new UnauthorizedException(error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }

  extractTokenFromHeader(req: Request): string {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    if (type === 'Bearer') {
      return token;
    }
    throw new UnauthorizedException('Invalid token type');
  }
}
