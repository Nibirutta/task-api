import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CredentialsService } from './credentials.service';
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
    controllers: [],
    exports: [CredentialsService],
})
export class CredentialsModule {}
