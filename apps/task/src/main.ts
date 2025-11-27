import { NestFactory } from '@nestjs/core';
import { TaskAppModule } from './task-app.module';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import { AppConfigService, ValidationPipe } from '@app/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
        TaskAppModule,
        {
            useFactory: (configService: AppConfigService) => {
                return configService.microserviceOptions;
            },
            inject: [AppConfigService],
            bufferLogs: true,
        },
    );

    app.useLogger(app.get(Logger));
    app.useGlobalPipes(new ValidationPipe());

    await app.listen();
}
bootstrap();
