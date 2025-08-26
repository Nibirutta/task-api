import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import {
    ValidationPipe,
    RcpExceptionFilter,
    AppConfigService,
} from '@app/common';
import { AuthAppModule } from './auth-app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
        AuthAppModule,
        {
            useFactory: (configService: AppConfigService) => {
                return configService.microserviceOptions;
            },
            inject: [AppConfigService],
        },
    );

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new RcpExceptionFilter());

    await app.listen();
}
bootstrap();
