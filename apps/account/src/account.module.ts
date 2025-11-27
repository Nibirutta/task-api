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
    MicroserviceExceptionFilter,
    TRANSPORTER_PROVIDER,
} from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { ClientProxyFactory } from '@nestjs/microservices';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';

@Module({
    imports: [
        CredentialModule,
        ProfileModule,
        TokenModule,
        AppConfigModule,
        MongooseModule.forRootAsync({
            useFactory: (
                configService: AppConfigService,
                logger: PinoLogger,
            ) => {
                logger.setContext('MongooseModule - Account');

                return {
                    uri: configService.getData(ENV_KEYS.DATABASE_URL),
                    onConnectionCreate: (connection: Connection) => {
                        logger.info('Connected to mongoose');

                        return connection;
                    },
                };
            },
            inject: [AppConfigService, PinoLogger],
        }),
        LoggerModule.forRoot(),
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
        {
            provide: APP_FILTER,
            useClass: MicroserviceExceptionFilter,
        },
    ],
})
export class AccountModule {}
