import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { AppConfigService } from './config.service';
import { TokenConfigService } from './token-config.service';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: false,
            validationSchema: joi.object({
                PROFILE_MICROSERVICE_PORT: joi.number().default(3001),
                AUTH_MICROSERVICE_PORT: joi.number().default(3002),
                EMAIL_MICROSERVICE_PORT: joi.number().default(3003),
                DEV_EMAIL: joi.string(),
                DEV_EMAIL_PASSWORD: joi.string(),
                RESET_URL: joi.string(),
                DATABASE_URL: joi.string(),
            }),
        }),
    ],
    providers: [AppConfigService, TokenConfigService],
    exports: [AppConfigService, TokenConfigService],
})
export class AppConfigModule {}
