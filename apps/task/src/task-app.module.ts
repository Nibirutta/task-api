import { Module } from '@nestjs/common';
import { TaskAppController } from './task-app.controller';
import {
    AppConfigModule,
    AppConfigService,
    ENV_KEYS,
    MicroserviceExceptionFilter,
} from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { TaskModule } from './task/task.module';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';

@Module({
    imports: [
        AppConfigModule,
        MongooseModule.forRootAsync({
            useFactory: (
                configService: AppConfigService,
                logger: PinoLogger,
            ) => {
                logger.setContext('MongooseModule - Task');

                return {
                    uri: configService.getData(ENV_KEYS.DATABASE_URL),
                    onConnectionCreate: (connection: Connection) => {
                        logger.info('Connected to mongoose');

                        return connection;
                    },
                };
            },
            inject: [AppConfigService, PinoLogger],
        }),
        TaskModule,
        LoggerModule.forRoot(),
    ],
    controllers: [TaskAppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: MicroserviceExceptionFilter,
        },
    ],
})
export class TaskAppModule {}
