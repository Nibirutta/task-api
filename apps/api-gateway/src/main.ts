import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import { corsOptions } from './configCors';
import { AllExceptionsFilter } from './filters/all-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(ApiGatewayModule);

    app.enableCors(corsOptions);

    const { httpAdapter } = app.get(HttpAdapterHost);
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
