import { Module } from '@nestjs/common';
import { ClientAccountModule } from './client-account/client-account.module';
import { ClientTaskModule } from './client-task/client-task.module';

@Module({
    imports: [ClientAccountModule, ClientTaskModule],
    controllers: [],
    providers: [],
})
export class ApiGatewayModule {}
