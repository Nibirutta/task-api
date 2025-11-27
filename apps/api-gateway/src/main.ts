import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import { corsOptions } from './configCors';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(
        ApiGatewayModule,
        {
            bufferLogs: true,
        },
    );

    app.enableCors(corsOptions);

    app.useLogger(app.get(Logger));
    app.set('trust proxy', 1);
    app.use(cookieParser());
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
