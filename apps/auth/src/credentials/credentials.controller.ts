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
    constructor(private readonly authService: CredentialsService) {}

    @MessagePattern(AUTH_PATTERNS.CREATE)
    create(@Payload() createCredentialDto: CreateCredentialDto) {
        return this.authService.createCredential(createCredentialDto);
    }

    @MessagePattern(AUTH_PATTERNS.UPDATE)
    update(
        @Payload('id', ParseObjectIdPipe) id: string,
        @Payload('updateCredentialDto')
        updateCredentialDto: UpdateCredentialDto,
    ) {
        return this.authService.updateCredential(id, updateCredentialDto);
    }

    @MessagePattern(AUTH_PATTERNS.DELETE)
    delete(@Payload('id', ParseObjectIdPipe) id: string) {
        return this.authService.delete(id);
    }

    @MessagePattern(AUTH_PATTERNS.LOGIN)
    login(@Payload() loginRequestDto: LoginRequestDto) {
        return this.authService.login(loginRequestDto);
    }

    @MessagePattern(AUTH_PATTERNS.VALIDATE_USER)
    validateUser(@Payload('id', ParseObjectIdPipe) id: string) {
        return this.authService.validateUser(id);
    }
}
