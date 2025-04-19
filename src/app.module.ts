import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { DatabaseModule } from './common/database/database.module';
import { TokenModule } from './common/token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        PORT: Joi.number().integer().required().default(3000),
        DB_PORT: Joi.number().integer().required().default(5432),
      }),
    }),
    DatabaseModule,
    TokenModule,
  ],
})
export class AppModule {}
