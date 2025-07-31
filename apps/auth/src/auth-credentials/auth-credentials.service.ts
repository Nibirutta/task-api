import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Credential } from '../schemas/Credential.schema';
import { CreateCredentialDto, CredentialDto } from '@app/common';

@Injectable()
export class AuthCredentialsService {
  constructor(
    @InjectModel(Credential.name)
    private readonly credentialModel: Model<Credential>,
  ) {}

  async createCredential(credentialDto: CreateCredentialDto): Promise<CredentialDto> {
    const newCredential = new this.credentialModel(credentialDto);
    await newCredential.save();

    const savedCredential: CredentialDto = {
        id: newCredential._id.toString(),
        ...newCredential
    }
    
    return savedCredential;
  }
}
