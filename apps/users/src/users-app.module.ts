import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ENV_KEYS, AppConfigModule, AppConfigService } from '@app/common';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        AppConfigModule,
        MongooseModule.forRootAsync({
            imports: [AppConfigModule],
            useFactory: (configService: AppConfigService) => ({
                uri: configService.getData(ENV_KEYS.DATABASE_URL),
                onConnectionCreate: (connection: Connection) => {
                    console.log('Connected to mongoDB');

                    return connection;
                },
            }),
            inject: [AppConfigService],
        }),
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class UsersAppModule {}
