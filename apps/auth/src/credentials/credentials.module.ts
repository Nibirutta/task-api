import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { Credential, CredentialSchema } from '../schemas/Credential.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Credential.name,
                schema: CredentialSchema,
            },
        ]),
    ],
    providers: [CredentialsService],
    controllers: [CredentialsController],
    exports: [CredentialsService],
})
export class CredentialsModule {}
