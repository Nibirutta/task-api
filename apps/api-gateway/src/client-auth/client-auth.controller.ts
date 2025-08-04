import { Controller, Post, Body, Patch } from '@nestjs/common';
import { RegisterRequestDto, UpdateRequestDto } from '@app/common';

import { ClientAuthService } from './client-auth.service';

@Controller('auth')
export class ClientAuthController {
  constructor(private readonly authClient: ClientAuthService) {}

  @Post()
  create(@Body() registerRequestDto: RegisterRequestDto) {
    return this.authClient.create(registerRequestDto);
  }

  @Patch()
  update(@Body() updateRequestDto: UpdateRequestDto) {
    return this.authClient.update(updateRequestDto);
  }
}
