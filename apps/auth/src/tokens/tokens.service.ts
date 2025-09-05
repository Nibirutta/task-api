import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from '../schemas/Token.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import {
    AccessTokenPayloadDto,
    AppConfigService,
    ENV_KEYS,
    ResetTokenPayloadDto,
    SessionTokenPayloadDto,
    TokenConfigService,
    TokenType,
} from '@app/common';
import { CredentialsService } from '../credentials/credentials.service';

@Injectable()
export class TokensService {
    constructor(
        @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
        private readonly jwtService: JwtService,
        private readonly configService: AppConfigService,
        private readonly tokenConfigService: TokenConfigService,
        private readonly credentialService: CredentialsService,
    ) { }

    async generateToken(
        payload:
            | AccessTokenPayloadDto
            | SessionTokenPayloadDto
            | ResetTokenPayloadDto,
        tokenType: TokenType,
    ): Promise<string> {
        switch (tokenType) {
            case TokenType.ACCESS:
                const accessToken = await this.jwtService.signAsync(payload, {
                    expiresIn:
                        this.tokenConfigService.getTokenDuration(tokenType),
                    secret: this.getSecretByTokenType(tokenType),
                });

                const accessTokenData = {
                    token: accessToken,
                    type: TokenType.ACCESS,
                    owner: payload.sub,
                    expiresAt:
                        this.tokenConfigService.getTokenExpirationDate(
                            tokenType,
                        ),
                };

                await this.tokenModel.create(accessTokenData);

                return accessToken;
            case TokenType.SESSION:
                const sessionToken = await this.jwtService.signAsync(payload, {
                    expiresIn:
                        this.tokenConfigService.getTokenDuration(tokenType),
                    secret: this.getSecretByTokenType(tokenType),
                });

                const sessionTokenData = {
                    token: sessionToken,
                    type: TokenType.SESSION,
                    owner: payload.sub,
                    expiresAt:
                        this.tokenConfigService.getTokenExpirationDate(
                            tokenType,
                        ),
                };

                await this.tokenModel.create(sessionTokenData);

                return sessionToken;
            case TokenType.RESET:
                const resetToken = await this.jwtService.signAsync(payload, {
                    expiresIn:
                        this.tokenConfigService.getTokenDuration(tokenType),
                    secret: this.getSecretByTokenType(tokenType),
                });

                const resetTokenData = {
                    token: resetToken,
                    type: TokenType.RESET,
                    owner: payload.sub,
                    expiresAt:
                        this.tokenConfigService.getTokenExpirationDate(
                            tokenType,
                        ),
                };

                await this.tokenModel.create(resetTokenData);

                return resetToken;
        }
    }

    async validateToken(token: string, tokenType: TokenType) {
        let decodedToken;

        try {
            decodedToken = await this.jwtService.verifyAsync(token, {
                secret: this.getSecretByTokenType(tokenType),
            });
        } catch (error) {
            throw new UnauthorizedException('Invalid Token');
        }

        const foundToken = await this.tokenModel.findOne({
            token: token,
        });

        // If no token is found, it might be a sign of a hacked user or an invalid token
        // We should verify the token to ensure it's valid and then delete all tokens for that user
        if (!foundToken) {
            try {
                await this.credentialService.findCredential(decodedToken.sub);

                await this.tokenModel.deleteMany({ owner: decodedToken.sub });

                // Sends an email to the user telling him about the risks
            } catch (error) {
                throw new ForbiddenException('Token Rejected');
            }
        }

        const foundCredential = await this.credentialService.findCredential(
            decodedToken.sub,
        );

        // Verifies if the user really exists in the database, if not, delete all tokens that was linked to him
        if (!foundCredential) {
            await this.tokenModel.deleteMany({ owner: decodedToken.sub });

            throw new ForbiddenException('Token Rejected');
        }

        return decodedToken;
    }

    async deleteToken(token: string) {
        return await this.tokenModel.deleteOne({ token: token });
    }

    async deleteAllTokensFromUser(ownerId: string) {
        return await this.tokenModel.deleteMany({
            owner: ownerId,
        });
    }

    private getSecretByTokenType(tokenType: TokenType): string {
        const secretMap = {
            [TokenType.ACCESS]: this.configService.getData(
                ENV_KEYS.ACCESS_TOKEN_SECRET,
            ),
            [TokenType.SESSION]: this.configService.getData(
                ENV_KEYS.SESSION_TOKEN_SECRET,
            ),
            [TokenType.RESET]: this.configService.getData(
                ENV_KEYS.RESET_TOKEN_SECRET,
            ),
        };

        return secretMap[tokenType];
    }
}
