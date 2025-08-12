import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientAuthService } from './client-auth.service';
import { ClientAuthController } from './client-auth.controller';
import { AUTH_CLIENT, AppConfigModule, AppConfigService } from '@app/common';

@Module({
    imports: [AppConfigModule],
    providers: [
        ClientAuthService,
        {
            provide: AUTH_CLIENT,
            useFactory: (configService: AppConfigService) => {
                const clientOptions = configService.authClientOptions;
                return ClientProxyFactory.create(clientOptions);
            },
            inject: [AppConfigService],
        },
    ],
    controllers: [ClientAuthController],
})
export class ClientAuthModule {}
