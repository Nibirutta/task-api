import { Module } from '@nestjs/common';
import { TaskAppController } from './task-app.controller';
import { TaskAppService } from './task-app.service';
import { AppConfigModule } from '@app/common';

@Module({
    imports: [AppConfigModule],
    controllers: [TaskAppController],
    providers: [TaskAppService],
})
export class TaskAppModule {}
