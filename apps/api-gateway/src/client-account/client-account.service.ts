import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
    CreateAccountDto,
    LoginRequestDto,
    ResetRequestDto,
    ResetPasswordDto,
    TRANSPORTER_PROVIDER,
    SessionResponseDto,
    ACCOUNT_PATTERNS,
    UpdateAccountDto,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, retry, timeout } from 'rxjs';

@Injectable()
export class ClientAccountService implements OnApplicationBootstrap {
    constructor(
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    async onApplicationBootstrap() {
        await this.transporter.connect();
        console.log('Client account connected to the transporter');
    }

    async register(createAccountDto: CreateAccountDto) {
        try {
            return await lastValueFrom<SessionResponseDto>(
                this.transporter
                    .send(ACCOUNT_PATTERNS.REGISTER, createAccountDto)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async updateAccount(id: string, updateAccountDto: UpdateAccountDto) {
        try {
            return await lastValueFrom<SessionResponseDto>(
                this.transporter
                    .send(ACCOUNT_PATTERNS.UPDATE, {
                        id,
                        updateAccountDto,
                    })
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async deleteAccount(id: string) {
        try {
            return await lastValueFrom(
                this.transporter
                    .send(ACCOUNT_PATTERNS.DELETE, id)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async login(loginRequestDto: LoginRequestDto) {
        try {
            return await lastValueFrom<SessionResponseDto>(
                this.transporter
                    .send(ACCOUNT_PATTERNS.LOGIN, loginRequestDto)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async refreshSession(id: string) {
        try {
            return await lastValueFrom<SessionResponseDto>(
                this.transporter
                    .send(ACCOUNT_PATTERNS.REFRESH_SESSION, id)
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async requestPasswordReset(resetRequestDto: ResetRequestDto) {
        try {
            return await lastValueFrom(
                this.transporter
                    .send(
                        ACCOUNT_PATTERNS.REQUEST_PASSWORD_RESET,
                        resetRequestDto,
                    )
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }

    async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
        try {
            return await lastValueFrom(
                this.transporter
                    .send(ACCOUNT_PATTERNS.RESET_PASSWORD, {
                        token,
                        resetPasswordDto,
                    })
                    .pipe(retry(3), timeout(1000)),
            );
        } catch (error) {
            throw error;
        }
    }
}
