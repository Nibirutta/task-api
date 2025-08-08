import { NestFactory } from '@nestjs/core';
import { Transport, AsyncMicroserviceOptions } from '@nestjs/microservices';
import { ENV_KEYS } from '@app/common';
import { UsersAppModule } from './users-app.module';
import { ConfigUsersService } from './config-users/config-users.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    UsersAppModule,
    {
      useFactory: (configService: ConfigUsersService) => ({
        transport: Transport.TCP,
        options: {
          port: configService.getData(ENV_KEYS.USERS_MICROSERVICE_PORT),
        },
      }),
      inject: [ConfigUsersService],
    },
  );

  await app.listen();
}
bootstrap();
