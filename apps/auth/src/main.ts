import { NestFactory } from '@nestjs/core';
import { Transport, AsyncMicroserviceOptions } from '@nestjs/microservices';

import { AuthAppModule } from './auth-app.module';
import { ConfigAuthService } from './config-auth/config-auth.service';
import { ENV_KEYS } from 'libs/common/src/constants/ENV_KEYS.constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    AuthAppModule,
    {
      useFactory: (configService: ConfigAuthService) => ({
        transport: Transport.TCP,
        options: {
          port: configService.getData(ENV_KEYS.AUTH_CLIENT_PORT),
        },
      }),
      inject: [ConfigAuthService],
    },
  );

  await app.listen();
}
bootstrap();
