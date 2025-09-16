import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions } from '@nestjs/microservices';
import {
    ValidationPipe,
    RpcExceptionFilter,
    AppConfigService,
} from '@app/common';
import { ProfileAppModule } from './profile-app.module';

async function bootstrap() {
    const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
        ProfileAppModule,
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
