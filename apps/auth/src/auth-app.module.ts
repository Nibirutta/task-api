import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { ConfigAuthModule } from './config-auth/config-auth.module';
import { ConfigAuthService } from './config-auth/config-auth.service';
import { ENV_KEYS } from 'libs/common/src/constants/ENV_KEYS.constants';

@Module({
  imports: [
    ConfigAuthModule,
    MongooseModule.forRootAsync({
      imports: [ConfigAuthModule],
      useFactory: (configService: ConfigAuthService) => ({
        uri: configService.getData(ENV_KEYS.DATABASE_URL),
        onConnectionCreate: (connection: Connection) => {
          console.log('Connected to mongoDB');

          return connection;
        },
      }),
      inject: [ConfigAuthService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AuthAppModule {}
