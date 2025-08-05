import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  UpdateRequestDto,
  RegisterRequestDto,
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
}
