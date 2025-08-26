import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
    AUTH_CLIENT,
    AUTH_PATTERNS,
    LoginRequestDto,
    CreateCredentialDto,
    UpdateCredentialDto,
    CreateUserDto,
    CreatePersonalDataDto,
    USER_PATTERNS,
    USERS_CLIENT,
    AccessTokenPayloadDto,
    SessionTokenPayloadDto,
    TokenType,
} from '@app/common';
import { pick } from 'lodash';
import { lastValueFrom } from 'rxjs';
import {
    ICredentialData,
    IUserData,
} from '@app/common/interfaces/user-data.interface';

@Injectable()
export class ClientAuthService implements OnApplicationBootstrap {
    constructor(
        @Inject(AUTH_CLIENT) private readonly authClient: ClientProxy,
        @Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.authClient.connect();
        await this.usersClient.connect();
        console.log('Auth and Users microservice connected');
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
                this.authClient.send(AUTH_PATTERNS.CREATE, createCredentialDto),
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
                this.usersClient.send(
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
                this.authClient.send(AUTH_PATTERNS.GENERATE_TOKEN, {
                    payload: accessTokenPayloadDto,
                    tokenType: TokenType.ACCESS,
                }),
            );
            const sessionToken = await lastValueFrom(
                this.authClient.send(AUTH_PATTERNS.GENERATE_TOKEN, {
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
                this.authClient.send(AUTH_PATTERNS.UPDATE, {
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
                this.authClient.send(AUTH_PATTERNS.DELETE, id),
            );
        } catch (error) {
            throw new RpcException(error);
        }
    }

    async login(loginRequestDto: LoginRequestDto) {
        try {
            return await lastValueFrom(
                this.authClient.send(AUTH_PATTERNS.LOGIN, loginRequestDto),
            );
        } catch (error) {
            throw new RpcException(error);
        }
    }
}
