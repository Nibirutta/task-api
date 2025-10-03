import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
    AUTH_PATTERNS,
    CreateCredentialDto,
    LoginRequestDto,
    UpdateCredentialDto,
    AccessTokenPayloadDto,
    SessionTokenPayloadDto,
    ResetTokenPayloadDto,
    TokenType,
    ResetRequestDto,
} from '@app/common';
import { AuthAppService } from './auth-app.service';

@Controller()
export class AuthAppController {
    constructor(private readonly authAppService: AuthAppService) {}

    @MessagePattern(AUTH_PATTERNS.FIND)
    findCredential(@Payload() id: string) {
        return this.authAppService.findCredential(id);
    }

    @MessagePattern(AUTH_PATTERNS.CREATE)
    createCredential(@Payload() createCredentialDto: CreateCredentialDto) {
        return this.authAppService.createCredential(createCredentialDto);
    }

    @MessagePattern(AUTH_PATTERNS.UPDATE)
    updateCredential(
        @Payload('id') id: string,
        @Payload('updateCredentialDto')
        updateCredentialDto: UpdateCredentialDto,
    ) {
        return this.authAppService.updateCredential(id, updateCredentialDto);
    }

    @MessagePattern(AUTH_PATTERNS.DELETE)
    deleteCredential(@Payload() id: string) {
        return this.authAppService.deleteCredential(id);
    }

    @MessagePattern(AUTH_PATTERNS.VALIDATE_CREDENTIAL)
    validateCredential(@Payload() loginRequestDto: LoginRequestDto) {
        return this.authAppService.validateCredential(loginRequestDto);
    }

    @MessagePattern(AUTH_PATTERNS.RESET)
    requestPasswordReset(@Payload() resetRequestDto: ResetRequestDto) {
        return this.authAppService.requestPasswordReset(resetRequestDto);
    }

    @MessagePattern(AUTH_PATTERNS.GENERATE_TOKEN)
    generateToken(
        @Payload('payload')
        payload:
            | AccessTokenPayloadDto
            | SessionTokenPayloadDto
            | ResetTokenPayloadDto,
        @Payload('tokenType') tokenType: TokenType,
    ) {
        return this.authAppService.generateToken(payload, tokenType);
    }

    @MessagePattern(AUTH_PATTERNS.VALIDATE_TOKEN)
    validateToken(
        @Payload('token') token: string,
        @Payload('tokenType') tokenType: TokenType,
    ) {
        return this.authAppService.validateToken(token, tokenType);
    }

    @MessagePattern(AUTH_PATTERNS.DELETE_TOKEN)
    deleteToken(@Payload() token: string) {
        return this.authAppService.deleteToken(token);
    }

    @MessagePattern(AUTH_PATTERNS.DELETE_USER_TOKENS)
    deleteUserTokens(@Payload() id: string) {
        return this.authAppService.deleteUserTokens(id);
    }
}
