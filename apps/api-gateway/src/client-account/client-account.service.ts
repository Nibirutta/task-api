import { Injectable } from '@nestjs/common';
import { ClientAuthService } from '../client-auth/client-auth.service';
import {
    CreateAccountDto,
    CreateCredentialDto,
    ICredentialData,
    CreateProfileDto,
    IProfileData,
    AccessTokenPayloadDto,
    SessionTokenPayloadDto,
    LoginRequestDto,
} from '@app/common';
import { pick } from 'lodash';
import { ClientProfileService } from '../client-profile/client-profile.service';

@Injectable()
export class ClientAccountService {
    constructor(
        private readonly clientAuthService: ClientAuthService,
        private readonly clientProfileService: ClientProfileService,
    ) {}

    async createAccount(createUserDto: CreateAccountDto) {
        const createCredentialDto: CreateCredentialDto = pick(createUserDto, [
            'username',
            'email',
            'password',
        ]);

        let profileData: IProfileData;
        let tokens;

        const credentialData: ICredentialData =
            await this.clientAuthService.createCredential(createCredentialDto);

        const createProfileDto: CreateProfileDto = {
            owner: credentialData.id,
            ...pick(createUserDto, ['firstName', 'lastName']),
        };

        try {
            profileData = await this.clientProfileService.createProfile(
                createProfileDto,
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
            await this.clientProfileService.deleteProfile(credentialData.id);

            throw error;
        }

        return {
            credentialData,
            userData: profileData,
            ...tokens,
        };
    }

    async login(loginRequestDto: LoginRequestDto) {
        const validatedCredential =
            await this.clientAuthService.validateCredential(loginRequestDto);

        const validatedProfile = await this.clientProfileService.findProfile(
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
            userData: validatedProfile,
            ...tokens,
        };
    }

    async deleteAccount(id: string) {
        await this.clientAuthService.deleteCredential(id);
        const deletedProfile = await this.clientProfileService.deleteProfile(id);
        await this.clientAuthService.deleteUserTokens(id);

        return {
            userDeleted: deletedProfile.firstName,
        };
    }
}
