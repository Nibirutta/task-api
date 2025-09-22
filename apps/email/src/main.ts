import { NestFactory } from '@nestjs/core';
import { EmailAppModule } from './email-app.module';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import {
    AppConfigService,
    RpcExceptionFilter,
    ValidationPipe,
} from '@app/common';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
        EmailAppModule,
        {
            useFactory: (configService: AppConfigService) => {
                return configService.microserviceOptions;
            },
            inject: [AppConfigService],
        },
    );

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new RpcExceptionFilter());

    await app.listen();
}
bootstrap();
