import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { AppConfigModule } from '@app/common';
import { NotificationAppController } from './notification-app.controller';

@Module({
    imports: [EmailModule, AppConfigModule],
    controllers: [NotificationAppController],
    providers: [],
})
export class NotificationAppModule {}
