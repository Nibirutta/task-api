import { Module } from '@nestjs/common';
import { ClientAuthModule } from './client-auth/client-auth.module';
import { ClientAccountModule } from './client-account/client-account.module';
import { ClientProfileModule } from './client-profile/client-profile.module';
import { ClientTaskModule } from './client-task/client-task.module';

@Module({
    imports: [
        ClientAuthModule,
        ClientAccountModule,
        ClientProfileModule,
        ClientTaskModule,
    ],
    controllers: [],
    providers: [],
})
export class ApiGatewayModule {}
