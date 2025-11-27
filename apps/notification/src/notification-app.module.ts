import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { AppConfigModule, MicroserviceExceptionFilter } from '@app/common';
import { NotificationAppController } from './notification-app.controller';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';

@Module({
    imports: [EmailModule, AppConfigModule, LoggerModule.forRoot()],
    controllers: [NotificationAppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: MicroserviceExceptionFilter,
        },
    ],
})
export class NotificationAppModule {}
