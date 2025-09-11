import { Injectable } from '@nestjs/common';
import { ClientAuthService } from '../client-auth/client-auth.service';
import { ClientUsersService } from '../client-users/client-users.service';
import {
    CreateAccountDto,
    CreateCredentialDto,
    ICredentialData,
    CreatePersonalDataDto,
    IUserData,
    AccessTokenPayloadDto,
    SessionTokenPayloadDto,
    LoginRequestDto,
} from '@app/common';
import { pick } from 'lodash';

@Injectable()
export class ClientAccountService {
    constructor(
        private readonly clientAuthService: ClientAuthService,
        private readonly clientUsersService: ClientUsersService,
    ) {}

    async createAccount(createUserDto: CreateAccountDto) {
        const createCredentialDto: CreateCredentialDto = pick(createUserDto, [
            'username',
            'email',
            'password',
        ]);

        let userData: IUserData;
        let tokens;

        const credentialData: ICredentialData =
            await this.clientAuthService.createCredential(createCredentialDto);

        const createPersonalDataDto: CreatePersonalDataDto = {
            owner: credentialData.id,
            ...pick(createUserDto, ['firstName', 'lastName']),
        };

        try {
            userData = await this.clientUsersService.createUser(
                createPersonalDataDto,
            );
        } catch (error) {
            await this.clientAuthService.deleteCredential(credentialData.id);

            throw error;
        }

        const accessTokenPayloadDto: AccessTokenPayloadDto = {
            sub: credentialData.id,
            username: credentialData.username,
        };

        const sessionTokenPayloadDto: SessionTokenPayloadDto = {
            sub: credentialData.id,
        };

        try {
            tokens = await this.clientAuthService.generateUserTokens(
                accessTokenPayloadDto,
                sessionTokenPayloadDto,
            );
        } catch (error) {
            await this.clientAuthService.deleteCredential(credentialData.id);
            await this.clientUsersService.deleteUser(credentialData.id);

            throw error;
        }

        return {
            credentialData,
            userData,
            ...tokens,
        };
    }

    async login(loginRequestDto: LoginRequestDto) {
        const validatedCredential =
            await this.clientAuthService.validateCredential(loginRequestDto);

        const validatedUser = await this.clientUsersService.findUser(
            validatedCredential.id,
        );

        const accessTokenPayloadDto: AccessTokenPayloadDto = {
            sub: validatedCredential.id,
            username: validatedCredential.username,
        };

        const sessionTokenPayloadDto: SessionTokenPayloadDto = {
            sub: validatedCredential.id,
        };

        const tokens = await this.clientAuthService.generateUserTokens(
            accessTokenPayloadDto,
            sessionTokenPayloadDto,
        );

        return {
            credentialData: validatedCredential,
            userData: validatedUser,
            ...tokens,
        };
    }

    async deleteAccount(id: string) {
        await this.clientAuthService.deleteCredential(id);
        const deletedUser = await this.clientUsersService.deleteUser(id);
        await this.clientAuthService.deleteUserTokens(id);

        return deletedUser;
    }
}
