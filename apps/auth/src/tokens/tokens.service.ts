import { Injectable } from '@nestjs/common';
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
                    secret: this.configService.getData(
                        ENV_KEYS.ACCESS_TOKEN_SECRET,
                    ),
                });

                return accessToken;
            case TokenType.SESSION:
                const sessionToken = await this.jwtService.signAsync(payload, {
                    expiresIn:
                        this.tokenConfigService.getTokenDuration(tokenType),
                    secret: this.configService.getData(
                        ENV_KEYS.SESSION_TOKEN_SECRET,
                    ),
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
                    secret: this.configService.getData(
                        ENV_KEYS.RESET_TOKEN_SECRET,
                    ),
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
}
