import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CredentialService } from './credential.service';
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
    providers: [CredentialService],
    controllers: [],
    exports: [CredentialService],
})
export class CredentialModule {}
