import { ForbiddenException, Injectable } from '@nestjs/common';
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

@Injectable()
export class TokensService {
    constructor(
        @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
        private readonly jwtService: JwtService,
        private readonly configService: AppConfigService,
        private readonly tokenConfigService: TokenConfigService,
    ) {}

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
        if (tokenType === TokenType.ACCESS) {
            try {
                const decodedToken = this.jwtService.verify(token, {
                    secret: this.getSecretByTokenType(tokenType),
                });

                return {
                    isSecure: true,
                    decodedToken: decodedToken,
                };
            } catch (error) {
                throw new ForbiddenException('Not allowed - invalid token');
            }
        } else {
            const foundToken = await this.tokenModel.findOne({ token: token });

            if (!foundToken) {
                try {
                    const decodedToken = this.jwtService.verify(token, {
                        secret: this.getSecretByTokenType(tokenType),
                    });

                    return {
                        isSecure: false,
                        decodedToken: decodedToken,
                    }
                } catch (error) {
                    throw new ForbiddenException('Not allowed - invalid token');
                }
            }

            try {
                const decodedToken = this.jwtService.verify(token, {
                    secret: this.getSecretByTokenType(tokenType),
                });

                return {
                    isSecure: true,
                    decodedToken: decodedToken,
                };
            } catch (error) {
                throw new ForbiddenException('Not allowed - invalid token');
            }
        }
    }

    async deleteToken(token: string) {
        return await this.tokenModel.deleteOne({ token: token });
    }

    async deleteUserTokens(ownerId: string) {
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
