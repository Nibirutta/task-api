import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
    AUTH_PATTERNS,
    UpdateCredentialDto,
    CreateCredentialDto,
    LoginRequestDto,
} from '@app/common';
import { CredentialsService } from './credentials.service';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller()
export class CredentialsController {
    constructor(private readonly authService: CredentialsService) { }

    @MessagePattern(AUTH_PATTERNS.CREATE)
    createCredential(@Payload() createCredentialDto: CreateCredentialDto) {
        return this.authService.createCredential(createCredentialDto);
    }

    @MessagePattern(AUTH_PATTERNS.UPDATE)
    updateCredential(
        @Payload('id', ParseObjectIdPipe) id: string,
        @Payload('updateCredentialDto')
        updateCredentialDto: UpdateCredentialDto,
    ) {
        return this.authService.updateCredential(id, updateCredentialDto);
    }

    @MessagePattern(AUTH_PATTERNS.DELETE)
    deleteCredential(@Payload(ParseObjectIdPipe) id: string) {
        return this.authService.deleteCredential(id);
    }

    @MessagePattern(AUTH_PATTERNS.VALIDATE_CREDENTIAL)
    validateCredential(@Payload() loginRequestDto: LoginRequestDto) {
        return this.authService.validateCredential(loginRequestDto);
    }

    @MessagePattern(AUTH_PATTERNS.FIND)
    findCredential(@Payload(ParseObjectIdPipe) id: string) {
        return this.authService.findCredential(id);
    }
}
