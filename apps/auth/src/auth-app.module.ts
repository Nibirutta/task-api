import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { ConfigAuthModule } from './config-auth/config-auth.module';
import { ConfigAuthService } from './config-auth/config-auth.service';
import { ENV_KEYS } from '@app/common';
import { AuthCredentialsModule } from './auth-credentials/auth-credentials.module';
import { AuthTokensModule } from './auth-tokens/auth-tokens.module';

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
    AuthCredentialsModule,
    AuthTokensModule,
  ],
  controllers: [],
  providers: [],
})
export class AuthAppModule {}
