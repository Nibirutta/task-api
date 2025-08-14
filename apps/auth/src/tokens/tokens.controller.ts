import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TokensService } from './tokens.service';
import { AUTH_PATTERNS } from '@app/common';

@Controller()
export class TokensController {
    constructor(private readonly tokensService: TokensService) {}

    @MessagePattern(AUTH_PATTERNS.SIGN_IN)
    signIn(@Payload() payload: any) {
        return this.tokensService.signIn(payload);
    }
}
