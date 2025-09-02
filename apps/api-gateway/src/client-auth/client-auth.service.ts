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
import { pick, omit } from 'lodash';
import { forkJoin, lastValueFrom, retry, timeout } from 'rxjs';
import { ClientUsersService } from '../client-users/client-users.service';

@Injectable()
export class ClientAuthService implements OnApplicationBootstrap {
    constructor(
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
        private readonly clientUsersService: ClientUsersService,
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
                this.transporter
                    .send(AUTH_PATTERNS.CREATE, createCredentialDto)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw new RpcException(error);
        }

        const createPersonalDataDto: CreatePersonalDataDto = {
            owner: credentialData.id,
            ...pick(createUserDto, ['firstName', 'lastName']),
        };

        try {
            userData = await this.clientUsersService.createUser(
                createPersonalDataDto,
            );
        } catch (error) {
            try {
                await lastValueFrom(
                    this.transporter
                        .send(AUTH_PATTERNS.DELETE, credentialData.id)
                        .pipe(retry(3), timeout(1000)),
                );
            } catch (rollbackError) {
                // Elaborate a more suitable log system later on
                console.log(
                    'Require manual changes in the Database - Error: ' +
                        rollbackError,
                );
            }

            throw new RpcException(error);
        }

        const { accessTokenPayloadDto, sessionTokenPayloadDto } =
            this.generateDtoForTokens(userData, credentialData);

        const userInfo = omit(sessionTokenPayloadDto, ['email', 'sub']);

        try {
            const tokens = await lastValueFrom(
                forkJoin({
                    accessToken: this.transporter.send(
                        AUTH_PATTERNS.GENERATE_TOKEN,
                        {
                            payload: accessTokenPayloadDto,
                            tokenType: TokenType.ACCESS,
                        },
                    ),
                    sessionToken: this.transporter.send(
                        AUTH_PATTERNS.GENERATE_TOKEN,
                        {
                            payload: sessionTokenPayloadDto,
                            tokenType: TokenType.SESSION,
                        },
                    ),
                }).pipe(retry(3), timeout(1000)),
            );

            return {
                userInfo,
                ...tokens,
            };
        } catch (error) {
            try {
                await lastValueFrom(
                    forkJoin([
                        this.transporter.send(
                            AUTH_PATTERNS.DELETE,
                            credentialData.id,
                        ),
                        this.transporter.send(
                            USER_PATTERNS.DELETE,
                            userData.id,
                        ),
                    ]).pipe(retry(3), timeout(1000)),
                );
            } catch (rollbackError) {
                // Elaborate a more suitable log system later on
                console.log(
                    'Require manual changes in the Database - Error: ' +
                        rollbackError,
                );
            }

            throw new RpcException(error);
        }
    }

    async update(id: string, updateCredentialDto: UpdateCredentialDto) {
        try {
            return await lastValueFrom(
                this.transporter
                    .send(AUTH_PATTERNS.UPDATE, {
                        id,
                        updateCredentialDto,
                    })
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw new RpcException(error);
        }
    }

    async delete(id: string) {
        try {
            await lastValueFrom(
                forkJoin([
                    this.transporter.send(AUTH_PATTERNS.DELETE, id),
                    this.transporter.send(AUTH_PATTERNS.DELETE_ALL_TOKENS, id),
                ]).pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw new RpcException(error);
        }

        try {
            await this.clientUsersService.deleteUser(id);

            return {
                userDeleted: true,
            };
        } catch (error) {
            console.log(
                'Require manual changes in the Database - Error: ' + error,
            );

            throw new RpcException(error);
        }
    }

    async login(loginRequestDto: LoginRequestDto) {
        let credentialData: ICredentialData;

        try {
            credentialData = await lastValueFrom(
                this.transporter
                    .send(AUTH_PATTERNS.LOGIN, loginRequestDto)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw new RpcException(error);
        }

        try {
            const userData: IUserData = await lastValueFrom<IUserData>(
                this.transporter
                    .send(USER_PATTERNS.FIND, credentialData.id)
                    .pipe(retry(3), timeout(1000)),
            );

            const { accessTokenPayloadDto, sessionTokenPayloadDto } =
                this.generateDtoForTokens(userData, credentialData);

            const userInfo = omit(sessionTokenPayloadDto, ['email', 'sub']);

            const tokens = await lastValueFrom(
                forkJoin({
                    accessToken: this.transporter.send(
                        AUTH_PATTERNS.GENERATE_TOKEN,
                        {
                            payload: accessTokenPayloadDto,
                            tokenType: TokenType.ACCESS,
                        },
                    ),
                    sessionToken: this.transporter.send(
                        AUTH_PATTERNS.GENERATE_TOKEN,
                        {
                            payload: sessionTokenPayloadDto,
                            tokenType: TokenType.SESSION,
                        },
                    ),
                }).pipe(retry(3), timeout(1000)),
            );

            return {
                userInfo,
                ...tokens,
            };
        } catch (error) {
            throw new RpcException(error);
        }
    }

    private generateDtoForTokens(
        userData: IUserData,
        credentialData: ICredentialData,
    ) {
        const accessTokenPayloadDto: AccessTokenPayloadDto = {
            sub: userData.owner,
            username: credentialData.username,
        };

        const sessionTokenPayloadDto: SessionTokenPayloadDto = {
            sub: credentialData.id,
            username: credentialData.username,
            email: credentialData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            preferences: userData.preferences,
            userCreatedAt: credentialData.createdAt,
            userUpdatedAt:
                credentialData.updatedAt >= userData.updatedAt
                    ? credentialData.updatedAt
                    : userData.updatedAt,
        };

        return {
            accessTokenPayloadDto,
            sessionTokenPayloadDto,
        };
    }
}
