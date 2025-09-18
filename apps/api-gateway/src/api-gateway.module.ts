import { Module } from '@nestjs/common';
import { ClientAuthModule } from './client-auth/client-auth.module';
import { ClientAccountModule } from './client-account/client-account.module';
import { ClientProfileModule } from './client-profile/client-profile.module';

@Module({
    imports: [ClientAuthModule, ClientAccountModule, ClientProfileModule],
    controllers: [],
    providers: [],
})
export class ApiGatewayModule {}
