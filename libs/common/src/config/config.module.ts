import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as joi from 'joi';
import { AppConfigService } from './config.service';

@Global()
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: false,
            validationSchema: joi.object({
                USERS_MICROSERVICE_PORT: joi.number().default(3001),
                AUTH_MICROSERVICE_PORT: joi.number().default(3002),
                DATABASE_URL: joi.string(),
            }),
        }),
    ],
    providers: [AppConfigService],
    exports: [AppConfigService],
})
export class AppConfigModule {}
