import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../common/database/database.module';
import { TokenModule } from '../common/token/token.module';
import { AuthHelper } from './helpers/auth.helper';
import { UserRepository } from './repositories/user.repository';
import { RefreshTokenMiddleware } from './middlewares/refresh-token.middleware';

@Module({
  imports: [DatabaseModule, TokenModule],
  providers: [AuthService, AuthHelper, UserRepository],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes('auth/refresh-token');
  }
}
