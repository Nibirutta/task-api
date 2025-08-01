import { NestFactory } from '@nestjs/core';
import { Transport, AsyncMicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

import { AuthAppModule } from './auth-app.module';
import { ConfigAuthService } from './config-auth/config-auth.service';
import { ENV_KEYS } from '@app/common';

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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  
  await app.listen();
}
bootstrap();
