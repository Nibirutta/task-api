import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
    ENV_KEYS,
    AppConfigModule,
    AppConfigService,
    TRANSPORTER_PROVIDER,
} from '@app/common';
import { CredentialsModule } from './credentials/credentials.module';
import { TokensModule } from './tokens/tokens.module';
import { AuthAppController } from './auth-app.controller';
import { AuthAppService } from './auth-app.service';
import { ClientProxyFactory } from '@nestjs/microservices';

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
        CredentialsModule,
        TokensModule,
    ],
    controllers: [AuthAppController],
    providers: [
        AuthAppService,
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
export class AuthAppModule {}
