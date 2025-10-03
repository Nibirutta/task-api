import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { AppConfigModule } from '@app/common';
import { EmailAppController } from './email-app.controller';
import { EmailAppService } from './email-app.service';

@Module({
    imports: [EmailModule, AppConfigModule],
    controllers: [EmailAppController],
    providers: [EmailAppService],
})
export class EmailAppModule {}
