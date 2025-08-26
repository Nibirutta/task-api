import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientUsersController } from './client-users.controller';
import { ClientUsersService } from './client-users.service';
import {
    AppConfigModule,
    AppConfigService,
    TRANSPORTER_PROVIDER,
} from '@app/common';

@Module({
    imports: [AppConfigModule],
    providers: [
        ClientUsersService,
        {
            provide: TRANSPORTER_PROVIDER,
            useFactory: (configService: AppConfigService) => {
                const clientOptions = configService.clientOptions;
                return ClientProxyFactory.create(clientOptions);
            },
            inject: [AppConfigService],
        },
    ],
    controllers: [ClientUsersController],
})
export class ClientUsersModule {}
