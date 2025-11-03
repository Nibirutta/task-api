import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientAccountController } from './client-account.controller';
import { ClientAccountService } from './client-account.service';
import {
    TRANSPORTER_PROVIDER,
    AppConfigModule,
    AppConfigService,
} from '@app/common';

@Module({
    imports: [AppConfigModule],
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
