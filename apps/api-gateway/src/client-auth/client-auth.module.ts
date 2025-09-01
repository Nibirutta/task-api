import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientAuthService } from './client-auth.service';
import { ClientAuthController } from './client-auth.controller';
import {
    AppConfigModule,
    AppConfigService,
    TRANSPORTER_PROVIDER,
} from '@app/common';
import { ClientUsersService } from '../client-users/client-users.service';

@Module({
    imports: [AppConfigModule],
    providers: [
        ClientAuthService,
        {
            provide: TRANSPORTER_PROVIDER,
            useFactory: (configService: AppConfigService) => {
                const clientOptions = configService.clientOptions;
                return ClientProxyFactory.create(clientOptions);
            },
            inject: [AppConfigService],
        },
        ClientUsersService,
    ],
    controllers: [ClientAuthController],
})
export class ClientAuthModule {}
