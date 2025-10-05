import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CredentialsService } from './credentials/credentials.service';
import { TokensService } from './tokens/tokens.service';
import {
    AccessTokenPayloadDto,
    AppConfigService,
    CreateCredentialDto,
    ENV_KEYS,
    LoginRequestDto,
    ResetRequestDto,
    ResetTokenPayloadDto,
    SendEmailDto,
    SessionTokenPayloadDto,
    TokenType,
    TRANSPORTER_PROVIDER,
    UpdateCredentialDto,
    PROFILE_PATTERNS,
    EMAIL_PATTERNS,
    ResetPasswordDto,
} from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthAppService {
    constructor(
        private readonly credentialsService: CredentialsService,
        private readonly tokensService: TokensService,
        private readonly configService: AppConfigService,
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
    ) {}

    async createCredential(createCredentialDto: CreateCredentialDto) {
        const createdCredential =
            await this.credentialsService.createCredential(createCredentialDto);

        return createdCredential.toObject();
    }

    async updateCredential(
        id: string,
        updateCredentialDto: UpdateCredentialDto,
    ) {
        const updatedCredential =
            await this.credentialsService.updateCredential(
                id,
                updateCredentialDto,
            );

        this.transporter.send(PROFILE_PATTERNS.OWNER_UPDATED, id).subscribe();

        return updatedCredential.toObject();
    }

    async deleteCredential(id: string) {
        const deletedCredential =
            await this.credentialsService.deleteCredential(id);

        return deletedCredential.toObject();
    }

    async validateCredential(loginRequestDto: LoginRequestDto) {
        const validatedCredential =
            await this.credentialsService.validateCredential(loginRequestDto);

        return validatedCredential.toObject();
    }

    async findCredential(id: string) {
        const foundCredential =
            await this.credentialsService.findCredential(id);

        return foundCredential.toObject();
    }

    async requestPasswordReset(resetRequestDto: ResetRequestDto) {
        const foundCredential =
            await this.credentialsService.findCredentialByEmail(
                resetRequestDto.email,
            );

        await this.tokensService.deleteUserTokens(
            foundCredential._id.toString(),
        );

        const resetTokenPayloadDto: ResetTokenPayloadDto = {
            sub: foundCredential._id.toString(),
        };

        const resetToken = await this.tokensService.generateToken(
            resetTokenPayloadDto,
            TokenType.RESET,
        );
        const timestamp = new Date().toLocaleDateString('pt-BR');

        const sendEmailDto: SendEmailDto = {
            receiver: foundCredential.email,
            subject: 'Password Reset',
            message: `Password request was made in ${timestamp}, if was not you, please ignore this email. If you really want to reset your password, just follow this link: ${this.configService.getData(ENV_KEYS.RESET_URL)}=${resetToken}`,
        };

        this.transporter
            .send(EMAIL_PATTERNS.SEND_MAIL, sendEmailDto)
            .subscribe();

        return {
            successful: true,
        };
    }

    async resetPassword(token: string, resetPassword: ResetPasswordDto) {
        const validatedToken = await this.validateToken(token, TokenType.RESET);

        const updatedCredential = await this.credentialsService.resetPassword(
            validatedToken.sub,
            resetPassword,
        );

        return updatedCredential.toObject();
    }

    async generateToken(
        payload:
            | AccessTokenPayloadDto
            | SessionTokenPayloadDto
            | ResetTokenPayloadDto,
        tokenType: TokenType,
    ) {
        return this.tokensService.generateToken(payload, tokenType);
    }

    async validateToken(token: string, tokenType: TokenType) {
        const tokenData = await this.tokensService.validateToken(
            token,
            tokenType,
        );

        if (!tokenData.isSecure) {
            const hackedUser = await this.credentialsService.findCredential(
                tokenData.decodedToken.sub,
            );

            if (hackedUser) {
                await this.tokensService.deleteUserTokens(
                    tokenData.decodedToken.sub,
                );
            }

            // Sends an email to the user requesting a password change

            throw new ForbiddenException('Not allowed - invalid token');
        }

        return tokenData.decodedToken;
    }

    async deleteToken(token: string) {
        return this.tokensService.deleteToken(token);
    }

    async deleteUserTokens(id: string) {
        return this.tokensService.deleteUserTokens(id);
    }
}
