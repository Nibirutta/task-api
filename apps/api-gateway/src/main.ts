import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import { corsOptions } from './configCors';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(ApiGatewayModule);

    app.enableCors(corsOptions);

    const { httpAdapter } = app.get(HttpAdapterHost);
    app.set('trust proxy', 1);
    app.use(cookieParser());
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
        }),
    );

    await app.listen(process.env.GATEWAY_PORT ?? 3000);
}
bootstrap();
