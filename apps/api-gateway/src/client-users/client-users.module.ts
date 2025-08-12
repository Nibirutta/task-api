import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientUsersController } from './client-users.controller';
import { ClientUsersService } from './client-users.service';
import { USERS_CLIENT, AppConfigModule, AppConfigService } from '@app/common';

@Module({
    imports: [AppConfigModule],
    providers: [
        ClientUsersService,
        {
            provide: USERS_CLIENT,
            useFactory: (configService: AppConfigService) => {
                const clientOptions = configService.usersClientOptions;
                return ClientProxyFactory.create(clientOptions);
            },
            inject: [AppConfigService],
        },
    ],
    controllers: [ClientUsersController],
})
export class ClientUsersModule {}
