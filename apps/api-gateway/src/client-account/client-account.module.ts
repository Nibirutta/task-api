import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientAccountController } from './client-account.controller';
import { ClientAccountService } from './client-account.service';
import { ClientAuthModule } from '../client-auth/client-auth.module';
import { ClientUsersModule } from '../client-users/client-users.module';
import {
    TRANSPORTER_PROVIDER,
    AppConfigModule,
    AppConfigService,
} from '@app/common';

@Module({
    imports: [ClientAuthModule, ClientUsersModule, AppConfigModule],
    controllers: [ClientAccountController],
    providers: [
        ClientAccountService,
        {
            provide: TRANSPORTER_PROVIDER,
            useFactory: (configService: AppConfigService) => {
                const clientOptions = configService.clientOptions;
                return ClientProxyFactory.create(clientOptions);
            },
            inject: [AppConfigService],
        },
    ],
})
export class ClientAccountModule {}
