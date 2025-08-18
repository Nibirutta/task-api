import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TokensService } from './tokens.service';
import {
    AccessTokenPayloadDto,
    AUTH_PATTERNS,
    SessionTokenPayloadDto,
} from '@app/common';
import { TokenType } from '../schemas/Token.schema';

@Controller()
export class TokensController {
    constructor(private readonly tokensService: TokensService) {}

    @MessagePattern(AUTH_PATTERNS.GENERATE_ACCESS_TOKEN)
    generateAccessToken(@Payload() payload: AccessTokenPayloadDto) {
        return this.tokensService.generateToken(payload, TokenType.ACCESS);
    }

    @MessagePattern(AUTH_PATTERNS.GENERATE_SESSION_TOKEN)
    generateSessionToken(@Payload() payload: SessionTokenPayloadDto) {
        return this.tokensService.generateToken(payload, TokenType.SESSION);
    }
}
