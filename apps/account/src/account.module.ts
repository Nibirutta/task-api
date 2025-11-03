import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ProfileModule } from './profile/profile.module';
import { TokenModule } from './token/token.module';
import { CredentialModule } from './credential/credential.module';
import {
    AppConfigModule,
    AppConfigService,
    ENV_KEYS,
    TRANSPORTER_PROVIDER,
} from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
    imports: [
        CredentialModule,
        ProfileModule,
        TokenModule,
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
    ],
    controllers: [AccountController],
    providers: [
        AccountService,
        {
            provide: TRANSPORTER_PROVIDER,
            useFactory: (configService: AppConfigService) => {
                const clientOptions = configService.clientOptions;
                return ClientProxyFactory.create(clientOptions);
            },
            inject: [AppConfigService],
        },
    ],
})
export class AccountModule {}
