import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

import { ClientConfigModule } from '../client-config/client-config.module';
import { ClientConfigService } from '../client-config/client-config.service';
import { ClientAuthService } from './client-auth.service';
import { ClientAuthController } from './client-auth.controller';
import { AUTH_CLIENT } from '@app/common';

@Module({
  imports: [ClientConfigModule],
  providers: [
    ClientAuthService,
    {
      provide: AUTH_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const clientOptions = configService.authClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
  controllers: [ClientAuthController],
})
export class ClientAuthModule {}
