import { Module } from '@nestjs/common';
import { ClientConfigModule } from './client-config/client-config.module';
import { ClientUsersModule } from './client-users/client-users.module';
import { ClientAuthModule } from './client-auth/client-auth.module';

@Module({
  imports: [ClientConfigModule, ClientUsersModule, ClientAuthModule],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
