import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ConfigUsersModule } from './config-users/config-users.module';
import { ConfigUsersService } from './config-users/config-users.service';
import { ENV_KEYS } from '@app/common';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigUsersModule,
        MongooseModule.forRootAsync({
            imports: [ConfigUsersModule],
            useFactory: (configService: ConfigUsersService) => ({
                uri: configService.getData(ENV_KEYS.DATABASE_URL),
                onConnectionCreate: (connection: Connection) => {
                    console.log('Connected to mongoDB');

                    return connection;
                },
            }),
            inject: [ConfigUsersService],
        }),
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class UsersAppModule {}
