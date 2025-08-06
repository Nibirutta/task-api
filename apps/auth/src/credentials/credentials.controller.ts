import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  UpdateRequestDto,
  RegisterRequestDto,
  LoginRequestDto,
} from '@app/common';

import { CredentialsService } from './credentials.service';

@Controller()
export class CredentialsController {
  constructor(private readonly authService: CredentialsService) {}

  @MessagePattern(AUTH_PATTERNS.CREATE)
  create(@Payload() registerRequestDto: RegisterRequestDto) {
    return this.authService.createCredential(registerRequestDto);
  }

  @MessagePattern(AUTH_PATTERNS.UPDATE)
  update(@Payload() updateRequestDto: UpdateRequestDto) {
    return this.authService.updateCredential(updateRequestDto);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  login(@Payload() loginRequestDto: LoginRequestDto) {
    return this.authService.login(loginRequestDto);
  }

  @MessagePattern(AUTH_PATTERNS.DELETE)
  delete(@Payload() id: string) {
    return this.authService.delete(id);
  }
}
