import { Module } from '@nestjs/common';
import { ClientUsersModule } from './client-users/client-users.module';
import { ClientAuthModule } from './client-auth/client-auth.module';
import { ClientAccountModule } from './client-account/client-account.module';

@Module({
    imports: [ClientUsersModule, ClientAuthModule, ClientAccountModule],
    controllers: [],
    providers: [],
})
export class ApiGatewayModule {}
