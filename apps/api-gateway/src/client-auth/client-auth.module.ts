import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientAuthService } from './client-auth.service';
import { ClientAuthController } from './client-auth.controller';
import {
    AppConfigModule,
    AppConfigService,
    TRANSPORTER_PROVIDER,
} from '@app/common';

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
    ],
    controllers: [ClientAuthController],
    exports: [ClientAuthService],
})
export class ClientAuthModule {}
