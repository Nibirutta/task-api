import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
    AUTH_PATTERNS,
    LoginRequestDto,
    CreateCredentialDto,
    UpdateCredentialDto,
    AccessTokenPayloadDto,
    SessionTokenPayloadDto,
    TokenType,
    ICredentialData,
    TRANSPORTER_PROVIDER,
} from '@app/common';
import { forkJoin, lastValueFrom, retry, timeout } from 'rxjs';

@Injectable()
export class ClientAuthService implements OnApplicationBootstrap {
    constructor(
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.transporter.connect();
        console.log('Client auth connected to transporter');
    }

    async findCredential(id: string) {
        try {
            return await lastValueFrom<ICredentialData>(
                this.transporter.send(AUTH_PATTERNS.FIND, id)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async validateCredential(
        loginRequestDto: LoginRequestDto,
    ): Promise<ICredentialData> {
        try {
            return await lastValueFrom<ICredentialData>(
                this.transporter
                    .send(AUTH_PATTERNS.VALIDATE_CREDENTIAL, loginRequestDto)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async createCredential(
        createCredentialDto: CreateCredentialDto,
    ): Promise<ICredentialData> {
        try {
            return lastValueFrom<ICredentialData>(
                this.transporter
                    .send(AUTH_PATTERNS.CREATE, createCredentialDto)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async generateUserTokens(
        accessTokenPayloadDto: AccessTokenPayloadDto,
        sessionTokenPayloadDto: SessionTokenPayloadDto,
    ): Promise<{ accessToken: string; sessionToken: string }> {
        try {
            return lastValueFrom(
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
        } catch (error) {
            throw error;
        }
    }

    async deleteUserTokens(id: string) {
        try {
            await lastValueFrom(
                this.transporter
                    .send(AUTH_PATTERNS.DELETE_USER_TOKENS, id)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async updateCredential(
        id: string,
        updateCredentialDto: UpdateCredentialDto,
    ) {
        try {
            return lastValueFrom(
                this.transporter
                    .send(AUTH_PATTERNS.UPDATE, {
                        id,
                        updateCredentialDto,
                    })
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async deleteCredential(id: string) {
        try {
            return lastValueFrom(
                this.transporter
                    .send(AUTH_PATTERNS.DELETE, id)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }
}
