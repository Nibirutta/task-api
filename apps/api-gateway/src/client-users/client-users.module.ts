import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

import { ClientConfigService } from '../client-config/client-config.service';
import { ClientUsersController } from './client-users.controller';
import { ClientUsersService } from './client-users.service';
import { USERS_CLIENT } from '@app/common';
import { ClientConfigModule } from '../client-config/client-config.module';

@Module({
  imports: [ClientConfigModule],
  providers: [
    ClientUsersService,
    {
      provide: USERS_CLIENT,
      useFactory: (configService: ClientConfigService) => {
        const clientOptions = configService.usersClientOptions;
        return ClientProxyFactory.create(clientOptions);
      },
      inject: [ClientConfigService],
    },
  ],
  controllers: [ClientUsersController],
})
export class ClientUsersModule {}
