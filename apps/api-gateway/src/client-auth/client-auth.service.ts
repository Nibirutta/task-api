import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
    AUTH_PATTERNS,
    LoginRequestDto,
    CreateCredentialDto,
    UpdateCredentialDto,
    CreateUserDto,
    CreatePersonalDataDto,
    USER_PATTERNS,
    AccessTokenPayloadDto,
    SessionTokenPayloadDto,
    TokenType,
    ICredentialData,
    IUserData,
    TRANSPORTER_PROVIDER,
} from '@app/common';
import { pick } from 'lodash';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ClientAuthService implements OnApplicationBootstrap {
    constructor(
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.transporter.connect();
        console.log('Connected to transporter');
    }

    async create(createUserDto: CreateUserDto) {
        const createCredentialDto: CreateCredentialDto = pick(createUserDto, [
            'username',
            'email',
            'password',
        ]);

        let credentialData: ICredentialData;
        let userData: IUserData;

        try {
            credentialData = await lastValueFrom<ICredentialData>(
                this.transporter.send(
                    AUTH_PATTERNS.CREATE,
                    createCredentialDto,
                ),
            );
        } catch (error) {
            throw new RpcException(error);
        }

        const createPersonalDataDto: CreatePersonalDataDto = {
            owner: credentialData.id,
            ...pick(createUserDto, ['firstName', 'lastName']),
        };

        try {
            userData = await lastValueFrom<IUserData>(
                this.transporter.send(
                    USER_PATTERNS.CREATE,
                    createPersonalDataDto,
                ),
            );
        } catch (error) {
            throw new RpcException(error);
        }

        const accessTokenPayloadDto: AccessTokenPayloadDto = {
            sub: userData.owner,
            username: credentialData.username,
        };

        const sessionTokenPayloadDto: SessionTokenPayloadDto = {
            sub: userData.owner,
            username: credentialData.username,
            email: credentialData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            preferences: userData.preferences,
        };

        try {
            const accessToken = await lastValueFrom(
                this.transporter.send(AUTH_PATTERNS.GENERATE_TOKEN, {
                    payload: accessTokenPayloadDto,
                    tokenType: TokenType.ACCESS,
                }),
            );
            const sessionToken = await lastValueFrom(
                this.transporter.send(AUTH_PATTERNS.GENERATE_TOKEN, {
                    payload: sessionTokenPayloadDto,
                    tokenType: TokenType.SESSION,
                }),
            );

            return {
                accessToken,
                sessionToken,
            };
        } catch (error) {
            throw new RpcException(error);
        }
    }

    async update(id: string, updateCredentialDto: UpdateCredentialDto) {
        try {
            return await lastValueFrom(
                this.transporter.send(AUTH_PATTERNS.UPDATE, {
                    id,
                    updateCredentialDto,
                }),
            );
        } catch (error) {
            throw new RpcException(error);
        }
    }

    async delete(id: string) {
        try {
            return await lastValueFrom(
                this.transporter.send(AUTH_PATTERNS.DELETE, id),
            );
        } catch (error) {
            throw new RpcException(error);
        }
    }

    async login(loginRequestDto: LoginRequestDto) {
        try {
            return await lastValueFrom(
                this.transporter.send(AUTH_PATTERNS.LOGIN, loginRequestDto),
            );
        } catch (error) {
            throw new RpcException(error);
        }
    }
}
