import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Token, TokenType } from '../schemas/Token.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService, ENV_KEYS } from '@app/common';

@Injectable()
export class TokensService {
    constructor(
        @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
        private readonly jwtService: JwtService,
        private readonly configService: AppConfigService,
    ) {}

    async generateJWT(payload: any, tokenType: TokenType): Promise<string> {
        switch (tokenType) {
            case TokenType.ACCESS:
                return await this.jwtService.signAsync(payload, {
                    expiresIn: '1m',
                    secret: this.configService.getData(
                        ENV_KEYS.ACCESS_TOKEN_SECRET,
                    ),
                });
            case TokenType.SESSION:
                return await this.jwtService.signAsync(payload, {
                    expiresIn: '3d',
                    secret: this.configService.getData(
                        ENV_KEYS.SESSION_TOKEN_SECRET,
                    ),
                });
            case TokenType.RESET:
                return await this.jwtService.signAsync(payload, {
                    expiresIn: '30m',
                    secret: this.configService.getData(
                        ENV_KEYS.RESET_TOKEN_SECRET,
                    ),
                });
        }
    }

    async signIn(payload: any): Promise<{
        accessToken: string;
        sessionToken: string;
    }> {
        const tokens = {
            accessToken: await this.generateJWT(payload, TokenType.ACCESS),
            sessionToken: await this.generateJWT(payload, TokenType.SESSION),
        };

        return tokens;
    }
}
