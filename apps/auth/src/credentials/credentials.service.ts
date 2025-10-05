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
    ResetPasswordDto,
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

    async createCredential(createCredentialDto: CreateCredentialDto) {
        const foundCredential = await this.credentialModel.findOne({
            $or: [
                {
                    username: createCredentialDto.username,
                },
                { email: createCredentialDto.email },
            ],
        });

        if (foundCredential)
            throw new ConflictException('Username or email is already used');

        const newCredentialData = {
            ...omit(createCredentialDto, ['password']),
            hashedPassword: await this.hashPassword(
                createCredentialDto.password,
            ),
        };

        const newCredential =
            await this.credentialModel.create(newCredentialData);

        return newCredential;
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

        const updatedCredential = await this.credentialModel.findByIdAndUpdate(
            id,
            updateData,
            {
                runValidators: true,
                new: true,
            },
        );

        if (!updatedCredential)
            throw new NotFoundException('Credential not found');

        return updatedCredential;
    }

    async validateCredential(loginRequestDto: LoginRequestDto) {
        const foundCredential = await this.credentialModel.findOne({
            $or: [
                {
                    email: loginRequestDto.email,
                },
                {
                    username: loginRequestDto.username,
                },
            ],
        });

        if (!foundCredential)
            throw new NotFoundException('Credential not found');

        const isValidPassword = await bcrypt.compare(
            loginRequestDto.password,
            foundCredential.hashedPassword,
        );

        if (!isValidPassword)
            throw new UnauthorizedException('Invalid credentials');

        return foundCredential;
    }

    async deleteCredential(id: string) {
        const deletedCredential =
            await this.credentialModel.findByIdAndDelete(id);

        if (!deletedCredential)
            throw new NotFoundException('Credential not found');

        return deletedCredential;
    }

    async findCredential(id: string) {
        const foundCredential = await this.credentialModel.findById(id);

        if (!foundCredential)
            throw new NotFoundException('Credential not found');

        return foundCredential;
    }

    async findCredentialByEmail(email: string) {
        const foundCredential = await this.credentialModel.findOne({
            email: email,
        });

        if (!foundCredential)
            throw new NotFoundException('Credential not found');

        return foundCredential;
    }

    async resetPassword(id: string, resetPasswordDto: ResetPasswordDto) {
        const hashedPassword = await this.hashPassword(
            resetPasswordDto.password,
        );

        const updatedCredential = await this.credentialModel.findByIdAndUpdate(
            id,
            { hashedPassword: hashedPassword },
            { runValidators: true, new: true },
        );

        if (!updatedCredential)
            throw new NotFoundException('Credential not found');

        return updatedCredential;
    }

    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
}
