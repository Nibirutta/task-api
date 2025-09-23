import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ENV_KEYS, AppConfigModule, AppConfigService } from '@app/common';
import { ProfileModule } from './profile/profile.module';

@Module({
    imports: [
        AppConfigModule,
        MongooseModule.forRootAsync({
            useFactory: (configService: AppConfigService) => ({
                uri: configService.getData(ENV_KEYS.DATABASE_URL),
                onConnectionCreate: (connection: Connection) => {
                    console.log('Connected to mongoDB');

                    return connection;
                },
            }),
            inject: [AppConfigService],
        }),
        ProfileModule,
    ],
    controllers: [],
    providers: [],
})
export class ProfileAppModule {}
