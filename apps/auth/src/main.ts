import { NestFactory } from '@nestjs/core';
import { Transport, AsyncMicroserviceOptions } from '@nestjs/microservices';
import {
    ENV_KEYS,
    ValidationPipe,
    RcpExceptionFilter,
    AppConfigService,
} from '@app/common';
import { AuthAppModule } from './auth-app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
        AuthAppModule,
        {
            useFactory: (configService: AppConfigService) => ({
                transport: Transport.TCP,
                options: {
                    port: configService.getData(
                        ENV_KEYS.AUTH_MICROSERVICE_PORT,
                    ),
                },
            }),
            inject: [AppConfigService],
        },
    );

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new RcpExceptionFilter());

    await app.listen();
}
bootstrap();
