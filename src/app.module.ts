import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

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
  ],
})
export class AppModule {}
