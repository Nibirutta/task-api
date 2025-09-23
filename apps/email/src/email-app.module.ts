import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { AppConfigModule } from '@app/common';

@Module({
    imports: [EmailModule, AppConfigModule],
    controllers: [],
    providers: [],
})
export class EmailAppModule {}
