import { Module } from '@nestjs/common';
import { ClientAccountModule } from './client-account/client-account.module';
import { ClientTaskModule } from './client-task/client-task.module';
import { LoggerModule } from 'nestjs-pino';
import { Request, Response } from 'express';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exception.filter';

@Module({
    imports: [
        ClientAccountModule,
        ClientTaskModule,
        LoggerModule.forRoot({
            pinoHttp: {
                serializers: {
                    req: (req: Request) => ({
                        id: req.id,
                        method: req.method,
                        url: req.url,
                        query: req.query,
                        params: req.params,
                        headers: req.headers,
                    }),
                    res: (res: Response) => ({
                        statusCode: res.statusCode,
                    }),
                },
            },
        }),
    ],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class ApiGatewayModule {}
