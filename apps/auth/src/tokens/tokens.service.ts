import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenType } from '../schemas/Token.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import {
    AccessTokenPayloadDto,
    AppConfigService,
    ENV_KEYS,
    ResetTokenPayloadDto,
    SessionTokenPayloadDto,
} from '@app/common';

@Injectable()
export class TokensService {
    constructor(
        @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
        private readonly jwtService: JwtService,
        private readonly configService: AppConfigService,
    ) {}

    async generateToken(
        payload:
            | AccessTokenPayloadDto
            | SessionTokenPayloadDto
            | ResetTokenPayloadDto,
        tokenType: TokenType,
    ): Promise<string> {
        const expirationDate = new Date();

        switch (tokenType) {
            case TokenType.ACCESS:
                const accessToken = await this.jwtService.signAsync(payload, {
                    expiresIn: '1m',
                    secret: this.configService.getData(
                        ENV_KEYS.ACCESS_TOKEN_SECRET,
                    ),
                });

                return accessToken;
            case TokenType.SESSION:
                const sessionToken = await this.jwtService.signAsync(payload, {
                    expiresIn: '3d',
                    secret: this.configService.getData(
                        ENV_KEYS.SESSION_TOKEN_SECRET,
                    ),
                });

                expirationDate.setDate(expirationDate.getDate() + 3);

                const sessionTokenData = {
                    token: sessionToken,
                    type: TokenType.SESSION,
                    owner: payload.sub,
                    expiresAt: expirationDate,
                };

                await this.tokenModel.create(sessionTokenData);

                return sessionToken;
            case TokenType.RESET:
                const resetToken = await this.jwtService.signAsync(payload, {
                    expiresIn: '30m',
                    secret: this.configService.getData(
                        ENV_KEYS.RESET_TOKEN_SECRET,
                    ),
                });

                expirationDate.setMinutes(expirationDate.getMinutes() + 30);

                const resetTokenData = {
                    token: resetToken,
                    type: TokenType.RESET,
                    owner: payload.sub,
                    expiresAt: expirationDate,
                };

                await this.tokenModel.create(resetTokenData);

                return resetToken;
        }
    }
}
