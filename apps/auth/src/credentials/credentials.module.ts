import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { Credential, CredentialSchema } from '../schemas/Credential.schema';
import { AppConfigService, TRANSPORTER_PROVIDER } from '@app/common';
import { ClientProxyFactory } from '@nestjs/microservices';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Credential.name,
                schema: CredentialSchema,
            },
        ]),
    ],
    providers: [
        CredentialsService,
        {
            provide: TRANSPORTER_PROVIDER,
            useFactory: (configService: AppConfigService) => {
                const clientOptions = configService.clientOptions;
                return ClientProxyFactory.create(clientOptions);
            },
            inject: [AppConfigService],
        },
    ],
    controllers: [CredentialsController],
    exports: [CredentialsService],
})
export class CredentialsModule {}
