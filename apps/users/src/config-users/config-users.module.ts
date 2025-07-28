import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';

import { ConfigUsersService } from './config-users.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: joi.object({
        USERS_CLIENT_PORT: joi.number().default(3001),
      }),
    }),
  ],
  providers: [ConfigUsersService],
  exports: [ConfigUsersService],
})
export class ConfigUsersModule {}
