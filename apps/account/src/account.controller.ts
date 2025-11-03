import { Controller } from '@nestjs/common';
import { AccountService } from './account.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
    ACCOUNT_PATTERNS,
    CreateAccountDto,
    LoginRequestDto,
    ResetPasswordDto,
    ResetRequestDto,
    TokenType,
    UpdateAccountDto,
    SessionResponseDto,
} from '@app/common';
import { TokenService } from './token/token.service';
import { plainToInstance } from 'class-transformer';

@Controller()
export class AccountController {
    constructor(
        private readonly accountService: AccountService,
        private readonly tokenService: TokenService,
    ) {}

    @MessagePattern(ACCOUNT_PATTERNS.REGISTER)
    async register(@Payload() createAccountDto: CreateAccountDto) {
        const sessionRequestDto =
            await this.accountService.register(createAccountDto);

        return plainToInstance(SessionResponseDto, sessionRequestDto, {
            excludeExtraneousValues: true,
        });
    }

    @MessagePattern(ACCOUNT_PATTERNS.UPDATE)
    async updateAccount(
        @Payload('id') id: string,
        @Payload('updateAccountDto') updateAccountDto: UpdateAccountDto,
    ) {
        const sessionRequestDto = await this.accountService.updateAccount(
            id,
            updateAccountDto,
        );

        return plainToInstance(SessionResponseDto, sessionRequestDto, {
            excludeExtraneousValues: true,
        });
    }

    @MessagePattern(ACCOUNT_PATTERNS.DELETE)
    async deleteAccount(@Payload() id: string) {
        return this.accountService.deleteAccount(id);
    }

    @MessagePattern(ACCOUNT_PATTERNS.LOGIN)
    async login(@Payload() loginRequestDto: LoginRequestDto) {
        const sessionRequestDto =
            await this.accountService.login(loginRequestDto);

        return plainToInstance(SessionResponseDto, sessionRequestDto, {
            excludeExtraneousValues: true,
        });
    }

    @MessagePattern(ACCOUNT_PATTERNS.LOGOUT)
    async logout(@Payload() token: string) {
        return this.tokenService.deleteToken(token);
    }

    @MessagePattern(ACCOUNT_PATTERNS.REFRESH_SESSION)
    async refreshSession(@Payload() id: string) {
        const sessionRequestDto = await this.accountService.refreshSession(id);

        return plainToInstance(SessionResponseDto, sessionRequestDto, {
            excludeExtraneousValues: true,
        });
    }

    @MessagePattern(ACCOUNT_PATTERNS.REQUEST_PASSWORD_RESET)
    async requestPasswordReset(@Payload() resetRequestDto: ResetRequestDto) {
        return this.accountService.requestPasswordReset(resetRequestDto);
    }

    @MessagePattern(ACCOUNT_PATTERNS.RESET_PASSWORD)
    async resetPassword(
        @Payload('token') token: string,
        @Payload('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
    ) {
        return this.accountService.resetPassword(token, resetPasswordDto);
    }

    @MessagePattern(ACCOUNT_PATTERNS.VALIDATE_TOKEN)
    async validateToken(
        @Payload('token') token: string,
        @Payload('tokenType') tokenType: TokenType,
    ) {
        return this.accountService.validateToken(token, tokenType);
    }
}
