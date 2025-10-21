import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ClientTaskController } from './client-task.controller';
import { ClientTaskService } from './client-task.service';
import {
    AppConfigModule,
    TRANSPORTER_PROVIDER,
    AppConfigService,
} from '@app/common';

@Module({
    imports: [AppConfigModule],
    controllers: [ClientTaskController],
    providers: [
        ClientTaskService,
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
export class ClientTaskModule {}
