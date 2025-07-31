import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthCredentialsService } from './auth-credentials.service';
import { AuthCredentialsController } from './auth-credentials.controller';
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
  providers: [AuthCredentialsService],
  controllers: [AuthCredentialsController],
})
export class AuthCredentialsModule {}
