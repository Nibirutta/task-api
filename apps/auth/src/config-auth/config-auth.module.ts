import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { ConfigAuthService } from './config-auth.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: false,
            validationSchema: joi.object({
                AUTH_MICROSERVICE_PORT: joi.number().default(3002),
                DATABASE_URL: joi.string(),
            }),
        }),
    ],
    providers: [ConfigAuthService],
    exports: [ConfigAuthService],
})
export class ConfigAuthModule {}
