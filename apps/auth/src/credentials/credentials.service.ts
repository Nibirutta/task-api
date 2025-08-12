import {
    Injectable,
    ConflictException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
    UpdateCredentialDto,
    CreateCredentialDto,
    LoginRequestDto,
} from '@app/common';
import * as bcrypt from 'bcrypt';
import { omit, pick } from 'lodash';
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

    async createCredential(createCredentialDto: CreateCredentialDto) {
        const foundUser = await this.credentialModel.findOne({
            $or: [
                {
                    username: createCredentialDto.username,
                },
                { email: createCredentialDto.email },
            ],
        });

        if (foundUser)
            throw new ConflictException('Username or email is already used');

        const newCredentialData = {
            ...omit(createCredentialDto, ['password']),
            hashedPassword: await this.hashPassword(
                createCredentialDto.password,
            ),
        };

        const newCredential = new this.credentialModel(newCredentialData);
        await newCredential.save();

        return pick(newCredential.toObject(), ['id']);
    }

    async updateCredential(
        id: string,
        updateCredentialDto: UpdateCredentialDto,
    ) {
        const updateData = {
            ...omit(updateCredentialDto, ['password']),
            ...(updateCredentialDto.password && {
                hashedPassword: await this.hashPassword(
                    updateCredentialDto.password,
                ),
            }),
        };

        const updatedUser = await this.credentialModel.findByIdAndUpdate(
            id,
            updateData,
            {
                runValidators: true,
                new: true,
            },
        );

        if (!updatedUser) throw new NotFoundException('User not found');

        return updatedUser.toObject();
    }

    async login(loginRequestDto: LoginRequestDto) {
        const foundUser = await this.credentialModel.findOne({
            $or: [
                {
                    email: loginRequestDto.email,
                },
                {
                    username: loginRequestDto.username,
                },
            ],
        });

        if (!foundUser) throw new NotFoundException('User not found');

        const isValidPassword = await bcrypt.compare(
            loginRequestDto.password,
            foundUser.hashedPassword,
        );

        if (!isValidPassword)
            throw new UnauthorizedException('Invalid credentials');

        return { login: 'successful' };
    }

    async delete(id: string) {
        const foundUser = await this.credentialModel.findByIdAndDelete({ id });

        if (!foundUser) throw new NotFoundException('User not found');

        return foundUser;
    }
}
