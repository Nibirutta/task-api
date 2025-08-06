import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import {
  CreateCredentialDto,
  UpdateRequestDto,
  RegisterRequestDto,
  UpdateCredentialDto,
  LoginRequestDto,
} from '@app/common';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';

import { Credential } from '../schemas/Credential.schema';

@Injectable()
export class CredentialsService {
  constructor(
    @InjectModel(Credential.name)
    private readonly credentialModel: Model<Credential>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async createCredential(registerRequestDto: RegisterRequestDto) {
    const foundUser = await this.credentialModel.findOne({
      $or: [
        {
          username: registerRequestDto.username,
        },
        { email: registerRequestDto.email },
      ],
    });

    if (foundUser)
      throw new RpcException(new ConflictException('User already exists'));

    const hashedPassword = await this.hashPassword(registerRequestDto.password);
    const newCredentialData: CreateCredentialDto = {
      ...omit(registerRequestDto, ['password']),
      hashedPassword,
    };

    const newCredential = new this.credentialModel(newCredentialData);
    await newCredential.save();

    return newCredential.toObject();
  }

  // Tokens logic it'll be implemented here, but until there i'll keep this simple login function
  async updateCredential(updateRequestDto: UpdateRequestDto) {
    const updateData: UpdateCredentialDto = {
      ...updateRequestDto,
    };

    if (updateRequestDto.password) {
      updateData.hashedPassword = await this.hashPassword(updateRequestDto.password);
    }

    const updatedCredential = await this.credentialModel.findByIdAndUpdate(
      updateData.id,
      updateData,
    ).exec();

    if (!updatedCredential) throw new RpcException(new NotFoundException('User not found'));

    return updatedCredential.toObject();
  }

  async login(loginRequestDto: LoginRequestDto) {
    const foundUser = await this.credentialModel.findOne({
      $or: [
        {
          email: loginRequestDto.email,
        },
        {
          username: loginRequestDto.username
        },
      ],
    });

    if (!foundUser) throw new RpcException(new NotFoundException('User not found'));

    const isValidPassword = await bcrypt.compare(loginRequestDto.password, foundUser.hashedPassword);

    if (!isValidPassword) throw new RpcException(new UnauthorizedException('Invalid credentials'));

    return { 'login': 'successful' };
  }

  // Tokens logic it'll be implemented here, but until there i'll keep this simple delete function
  async delete(id: string) {
    const foundUser = await this.credentialModel.findOneAndDelete({ _id: id })

    if (!foundUser) throw new RpcException(new NotFoundException('User not found'));

    return foundUser;
  }
}
