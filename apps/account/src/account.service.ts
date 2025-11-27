import { Injectable, ForbiddenException, Inject } from '@nestjs/common';
import { CredentialService } from './credential/credential.service';
import { TokenService } from './token/token.service';
import { ProfileService } from './profile/profile.service';
import { ClientProxy } from '@nestjs/microservices';
import {
    SessionTokenPayloadDto,
    AccessTokenPayloadDto,
    CreateCredentialDto,
    CreateProfileDto,
    ResetTokenPayloadDto,
} from './dto/';
import {
    CreateAccountDto,
    LoginRequestDto,
    ResetRequestDto,
    TokenType,
    UpdateAccountDto,
    ResetPasswordDto,
    TRANSPORTER_PROVIDER,
    NOTIFICATION_PATTERNS,
    SendEmailDto,
    AppConfigService,
    ENV_KEYS,
    TASK_PATTERNS,
} from '@app/common';
import { pick } from 'lodash';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class AccountService {
    constructor(
        private readonly configService: AppConfigService,
        private readonly credentialService: CredentialService,
        private readonly tokenService: TokenService,
        private readonly profileService: ProfileService,
        @Inject(TRANSPORTER_PROVIDER) private readonly transporter: ClientProxy,
        @InjectPinoLogger() private readonly logger: PinoLogger
    ) {}

    async register(createAccountDto: CreateAccountDto) {
        const createCredentialDto: CreateCredentialDto = pick(
            createAccountDto,
            ['username', 'email', 'password'],
        );

        const newCredential =
            await this.credentialService.createCredential(createCredentialDto);

        const createProfileDto: CreateProfileDto = {
            owner: newCredential.id,
            ...pick(createAccountDto, ['name']),
        };

        const newProfile =
            await this.profileService.createProfile(createProfileDto);

        const { accessToken, sessionToken } = await this.generateSessionTokens(
            newCredential.id,
            newCredential.username,
        );

        this.logger.info({ userData: { newCredential, newProfile }}, 'New user created');

        return {
            profile: newProfile,
            accessToken,
            sessionToken,
        };
    }

    async updateAccount(id: string, updateAccountDto: UpdateAccountDto) {
        const updatedCredential = await this.credentialService.updateCredential(
            id,
            updateAccountDto.email,
            updateAccountDto.password,
        );

        const updatedProfile = await this.profileService.updateProfile(
            id,
            updateAccountDto.name,
            updateAccountDto.theme,
            updateAccountDto.language,
            updateAccountDto.notification?.notificationType,
            updateAccountDto.notification?.isActivated,
        );

        const { accessToken, sessionToken } = await this.generateSessionTokens(
            updatedCredential.id,
            updatedCredential.username,
        );

        return {
            profile: updatedProfile,
            accessToken,
            sessionToken,
        };
    }

    async deleteAccount(id: string) {
        const deletedCredential = await this.credentialService.deleteCredential(id);

        const deletedProfile = await this.profileService.deleteProfile(id);

        await this.tokenService.deleteUserTokens(id);

        this.transporter.send(TASK_PATTERNS.DELETE_ALL, id).subscribe();

        this.logger.info({ userData: { deletedCredential, deletedProfile }}, 'User successfully deleted from database');

        return {
            success: true,
        };
    }

    async login(loginRequestDto: LoginRequestDto) {
        const validatedCredential =
            await this.credentialService.validateCredential(loginRequestDto);

        const foundProfile = await this.profileService.findProfile(
            validatedCredential.id,
        );

        const { accessToken, sessionToken } = await this.generateSessionTokens(
            validatedCredential.id,
            validatedCredential.username,
        );

        return {
            profile: foundProfile,
            accessToken,
            sessionToken,
        };
    }

    async refreshSession(id: string) {
        const foundCredential = await this.credentialService.findCredential(id);

        const foundProfile = await this.profileService.findProfile(id);

        const { accessToken, sessionToken } = await this.generateSessionTokens(
            foundCredential.id,
            foundCredential.username,
        );

        return {
            profile: foundProfile,
            accessToken,
            sessionToken,
        };
    }

    async requestPasswordReset(resetRequestDto: ResetRequestDto) {
        const foundCredential =
            await this.credentialService.findCredentialByEmail(
                resetRequestDto.email,
            );

        await this.tokenService.deleteUserTokens(foundCredential.id);

        const resetTokenPayloadDto: ResetTokenPayloadDto = {
            sub: foundCredential.id,
        };

        const resetToken = await this.tokenService.generateToken(
            resetTokenPayloadDto,
            TokenType.RESET,
        );

        const timestamp = new Date().toLocaleDateString('pt-BR');

        const sendEmailDto: SendEmailDto = {
            receiver: foundCredential.email,
            subject: 'Password Reset',
            message: `Password request was made in ${timestamp}, if was not you, please ignore this email. If you really want to reset your password, just follow this link: ${this.configService.getData(ENV_KEYS.RESET_URL)}=${resetToken}`,
        };

        this.logger.info(`A reset email was sent to ${foundCredential.email}`);

        this.transporter
            .send(NOTIFICATION_PATTERNS.SEND_MAIL, sendEmailDto)
            .subscribe();

        return {
            success: true,
        };
    }

    async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
        const decodedToken = await this.validateToken(token, TokenType.RESET);

        const updatedCredential = await this.credentialService.resetPassword(
            decodedToken.sub,
            resetPasswordDto,
        );

        this.logger.info(`${updatedCredential.username} successfully reseted his password`);

        return {
            success: true,
        };
    }

    async validateToken(token: string, tokenType: TokenType) {
        const tokenData = await this.tokenService.validateToken(
            token,
            tokenType,
        );

        if (!tokenData.isSecure) {
            const hackedUser = await this.credentialService.findCredential(
                tokenData.decodedToken.sub,
            );

            if (hackedUser) {
                await this.tokenService.deleteUserTokens(
                    tokenData.decodedToken.sub,
                );
            }

            this.logger.info(`Someone is trying to access ${hackedUser.username} account`);

            throw new ForbiddenException('Not allowed - invalid token');
        }

        return tokenData.decodedToken;
    }

    private async generateSessionTokens(id: string, username: string) {
        const accessTokenPayloadDto: AccessTokenPayloadDto = {
            sub: id,
            username: username,
        };

        const sessionTokenPayloadDto: SessionTokenPayloadDto = {
            sub: id,
        };

        const accessToken = await this.tokenService.generateToken(
            accessTokenPayloadDto,
            TokenType.ACCESS,
        );
        const sessionToken = await this.tokenService.generateToken(
            sessionTokenPayloadDto,
            TokenType.SESSION,
        );

        return {
            accessToken,
            sessionToken,
        };
    }
}
