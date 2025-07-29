import { Module } from '@nestjs/common';
import { ClientConfigModule } from './client-config/client-config.module';
import { ClientUsersModule } from './client-users/client-users.module';

@Module({
  imports: [ClientConfigModule, ClientUsersModule],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
