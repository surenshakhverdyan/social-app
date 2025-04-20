import { Module } from '@nestjs/common';

import { DatabaseModule } from '../common/database/database.module';
import { TokenModule } from '../common/token/token.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [DatabaseModule, TokenModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
