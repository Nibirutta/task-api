import { Module } from '@nestjs/common';
import { ClientUsersModule } from './client-users/client-users.module';
import { ClientAuthModule } from './client-auth/client-auth.module';

@Module({
    imports: [ClientUsersModule, ClientAuthModule],
    controllers: [],
    providers: [],
})
export class ApiGatewayModule {}
