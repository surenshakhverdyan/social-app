import { Injectable } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { TokenService } from 'src/common/token/token.service';

@Injectable()
export class RefreshTokenMiddleware {
  constructor(private readonly tokenService: TokenService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.headers['refresh-token'] as string;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' });
    }

    const payload = this.tokenService.verifyToken(refreshToken);
    if (!payload) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    delete payload.iat;
    delete payload.exp;

    req.body = payload;

    next();
  }
}
