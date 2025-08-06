import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';

import { ClientConfigService } from './client-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      validationSchema: joi.object({
        USERS_MICROSERVICE_PORT: joi.number().default(3001),
        AUTH_MICROSERVICE_PORT: joi.number().default(3002),
      }),
    }),
  ],
  providers: [ClientConfigService],
  exports: [ClientConfigService],
})
export class ClientConfigModule {}
