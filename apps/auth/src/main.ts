import { NestFactory } from '@nestjs/core';
import { Transport, AsyncMicroserviceOptions } from '@nestjs/microservices';
import { ENV_KEYS, ValidationPipe, RcpExceptionFilter } from '@app/common';
import { AuthAppModule } from './auth-app.module';
import { ConfigAuthService } from './config-auth/config-auth.service';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
        AuthAppModule,
        {
            useFactory: (configService: ConfigAuthService) => ({
                transport: Transport.TCP,
                options: {
                    port: configService.getData(
                        ENV_KEYS.AUTH_MICROSERVICE_PORT,
                    ),
                },
            }),
            inject: [ConfigAuthService],
        },
    );

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new RcpExceptionFilter());

    await app.listen();
}
bootstrap();
