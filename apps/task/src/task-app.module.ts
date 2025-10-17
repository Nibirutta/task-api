import { Module } from '@nestjs/common';
import { TaskAppController } from './task-app.controller';
import { TaskAppService } from './task-app.service';
import { AppConfigModule, AppConfigService, ENV_KEYS } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
    imports: [
        AppConfigModule,
        MongooseModule.forRootAsync({
            useFactory: (configService: AppConfigService) => ({
                uri: configService.getData(ENV_KEYS.DATABASE_URL),
                onConnectionCreate: (connection: Connection) => {
                    console.log("Connected to mongoose");
                    
                    return connection;
                },
            }),
            inject: [AppConfigService]
        }),
    ],
    controllers: [TaskAppController],
    providers: [TaskAppService],
})
export class TaskAppModule {}
