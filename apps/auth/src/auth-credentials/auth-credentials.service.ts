import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCredentialDto, CredentialDto } from '@app/common';
import { plainToClass } from 'class-transformer';

import { Credential } from '../schemas/Credential.schema';

@Injectable()
export class AuthCredentialsService {
  constructor(
    @InjectModel(Credential.name)
    private readonly credentialModel: Model<Credential>,
  ) {}

  async createCredential(
    credentialDto: CreateCredentialDto,
  ) {
    const newCredential = new this.credentialModel(credentialDto);
    await newCredential.save();

    const savedCredential: CredentialDto = plainToClass(CredentialDto, newCredential.toObject());

    return savedCredential;
  }
}
