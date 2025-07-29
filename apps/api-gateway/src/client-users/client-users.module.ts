import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

import { ClientConfigService } from '../client-config/client-config.service';
import { ClientUsersController } from './client-users.controller';
import { ClientUsersService } from './client-users.service';
import { USERS_CLIENT } from 'libs/common/src/constants/ms-provides.constants';
import { ClientConfigModule } from '../client-config/client-config.module';

@Module({
  imports: [ClientConfigModule],
  providers: [
    ClientUsersService,
    {
      provide: USERS_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const clientOptions = configService.booksClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService]
    }
  ],
  controllers: [ClientUsersController]
})
export class ClientUsersModule {}