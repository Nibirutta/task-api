import { NestFactory } from '@nestjs/core';
import { Transport, AsyncMicroserviceOptions } from '@nestjs/microservices';

import { UsersModule } from './users.module';
import { ConfigUsersService } from './config-users/config-users.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    UsersModule,
    {
      useFactory: (configService: ConfigUsersService) => ({
        transport: Transport.TCP,
        options: {
          port: configService.getUsersClientPort(),
        },
      }),
      inject: [ConfigUsersService],
    },
  );

  await app.listen();
}
bootstrap();
