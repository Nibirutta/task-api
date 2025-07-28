import { Module } from '@nestjs/common';
import { ClientConfigModule } from './client-config/client-config.module';

@Module({
  imports: [ClientConfigModule],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
