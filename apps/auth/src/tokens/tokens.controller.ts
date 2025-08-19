import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TokensService } from './tokens.service';
import {
    AccessTokenPayloadDto,
    AUTH_PATTERNS,
    ResetTokenPayloadDto,
    SessionTokenPayloadDto,
    TokenType,
} from '@app/common';

@Controller()
export class TokensController {
    constructor(private readonly tokensService: TokensService) {}

    @MessagePattern(AUTH_PATTERNS.GENERATE_TOKEN)
    generateToken(
        @Payload('payload')
        payload:
            | AccessTokenPayloadDto
            | SessionTokenPayloadDto
            | ResetTokenPayloadDto,
        @Payload('tokenType') tokenType: TokenType,
    ) {
        return this.tokensService.generateToken(payload, tokenType);
    }
}
