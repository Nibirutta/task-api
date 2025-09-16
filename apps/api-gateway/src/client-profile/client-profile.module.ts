import { Module } from '@nestjs/common';
import { ClientProfileController } from './client-profile.controller';
import { ClientProfileService } from './client-profile.service';
import {
    AppConfigModule,
    AppConfigService,
    TRANSPORTER_PROVIDER,
} from '@app/common';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
    imports: [AppConfigModule],
    controllers: [ClientProfileController],
    providers: [
        ClientProfileService,
        {
            provide: TRANSPORTER_PROVIDER,
            useFactory: (configService: AppConfigService) => {
                const clientOptions = configService.clientOptions;
                return ClientProxyFactory.create(clientOptions);
            },
            inject: [AppConfigService],
        },
    ],
    exports: [ClientProfileService]
})
export class ClientProfileModule {}
