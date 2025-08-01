import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateCredentialDto,
  UpdateCredentialDto,
  AUTH_PATTERNS,
} from '@app/common';

import { AuthCredentialsService } from './auth-credentials.service';

@Controller()
export class AuthCredentialsController {
  constructor(private readonly authService: AuthCredentialsService) {}

  @MessagePattern(AUTH_PATTERNS.CREATE)
  create(@Payload() createCredentialDto: CreateCredentialDto) {
    return this.authService.createCredential(createCredentialDto);
  }
}
