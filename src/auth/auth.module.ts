import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/common/database/database.module';
import { TokenModule } from 'src/common/token/token.module';
import { AuthHelper } from './helpers/auth.helper';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [DatabaseModule, TokenModule],
  providers: [AuthService, AuthHelper, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
