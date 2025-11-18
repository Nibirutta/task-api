import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientAccountController } from './client-account.controller';
import { ClientAccountService } from './client-account.service';
import {
    TRANSPORTER_PROVIDER,
    AppConfigModule,
    AppConfigService,
} from '@app/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from '../guard/customThrottlerGuard.guard';

@Module({
    imports: [
        AppConfigModule,
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 50
                }
            ]
        })
    ],
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
        {
            provide: APP_GUARD,
            useClass: CustomThrottlerGuard
        }
    ],
})
export class ClientAccountModule { }
